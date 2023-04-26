import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Product from 'App/Models/Product'
import CreateProductValidator from 'App/Validators/CreateProductValidator'

export default class ProductsController {
   public async store({ request, response, auth }: HttpContextContract) {
      const prodcutPayload = await request.validate(CreateProductValidator)

      const price = prodcutPayload.price
         .slice(3, prodcutPayload.price.length)
         .replace(/\./g, '')
         .replace(/\,/g, '.')

      prodcutPayload.price = price

      const data = {
         ...prodcutPayload,
         user_id: auth.user!.id,
      }

      await Product.create(data)

      return response.created()
   }
}
