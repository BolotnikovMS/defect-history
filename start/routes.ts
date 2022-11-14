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
  Route.get('/', 'DefectsController.index').as('defects.all')
  Route.group(() => {
    Route.post('/new', 'DefectsController.store').as('defect.store')
    Route.get('/delete/:id', 'DefectsController.destroy').as('defect.delete')
  }).prefix('/defects')

  Route.group(() => {
    Route.get('/', 'DefectTypesController.index').as('types-defects.all')
    Route.get('/new', 'DefectTypesController.create').as('type-defect.create')
    Route.post('/new', 'DefectTypesController.store').as('type-defect.store')
    Route.get('/edit/:id', 'DefectTypesController.edit').as('type-defect.edit')
    Route.post('/edit/:id', 'DefectTypesController.update').as('type-defect.update')
    Route.get('/delete/:id', 'DefectTypesController.destroy').as('type-defect.destroy')
  }).prefix('/types-defects')

  Route.group(() => {
    Route.get('/', 'SubstationsController.index').as('substations.all')
  }).prefix('/substations')
})

Route.group(() => {
  Route.group(() => {
    Route.get('/', 'DefectsController.index')
    Route.post('/new', 'DefectsController.store')
  }).prefix('/defects')
})
  .namespace('App/Controllers/Http/Api/v1.0')
  .prefix('/api/v1.0')
