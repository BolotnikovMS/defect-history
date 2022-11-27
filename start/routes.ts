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
    Route.get('/new', 'DefectsController.create').as('defect.create')
    Route.post('/new', 'DefectsController.store').as('defect.store')
    Route.get('/show/:id', 'DefectsController.show').as('defect.show')
    Route.get('/edit/:id', 'DefectsController.edit').as('defect.edit')
    Route.post('/edit/:id', 'DefectsController.update').as('defect.update')
    Route.get('/checkup-create/:id', 'DefectsController.checkupCreate').as('defect.checkup-create')
    Route.get('/delete/:id', 'DefectsController.destroy').as('defect.destroy')
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
    Route.get('/new', 'SubstationsController.create').as('substations.create')
    Route.post('/new', 'SubstationsController.store').as('substations.store')
    Route.get('/edit/:id', 'SubstationsController.edit').as('substations.edit')
    Route.post('/edit/:id', 'SubstationsController.update').as('substations.update')
    Route.get('/delete/:id', 'SubstationsController.destroy').as('substations.destroy')
  }).prefix('/substations')

  Route.group(() => {
    Route.get('/', 'StaffController.index').as('staff.all')
    Route.get('/new', 'StaffController.create').as('staff.create')
    Route.post('/new', 'StaffController.store').as('staff.store')
    Route.get('/edit/:id', 'StaffController.edit').as('staff.edit')
    Route.post('/edit/:id', 'StaffController.update').as('staff.update')
    Route.get('/delete/:id', 'StaffController.destroy').as('staff.destroy')
  }).prefix('/staff')
})

Route.group(() => {
  Route.group(() => {
    Route.get('/', 'DefectsController.index')
    Route.post('/new', 'DefectsController.store')
  }).prefix('/defects')
})
  .namespace('App/Controllers/Http/Api/v1.0')
  .prefix('/api/v1.0')
