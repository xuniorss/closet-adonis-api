import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuid } from 'uuid'

export default class ProductsImage extends BaseModel {
   @column({ isPrimary: true })
   public id: string

   @column({ columnName: 'product_id' })
   public productId: string

   @column({ columnName: 'image_url' })
   public imageUrl: string

   @column({ columnName: 'media_id' })
   public mediaId: number

   @column.dateTime({ autoCreate: true })
   public createdAt: DateTime

   @column.dateTime({ autoCreate: true, autoUpdate: true })
   public updatedAt: DateTime

   @beforeSave()
   public static async productSizeConfigs(pimg: ProductsImage) {
      pimg.id = uuid()
   }
}
