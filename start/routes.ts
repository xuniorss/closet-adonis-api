/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
   return { hello: 'world' }
})

Route.post('/create-account', 'UsersController.store')
Route.post('/create-session', 'SessionsController.store')

Route.get('/products', 'ProductsController.index')
Route.get('/products/:productid', 'ProductsController.indexById')
Route.get('/collection/:modelid', 'ProductsController.collectionIndex')
Route.get('/products-week', 'ProductsController.newsWeekIndex')
Route.get('/products-qs', 'ProductsController.indexByQueryString')
Route.get('/products-related/:productid', 'ProductsController.relatedProductsIndex')
Route.get('/products-norelated/:productid', 'ProductsController.noRelatedProductsIndex')

Route.group(() => {
   Route.get('/me', 'UsersController.index')

   Route.post('/create-size', 'SizesController.store')
   Route.get('/sizes', 'SizesController.index')

   Route.post('/create-model', 'ModelsController.store')
   Route.get('/models', 'ModelsController.index')

   Route.post('/create-product', 'ProductsController.store')
   Route.delete('/delete-product/:productid', 'ProductsController.deleteProducts')
}).middleware('auth')
