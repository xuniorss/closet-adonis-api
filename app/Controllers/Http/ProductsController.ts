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
      const products = await Product.query().select('*').where('quantity', '>', '0')
      return response.ok(products)
   }
}
