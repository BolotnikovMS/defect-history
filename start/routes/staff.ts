import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'StaffController.index').as('index').middleware(['auth'])
  Route.get('/new', 'StaffController.create').as('create').middleware(['auth'])
  Route.post('/new', 'StaffController.store').as('store').middleware(['auth'])
  Route.get('/edit/:id', 'StaffController.edit').as('edit').middleware(['auth'])
  Route.post('/edit/:id', 'StaffController.update').as('update').middleware(['auth'])
  Route.get('/delete/:id', 'StaffController.destroy').as('destroy').middleware(['auth'])
})
  .prefix('/staff')
  .as('staff')
