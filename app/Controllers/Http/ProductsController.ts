import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Product from 'App/Models/Product'
import ProductsImage from 'App/Models/ProductsImage'
import ProductsSize from 'App/Models/ProductsSize'
import CreateProductValidator from 'App/Validators/CreateProductValidator'

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
         }))

         await Promise.all([
            ProductsSize.createMany(dataSizes),
            ProductsImage.createMany(dataImages),
         ])
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

      const [product, productImage, productSize] = await Promise.all([
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
      ])

      const data = {
         product,
         productImage,
         productSize: productSize.rows,
      }

      return response.ok(data)
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
}
