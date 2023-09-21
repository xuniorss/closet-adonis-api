import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Collection from 'App/Models/Collection'
import CreateCollectionValidator from 'App/Validators/CreateCollectionValidator'

export default class CollectionsController {
   public async store({ request, response, auth }: HttpContextContract) {
      const collectionPayload = await request.validate(CreateCollectionValidator)

      const nameAlreadyExists = await Collection.findBy('name', collectionPayload.name)

      if (nameAlreadyExists) throw new Error(`Collection ${collectionPayload.name} already exists`)

      const date = new Date(collectionPayload.finalDate)

      const data = {
         ...collectionPayload,
         userId: auth.user!.id,
         finalDate: date,
      }

      await Collection.create(data)

      return response.created()
   }

   public async index({ response }: HttpContextContract) {
      const collections = await Database.rawQuery(`
         SELECT
            products.*,
            image.image_url,
            collections.model_id as collection_id,
            collections.name as collection_name,
            collections.show_home as show_home,
            collections.num_items as num_items,
            collections.final_date as final_date
         FROM products
         LEFT JOIN (
            SELECT DISTINCT ON (products_images.product_id)
               products_images.product_id as prod_id,
               products_images.image_url as image_url
            FROM products_images
         ) AS image
         ON image.prod_id = products.id
         LEFT JOIN collections on collections.model_id = products.model_id
         WHERE products.quantity > 0
         and products.model_id = collections.model_id
         GROUP BY products.id, image.image_url, collections.model_id
         ORDER BY products.created_at DESC
      `)

      return response.ok(collections.rows)
   }

   public async indexHome({ response }: HttpContextContract) {
      const collections = await Database.rawQuery(`
         SELECT
            products.*,
            image.image_url,
            collections.model_id as collection_id,
            collections.name as collection_name,
            collections.show_home as show_home,
            collections.num_items as num_items,
            collections.final_date as final_date
         FROM products
         LEFT JOIN (
            SELECT DISTINCT ON (products_images.product_id)
               products_images.product_id as prod_id,
               products_images.image_url as image_url
            FROM products_images
         ) AS image
         ON image.prod_id = products.id
         LEFT JOIN collections on collections.model_id = products.model_id
         WHERE products.quantity > 0
         and products.model_id = collections.model_id
         and collections.show_home = true
         GROUP BY products.id, image.image_url, collections.model_id
         ORDER BY products.created_at DESC
      `)

      return response.ok(collections.rows)
   }
}
