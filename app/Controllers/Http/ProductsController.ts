import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
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
      const products = await Product.query()
         .select('*')
         .where('quantity', '>', '0')
         .orderBy('created_at', 'desc')
      return response.ok(products)
   }

   public async indexById({ request, response }: HttpContextContract) {
      const productid = request.param('productid') as string

      const product = await Product.findOrFail(productid)

      return response.ok(product)
   }

   public async newsTodayIndex({ response }: HttpContextContract) {
      const todayProducts = await Product.query()
         .select('*')
         .where('quantity', '>', '0')
         .andWhereRaw('created_at::date = CURRENT_DATE')
         .orderBy('created_at', 'desc')

      return response.ok(todayProducts)
   }

   public async newsWeekIndex({ response }: HttpContextContract) {
      const weekProducts = await Product.query()
         .select('*')
         .where('quantity', '>', '0')
         .andWhereRaw(`DATE(created_at) BETWEEN NOW() - INTERVAL '7 days' AND NOW()`)
         .orderBy('created_at', 'desc')

      return response.ok(weekProducts)
   }
}
