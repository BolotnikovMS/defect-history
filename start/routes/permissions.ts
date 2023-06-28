import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'PermissionsController.index').as('index')
  Route.get('/new', 'PermissionsController.create').as('create')
  Route.post('/new', 'PermissionsController.store').as('store')
})
  .prefix('/permissions')
  .as('permissions')
  .middleware(['auth'])
