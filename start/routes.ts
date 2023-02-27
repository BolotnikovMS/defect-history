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
  require('./routes/staff')

  Route.group(() => {
    Route.get('/', 'DistributionGroupsController.index').as('index')
    Route.get('/new', 'DistributionGroupsController.create').as('create')
    Route.post('/new', 'DistributionGroupsController.store').as('store')
    Route.get('/show/:id', 'DistributionGroupsController.show').as('show')
    Route.post('/add-user-in-group/:idGroup', 'DistributionGroupsController.addUserInGroup')
      .as('add-user')
    Route.get(
      '/delete-user-from-group/:idGroup/:idUser',
      'DistributionGroupsController.removeUserFromGroup'
    ).as('remove-user')
    Route.get('/edit/:id', 'DistributionGroupsController.edit').as('edit')
    Route.post('/edit/:id', 'DistributionGroupsController.update').as('update')
    Route.get('/delete/:id', 'DistributionGroupsController.destroy').as('destroy')
  })
    .prefix('/distribution-groups')
    .as('distribution')
}).namespace('App/Controllers/Http')

// Route.group(() => {
//   Route.group(() => {
//     Route.get('/', 'DefectsController.index')
//     Route.post('/new', 'DefectsController.store')
//   }).prefix('/defects')
// })
//   .namespace('App/Controllers/Http/Api/v1.0')
//   .prefix('/api/v1.0')
