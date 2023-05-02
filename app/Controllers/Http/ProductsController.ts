import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Product from 'App/Models/Product'
import ProductsImage from 'App/Models/ProductsImage'
import ProductsSize from 'App/Models/ProductsSize'
import ProductsSpecification from 'App/Models/ProductsSpecification'
import CreateProductValidator from 'App/Validators/CreateProductValidator'
import crypto from 'crypto'

export default class ProductsController {
   public async store({ request, response, auth }: HttpContextContract) {
      const prodcutPayload = await request.validate(CreateProductValidator)

      const price = prodcutPayload.price.replace(/\./g, '').replace(/\,/g, '.')

      prodcutPayload.price = price

      const data = {
         user_id: auth.user!.id,
         model_id: prodcutPayload.model_id,
         product_name: prodcutPayload.product_name,
         price: prodcutPayload.price,
         description: prodcutPayload.description,
         quantity: prodcutPayload.quantity,
      }

      await Product.create(data).then(async (response) => {
         const dataSizes = prodcutPayload.size.map((size) => ({
            productId: response.id,
            sizeId: size,
         }))

         const dataImages = prodcutPayload.image_url.map((image) => ({
            productId: response.id,
            imageUrl: image,
            mediaId: prodcutPayload.mediaId,
         }))

         await Promise.all([
            ProductsSize.createMany(dataSizes),
            ProductsImage.createMany(dataImages),
         ])

         if (prodcutPayload.color || prodcutPayload.composition) {
            const randomBytes = crypto.randomBytes(4) // gera 4 bytes aleatórios
            const randomNumber = parseInt(randomBytes.toString('hex'), 16) % 100000000 // converte os bytes em um número de 8 dígitos

            const dataSpec = {
               product_id: response.id,
               color: prodcutPayload.color,
               composition: prodcutPayload.composition,
               generic_code: String(randomNumber),
            }

            await ProductsSpecification.create(dataSpec)
         }
      })

      return response.created()
   }

   public async index({ response }: HttpContextContract) {
      const products = await Database.rawQuery(`
         SELECT products.*, image.image_url FROM products
         LEFT JOIN (
         SELECT DISTINCT ON (products_images.product_id)
            products_images.product_id as prod_id,
            products_images.image_url as image_url
         FROM products_images
         ) AS image
         ON image.prod_id = products.id
         WHERE products.quantity > 0
         GROUP BY products.id, image.image_url
         ORDER BY products.created_at DESC
      `)

      return response.ok(products.rows)
   }

   public async indexByQueryString({ request, response }: HttpContextContract) {
      const qs = request.qs()

      const qsResult = await Database.rawQuery(`
         SELECT products.*, image.image_url FROM products
         LEFT JOIN (
         SELECT DISTINCT ON (products_images.product_id)
            products_images.product_id as prod_id,
            products_images.image_url as image_url
         FROM products_images
         ) AS image
         ON image.prod_id = products.id
         WHERE products.quantity > 0
         AND LOWER(products.product_name) like '%${qs.q}%'
         GROUP BY products.id, image.image_url
         ORDER BY products.created_at DESC
      `)

      return response.ok(qsResult.rows)
   }

   public async indexById({ request, response }: HttpContextContract) {
      const productid = request.param('productid') as string

      const [product, productImage, productSize, productSpec] = await Promise.all([
         Product.findOrFail(productid),
         ProductsImage.query().select('*').where('product_id', productid),
         Database.rawQuery(`
            select distinct
               products_sizes.*,
               sizes.size
            from products_sizes
            left join sizes on sizes.id = products_sizes.size_id
            where products_sizes.product_id = '${productid}'
            order by sizes.size desc
         `),
         ProductsSpecification.findBy('product_id', productid),
      ])

      const data = {
         product,
         productImage,
         productSize: productSize.rows,
         productSpec,
      }

      return response.ok(data)
   }

   public async relatedProductsIndex({ request, response }: HttpContextContract) {
      const productid = request.param('productid') as string

      const products = await Database.rawQuery(`
         SELECT
            products.*, image.image_url
         FROM
            products
         LEFT JOIN (
            SELECT DISTINCT ON (products_images.product_id)
               products_images.product_id as prod_id,
               products_images.image_url as image_url
            FROM products_images
         ) AS image
         ON image.prod_id = products.id
         WHERE products.quantity > 0
         AND PRODUCTS.MODEL_ID IN (
            SELECT model_id
            FROM products
            WHERE id = '${productid}'
         )
         and products.id <> '${productid}'
         GROUP BY products.id, image.image_url
         ORDER BY products.created_at DESC
      `)

      return response.ok(products.rows)
   }

   public async noRelatedProductsIndex({ request, response }: HttpContextContract) {
      const productid = request.param('productid') as string

      const products = await Database.rawQuery(`
         SELECT
            products.*, image.image_url
         FROM
            products
         LEFT JOIN (
            SELECT DISTINCT ON (products_images.product_id)
               products_images.product_id as prod_id,
               products_images.image_url as image_url
            FROM products_images
         ) AS image
         ON image.prod_id = products.id
         WHERE products.quantity > 0
         AND PRODUCTS.MODEL_ID not IN (
            SELECT model_id
            FROM products
            WHERE id = '${productid}'
         )
         and products.id <> '${productid}'
            GROUP BY products.id, image.image_url
         limit 3
      `)

      return response.ok(products.rows)
   }

   public async newsTodayIndex({ response }: HttpContextContract) {
      const todayProducts = await Database.rawQuery(`
         SELECT products.*, image.image_url FROM products
         LEFT JOIN (
         SELECT DISTINCT ON (products_images.product_id)
            products_images.product_id as prod_id,
            products_images.image_url as image_url
         FROM products_images
         ) AS image
         ON image.prod_id = products.id
         where products.quantity > 0
         and created_at::date = CURRENT_DATE
         order by created_at desc
      `)

      return response.ok(todayProducts.rows)
   }

   public async newsWeekIndex({ response }: HttpContextContract) {
      const weekProducts = await Database.rawQuery(`
         SELECT products.*, image.image_url FROM products
         LEFT JOIN (
         SELECT DISTINCT ON (products_images.product_id)
            products_images.product_id as prod_id,
            products_images.image_url as image_url
         FROM products_images
         ) AS image
         ON image.prod_id = products.id
         where products.quantity > 0
         and DATE(created_at) BETWEEN NOW() - INTERVAL '7 days' AND NOW()
         order by created_at desc
      `)

      return response.ok(weekProducts.rows)
   }

   public async deleteProducts({ request, response }: HttpContextContract) {
      const productid = request.param('productid') as string

      await Product.query().delete().where('id', productid)

      return response.noContent()
   }
}
