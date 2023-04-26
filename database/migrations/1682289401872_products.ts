import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
   protected tableName = 'products'

   public async up() {
      this.schema.createTable(this.tableName, (table) => {
         table.uuid('id', { primaryKey: true }).primary()
         table
            .uuid('user_id')
            .unsigned()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE')
            .comment('identification of the logged in user who registered the product')
         table.string('product_code', 10).notNullable().unsigned()
         table.uuid('model_id').unsigned().references('id').inTable('models').onDelete('CASCADE')
         table.string('product_name', 200).notNullable()
         table.decimal('price', 14, 2).notNullable().defaultTo(0).comment('Value in BRL')
         table.enum('size', ['p', 'm', 'g', 'gg']).notNullable()
         table.string('description', 500).nullable().defaultTo(null)
         table.integer('quantity').notNullable().defaultTo(0).comment('amount of merchandise')
         table
            .bigInteger('image_id')
            .notNullable()
            .defaultTo(0)
            .comment('code generated from firebase')
         table.string('image_url').notNullable().defaultTo('')
         /**
          * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
          */
         table.timestamp('created_at', { useTz: true })
         table.timestamp('updated_at', { useTz: true })
      })
   }

   public async down() {
      this.schema.dropTable(this.tableName)
   }
}
