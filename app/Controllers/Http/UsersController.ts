import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import StoreUserValidator from 'App/Validators/StoreUserValidator'

export default class UsersController {
   public async store({ request, response, auth }: HttpContextContract) {
      const userPayload = await request.validate(StoreUserValidator)

      const usernameAlreadyExists = await User.findBy('username', userPayload.username)
      const emailAlreadyExists = await User.findBy('email', userPayload.email)

      if (usernameAlreadyExists && emailAlreadyExists) throw new Error('User already exists.')

      if (usernameAlreadyExists) throw new Error('Username already exists.')
      if (emailAlreadyExists) throw new Error('Email already exists.')

      const user = await User.create({ ...userPayload })

      if (!user) return response.badRequest()

      const userAuth = userPayload.email
      const password = userPayload.password

      const token = await auth.use('api').attempt(userAuth, password, { expiresIn: '7days' })

      const expires = Number(token.expiresAt)

      return response.created({ user, token, expires })
   }
}
