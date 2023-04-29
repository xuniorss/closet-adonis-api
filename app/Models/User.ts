import Hash from '@ioc:Adonis/Core/Hash'
import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'

export default class User extends BaseModel {
   @column({ isPrimary: true })
   public id: string

   @column()
   public username: string

   @column()
   public email: string

   @column({ serializeAs: null })
   public password: string

   @column({ columnName: 'is_adm' })
   public isAdm: boolean

   @column.dateTime({ autoCreate: true })
   public createdAt: DateTime

   @column.dateTime({ autoCreate: true, autoUpdate: true })
   public updatedAt: DateTime

   @beforeSave()
   public static async hashPassword(user: User) {
      user.id = uuid()
      if (user.$dirty.password) {
         user.password = await Hash.make(user.password)
      }
   }
}
