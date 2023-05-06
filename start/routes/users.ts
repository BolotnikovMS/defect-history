import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'UsersController.index').as('index')
  Route.get('/profile/:idUser', 'UsersController.profile').as('profile')
  Route.get('/change-password', 'UsersController.changePassword').as('change.password')
  Route.post('/change-password/save', 'UsersController.saveChangesPassword').as('save.password')
  Route.get('/show-permissions/:idUser', 'UsersController.showPermissionUser').as(
    'show.permissions'
  )
  Route.post('/add-user-permission/:idUser', 'UsersController.addPermissionToUser').as(
    'add.permission'
  )
  Route.get(
    '/remove-user-permission/:idUser/:idPermission',
    'UsersController.removeUserPermission'
  ).as('remove.permission')
  Route.get('/edit/:id', 'UsersController.edit').as('edit')
  Route.post('/edit/:id', 'UsersController.update').as('update')
  Route.get('/delete/:id', 'UsersController.destroy').as('destroy')
})
  .prefix('users')
  .as('users')
  .middleware(['auth'])
