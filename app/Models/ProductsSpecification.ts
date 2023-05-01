import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'

export default class ProductsSpecification extends BaseModel {
   @column({ isPrimary: true })
   public id: string

   @column({ columnName: 'product_id' })
   public productId: string

   @column()
   public color: string | null

   @column()
   public composition: string | null

   @column({ columnName: 'generic_code' })
   public genericCode: string

   @column.dateTime({ autoCreate: true })
   public createdAt: DateTime

   @column.dateTime({ autoCreate: true, autoUpdate: true })
   public updatedAt: DateTime

   @beforeSave()
   public static async productSpecConfigs(pspec: ProductsSpecification) {
      pspec.id = uuid()
   }
}
