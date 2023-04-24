import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import StoreSessionValidator from 'App/Validators/StoreSessionValidator'

export default class SessionsController {
   public async store({ request, response, auth }: HttpContextContract) {
      await request.validate(StoreSessionValidator)

      const userAuth = request.input('userAuth') as string
      const password = request.input('password') as string

      const user = await User.findByOrFail('email', userAuth)

      const token = await auth.use('api').attempt(userAuth, password, { expiresIn: '7days' })

      const expires = Number(token.expiresAt)

      return response.created({ user, token, expires })
   }
}
