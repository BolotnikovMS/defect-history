import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'DefectsController.index').as('index')
  Route.get('/new', 'DefectsController.create').as('create')
  Route.post('/new', 'DefectsController.store').as('store')
  Route.get('/show/:id', 'DefectsController.show').as('show')
  Route.get('/edit/:id', 'DefectsController.edit').as('edit')
  Route.post('/edit/:id', 'DefectsController.update').as('update')
  Route.get('/delete/:id', 'DefectsController.destroy').as('destroy')
  Route.get('/delete-img/:id/:idImg', 'DefectsController.deleteImg').as('delete.img')
  Route.get('/edit-deadline/:id', 'DefectsController.editDeadline').as('edit.deadline')
  Route.post('/edit-deadline/:id', 'DefectsController.updateDeadline').as('update.deadline')
  Route.get('/checkup-create/:idDefect', 'DefectsController.checkupCreate').as('checkup-create')
  Route.post('/checkup-create/:idDefect', 'DefectsController.checkupStore').as('checkup.store')
  Route.get('/delete-checkup/:idInterCheck', 'DefectsController.checkupDestroy').as(
    'checkup.destroy'
  )
  Route.get('/close-defect/:idDefect', 'DefectsController.closeDefectCreate').as('close.create')
  Route.post('/close-defect/:idDefect', 'DefectsController.closeDefectStore').as('close.store')
})
  .prefix('/defects')
  .as('defects')
  .middleware(['auth'])
