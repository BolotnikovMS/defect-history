import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'DistributionGroupsController.index').as('index')
  Route.get('/new', 'DistributionGroupsController.create').as('create')
  Route.post('/new', 'DistributionGroupsController.store').as('store')
  Route.get('/show/:id', 'DistributionGroupsController.show').as('show')
  Route.post('/add-user-in-group/:idGroup', 'DistributionGroupsController.addUserInGroup').as(
    'add-user'
  )
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
  .middleware(['auth'])
