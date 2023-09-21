import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

export default class Collection extends BaseModel {
   // @column({ isPrimary: true })
   // public id: string

   @column({ columnName: 'user_id' })
   public userId: string

   @column()
   public name: string

   @column({ columnName: 'model_id', isPrimary: true })
   public modelId: string

   @column({ columnName: 'num_items' })
   public numItems: number

   @column({ columnName: 'show_home' })
   public showHome: boolean

   @column({ columnName: 'final_date' })
   public finalDate: Date

   @column.dateTime({ autoCreate: true })
   public createdAt: DateTime

   @column.dateTime({ autoCreate: true, autoUpdate: true })
   public updatedAt: DateTime
}
