import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'

export default class Model extends BaseModel {
   @column({ isPrimary: true })
   public id: string

   @column({ columnName: 'user_id' })
   public userId: string

   @column({ columnName: 'model_name' })
   public modelName: string

   @column.dateTime({ autoCreate: true })
   public createdAt: DateTime

   @column.dateTime({ autoCreate: true, autoUpdate: true })
   public updatedAt: DateTime

   @beforeSave()
   public static async modelConfigs(model: Model) {
      model.id = uuid()
   }
}
