import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Product from 'App/Models/Product'
import CreateProductValidator from 'App/Validators/CreateProductValidator'

export default class ProductsController {
   public async store({ request, response, auth }: HttpContextContract) {
      const prodcutPayload = await request.validate(CreateProductValidator)

      const data = {
         user_id: auth.user!.id,
         ...prodcutPayload,
      }

      await Product.create(data)

      return response.created()
   }
}
