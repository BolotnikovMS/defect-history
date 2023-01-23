import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'DistrictsController.index').as('index').middleware(['auth'])
  Route.get('/new', 'DistrictsController.create').as('create').middleware(['auth'])
  Route.post('/new', 'DistrictsController.store').as('store').middleware(['auth'])
  Route.get('/edit/:id', 'DistrictsController.edit').as('edit').middleware(['auth'])
  Route.post('/edit/:id', 'DistrictsController.update').as('update').middleware(['auth'])
  Route.get('/delete/:id', 'DistrictsController.destroy').as('destroy').middleware(['auth'])
})
  .prefix('/districts')
  .as('districts')
