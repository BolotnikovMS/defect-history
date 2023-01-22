import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'DepartmentsController.index').as('index').middleware(['auth'])
  Route.get('/new', 'DepartmentsController.create').as('create').middleware(['auth'])
  Route.post('/new', 'DepartmentsController.store').as('store').middleware(['auth'])
  Route.get('/edit/:id', 'DepartmentsController.edit').as('edit').middleware(['auth'])
  Route.post('/edit/:id', 'DepartmentsController.update').as('update').middleware(['auth'])
  Route.get('/delete/:id', 'DepartmentsController.destroy').as('destroy').middleware(['auth'])
})
  .prefix('/departments')
  .as('departments')
