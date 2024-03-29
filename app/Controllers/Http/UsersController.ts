import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import StoreUserValidator from 'App/Validators/StoreUserValidator'

export default class UsersController {
   public async store({ request, response, auth }: HttpContextContract) {
      const userPayload = await request.validate(StoreUserValidator)

      const [usernameAlreadyExists, emailAlreadyExists] = await Promise.all([
         User.findBy('username', userPayload.username),
         User.findBy('email', userPayload.email),
      ])

      if (usernameAlreadyExists && emailAlreadyExists) throw new Error('User already exists.')

      if (usernameAlreadyExists) throw new Error('Username already exists.')
      if (emailAlreadyExists) throw new Error('Email already exists.')

      const isAdm = userPayload.isAdm ? true : false

      const user = await User.create({ ...userPayload, isAdm })

      if (!user) return response.badRequest()

      const email = userPayload.email
      const password = userPayload.password

      const token = await auth.use('api').attempt(email, password, { expiresIn: '7days' })

      const expires = Number(token.expiresAt)

      return response.created({ user, token, expires })
   }

   public async index({ response, auth }: HttpContextContract) {
      const user = await User.findOrFail(auth.user!.id)
      return response.ok(user)
   }
}
