import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/:idDefectGroup', 'DefectClassifiersController.index').as('index')
  Route.get('/create', 'DefectClassifiersController.create').as('create')
  Route.post('create', 'DefectClassifiersController.store').as('store')
  Route.get('/edit/:id', 'DefectClassifiersController.edit').as('edit')
  Route.post('/edit/:id', 'DefectClassifiersController.update').as('update')
  Route.get('delete/:id', 'DefectClassifiersController.destroy').as('destroy')
})
  .prefix('/defect-classifiers')
  .as('defect-classifiers')
  .middleware(['auth'])
