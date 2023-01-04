import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'DefectTypesController.index').as('index').middleware(['auth'])
  Route.get('/new', 'DefectTypesController.create').as('create').middleware(['auth'])
  Route.post('/new', 'DefectTypesController.store').as('store').middleware(['auth'])
  Route.get('/edit/:id', 'DefectTypesController.edit').as('edit').middleware(['auth'])
  Route.post('/edit/:id', 'DefectTypesController.update').as('update').middleware(['auth'])
  Route.get('/delete/:id', 'DefectTypesController.destroy').as('destroy').middleware(['auth'])
})
  .prefix('/types-defects')
  .as('types-defects')
