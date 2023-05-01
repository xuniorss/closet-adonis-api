import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
   protected tableName = 'products_specifications'

   public async up() {
      this.schema.createTable(this.tableName, (table) => {
         table.uuid('id', { primaryKey: true }).primary()
         table
            .uuid('product_id')
            .unsigned()
            .references('id')
            .inTable('products')
            .onDelete('CASCADE')
         table.string('color', 7).nullable().defaultTo(null)
         table.string('composition', 50).nullable().defaultTo(null)
         table.string('generic_code', 10).notNullable()

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
