import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
   protected tableName = 'sizes'

   public async up() {
      this.schema.createTable(this.tableName, (table) => {
         table.uuid('id', { primaryKey: true }).primary()
         table
            .uuid('user_id')
            .unsigned()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE')
            .comment('identification of the logged in user who registered the size')
         table.string('size', 5).notNullable()
         table.string('description', 100).nullable().defaultTo(null)
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
