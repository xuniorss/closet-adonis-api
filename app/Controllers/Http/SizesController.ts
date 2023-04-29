import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Size from 'App/Models/Size'
import CreateSizeValidator from 'App/Validators/CreateSizeValidator'

export default class SizesController {
   public async store({ request, response, auth }: HttpContextContract) {
      const { size, description } = await request.validate(CreateSizeValidator)

      const alreadyExistsSize = await Size.query()
         .where('size', size.toUpperCase())
         .andWhere('description', String(description))
         .first()

      if (alreadyExistsSize) throw new Error('Size already exists.')

      const descriptionString = description as string

      const data = {
         user_id: auth.user!.id,
         size: size.toUpperCase(),
         description: descriptionString,
      }

      await Size.create(data)

      return response.created()
   }
}
