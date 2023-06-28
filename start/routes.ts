/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes;;.ts` as follows | | import './routes/cart' | import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'DefectsController.index').as('defects.index')

  require('./routes/auth')
  require('./routes/users')
  require('./routes/departments')
  require('./routes/defects')
  require('./routes/types-defects')
  require('./routes/districts')
  require('./routes/substations')
  require('./routes/distribution')
  require('./routes/permissions')
  require('./routes/accession_substations')
}).namespace('App/Controllers/Http')

Route.group(() => {
  Route.group(() => {
    Route.get('/', 'DefectsController.index')
    Route.post('/new', 'DefectsController.store')
  }).prefix('/defects')
  Route.group(() => {
    Route.get('/', 'DefectTypesController.index')
    Route.get('/:id', 'DefectTypesController.show')
    Route.get('/:id/defects', 'DefectTypesController.showDefects')
  }).prefix('/types-defects')
})
  .namespace('App/Controllers/Http/Api/v1.0')
  .prefix('/api/v1.0')
