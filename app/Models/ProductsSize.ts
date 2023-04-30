import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuid } from 'uuid'

export default class ProductsSize extends BaseModel {
   @column({ isPrimary: true })
   public id: string

   @column({ columnName: 'product_id' })
   public productId: string

   @column({ columnName: 'size_id' })
   public sizeId: string

   @column.dateTime({ autoCreate: true })
   public createdAt: DateTime

   @column.dateTime({ autoCreate: true, autoUpdate: true })
   public updatedAt: DateTime

   @beforeSave()
   public static async productSizeConfigs(psize: ProductsSize) {
      psize.id = uuid()
   }
}
