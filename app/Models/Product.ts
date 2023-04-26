import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'

export default class Product extends BaseModel {
   @column({ isPrimary: true })
   public id: string

   @column({ columnName: 'user_id' })
   public userId: string

   @column({ columnName: 'product_code' })
   public productCode: string

   @column({ columnName: 'model_id' })
   public modelId: string

   @column({ columnName: 'product_name' })
   public productName: string

   @column()
   public price: number

   @column()
   public size: string

   @column()
   public description: string

   @column()
   public quantity: number

   @column({ columnName: 'image_url' })
   public imageUrl: string

   @column({ columnName: 'image_id' })
   public imageId: string

   @column.dateTime({ autoCreate: true })
   public createdAt: DateTime

   @column.dateTime({ autoCreate: true, autoUpdate: true })
   public updatedAt: DateTime

   @beforeSave()
   public static async productConfigs(product: Product) {
      product.id = uuid()
   }
}
