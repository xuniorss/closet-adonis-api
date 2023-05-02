import { CustomMessages, rules, schema } from '@ioc:Adonis/Core/Validator'

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateProductValidator {
   constructor(protected ctx: HttpContextContract) {}

   /*
    * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
    *
    * For example:
    * 1. The username must be of data type string. But then also, it should
    *    not contain special characters or numbers.
    *    ```
    *     schema.string({}, [ rules.alpha() ])
    *    ```
    *
    * 2. The email must be of data type string, formatted as a valid
    *    email. But also, not used by any other user.
    *    ```
    *     schema.string({}, [
    *       rules.email(),
    *       rules.unique({ table: 'users', column: 'email' }),
    *     ])
    *    ```
    */
   public schema = schema.create({
      product_name: schema.string({}, [rules.minLength(1), rules.maxLength(200)]),
      model_id: schema.string({}, [rules.uuid()]),
      size: schema.array().members(schema.string({}, [rules.uuid()])),
      price: schema.string({}),
      quantity: schema.number(),
      description: schema.string.optional({}, [rules.maxLength(500)]),
      image_url: schema.array().members(schema.string({}, [rules.url()])),
      color: schema.string.optional({}, [rules.maxLength(7)]),
      composition: schema.string.optional({}, [rules.maxLength(50)]),
      mediaId: schema.number(),
   })

   /**
    * Custom messages for validation failures. You can make use of dot notation `(.)`
    * for targeting nested fields and array expressions `(*)` for targeting all
    * children of an array. For example:
    *
    * {
    *   'profile.username.required': 'Username is required',
    *   'scores.*.number': 'Define scores as valid numbers'
    * }
    *
    */
   public messages: CustomMessages = {}
}
