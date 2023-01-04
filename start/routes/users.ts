import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'UsersController.index').as('index').middleware(['auth'])
  Route.get('/delete/:id', 'UsersController.destroy').as('destroy').middleware(['auth'])
})
  .prefix('users')
  .as('users')
