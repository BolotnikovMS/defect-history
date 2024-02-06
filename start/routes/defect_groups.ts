import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'DefectGroupsController.index').as('index')
  Route.get('/create', 'DefectGroupsController.create').as('create')
  Route.post('/store', 'DefectGroupsController.store').as('store')
  Route.get('/show/:id', 'DefectGroupsController.show').as('show')
  Route.get('/edit/:id', 'DefectGroupsController.edit').as('edit')
  Route.post('/edit/:id', 'DefectGroupsController.update').as('update')
  Route.get('/delete/:id', 'DefectGroupsController.destroy').as('destroy')
  Route.get('/:idDefectGroup/defect-classifiers', 'DefectClassifiersController.index').as(
    'index.classifiers'
  )
  Route.get('/:idDefectGroup/defect-classifiers/create', 'DefectClassifiersController.create').as(
    'create.classifiers'
  )
  Route.post('/:idDefectGroup/defect-classifiers/store', 'DefectClassifiersController.store').as(
    'store.classifiers'
  )
})
  .prefix('/defect-groups')
  .as('defect-groups')
  .middleware(['auth'])
