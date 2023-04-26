import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Model from 'App/Models/Model'
import CreateModelValidator from 'App/Validators/CreateModelValidator'

export default class ModelsController {
   public async store({ request, response, auth }: HttpContextContract) {
      const modelPayload = await request.validate(CreateModelValidator)

      const modelnameAlreadyExists = await Model.findBy('model_name', modelPayload.modelname)

      if (modelnameAlreadyExists) throw new Error('Modelname already exists.')

      const data = {
         user_id: auth.user!.id,
         model_name: modelPayload.modelname,
         description: modelPayload.description,
      }

      const model = await Model.create(data)

      return response.created(model)
   }

   public async index({ response }: HttpContextContract) {
      const models = await Model.query().select('*')
      return response.ok(models)
   }
}
