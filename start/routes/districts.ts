import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'DistrictsController.index').as('index')
  Route.get('/new', 'DistrictsController.create').as('create')
  Route.post('/new', 'DistrictsController.store').as('store')
  Route.get('/show/:id', 'DistrictsController.show').as('show')
  Route.get('/edit/:id', 'DistrictsController.edit').as('edit')
  Route.post('/edit/:id', 'DistrictsController.update').as('update')
  Route.get('/delete/:id', 'DistrictsController.destroy').as('destroy')
})
  .prefix('/districts')
  .as('districts')
  .middleware(['auth'])
