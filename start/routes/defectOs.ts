import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'DefectOsController.index').as('index')
  Route.get('/new', 'DefectOsController.create').as('create')
  Route.post('/new', 'DefectOsController.store').as('store')
  Route.get('/show/:id', 'DefectOsController.show').as('show')
  Route.get('/edit/:id', 'DefectOsController.edit').as('edit')
  Route.post('/edit/:id', 'DefectOsController.update').as('update')
  Route.get('/delete/:id', 'DefectOsController.destroy').as('destroy')
  Route.get('/close-defect/:id', 'DefectOsController.closeDefectOsCreate').as('close.create')
  Route.post('/close-defect/:id', 'DefectOsController.closeDefectOsStore').as('close.store')
  Route.get('/delete-close-defect-record/:id', 'DefectOsController.deletingCompletionRecord').as(
    'delete.close-defect-record'
  )
})
  .prefix('/defects-os')
  .as('defects-os')
  .middleware(['auth'])
