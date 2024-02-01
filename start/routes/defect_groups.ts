import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'DefectGroupsController.index').as('index')
  Route.get('/create', 'DefectGroupsController.create').as('create')
  Route.post('/store', 'DefectGroupsController.store').as('store')
  Route.get('/show/:id', 'DefectGroupsController.show').as('show')
  Route.get('/edit/:id', 'DefectGroupsController.edit').as('edit')
  Route.post('/edit/:id', 'DefectGroupsController.update').as('update')
  Route.get('/delete/:id', 'DefectGroupsController.destroy').as('destroy')
})
  .prefix('/defect-groups')
  .as('defect-groups')
  .middleware(['auth'])
