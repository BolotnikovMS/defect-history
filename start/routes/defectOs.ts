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
  Route.get('/edit-deadline/:id', 'DefectOsController.editDeadline').as('edit.deadline')
  Route.post('/edit-deadline/:id', 'DefectOsController.updateDeadline').as('update.deadline')
  Route.get('/checkup-create/:id', 'DefectOsController.checkupCreate').as('checkup-create')
  Route.post('/checkup-create/:id', 'DefectOsController.checkupStore').as('checkup.store')
  Route.get('/edit-checkup/:id', 'DefectOsController.checkupEdit').as('checkup.edit')
  Route.post('/edit-checkup/:id', 'DefectOsController.checkupUpdate').as('checkup.update')
  Route.get('/delete-checkup/:id', 'DefectOsController.checkupDestroy').as('checkup.destroy')
})
  .prefix('/defects-os')
  .as('defects-os')
  .middleware(['auth'])
