import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'DefectTypesController.index').as('index')
  Route.get('/new', 'DefectTypesController.create').as('create')
  Route.post('/new', 'DefectTypesController.store').as('store')
  // Роут больше не поддерживается тк фильтр переработан
  Route.get('/show/:id', 'DefectTypesController.show').as('show')
  Route.get('/edit/:id', 'DefectTypesController.edit').as('edit')
  Route.post('/edit/:id', 'DefectTypesController.update').as('update')
  Route.get('/delete/:id', 'DefectTypesController.destroy').as('destroy')
})
  .prefix('/types-defects')
  .as('types-defects')
  .middleware(['auth'])
