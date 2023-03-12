import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'DepartmentsController.index').as('index')
  Route.get('/new', 'DepartmentsController.create').as('create')
  Route.post('/new', 'DepartmentsController.store').as('store')
  Route.get('/edit/:id', 'DepartmentsController.edit').as('edit')
  Route.post('/edit/:id', 'DepartmentsController.update').as('update')
  Route.get('/delete/:id', 'DepartmentsController.destroy').as('destroy')
})
  .prefix('/departments')
  .as('departments')
  .middleware(['auth'])
