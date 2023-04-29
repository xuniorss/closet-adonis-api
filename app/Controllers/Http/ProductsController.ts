import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Product from 'App/Models/Product'
import CreateProductValidator from 'App/Validators/CreateProductValidator'

export default class ProductsController {
   public async store({ request, response, auth }: HttpContextContract) {
      const prodcutPayload = await request.validate(CreateProductValidator)

      const price = prodcutPayload.price.replace(/\./g, '').replace(/\,/g, '.')

      prodcutPayload.price = price

      const data = {
         ...prodcutPayload,
         user_id: auth.user!.id,
      }

      await Product.create(data)

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
