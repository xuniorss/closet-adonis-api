import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
   protected tableName = 'collections'

   public async up() {
      this.schema.createTable(this.tableName, (table) => {
         // table.uuid('id', { primaryKey: true }).primary()
         table.uuid('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
         table.string('name', 30).notNullable().unique()
         table
            .uuid('model_id', { primaryKey: true })
            .primary()
            .unsigned()
            .references('id')
            .inTable('models')
            .onDelete('CASCADE')
         table.integer('num_items').defaultTo(3)
         table.boolean('show_home').defaultTo(false)
         table.date('final_date')
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
