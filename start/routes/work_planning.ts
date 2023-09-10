import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/defect/:idDefect/new', 'WorkPlanningsController.create').as('create')
  Route.post('/defect/:idDefect/new', 'WorkPlanningsController.store').as('store')
  Route.get('/defect/:idDefect/edit/:id', 'WorkPlanningsController.edit').as('edit')
  Route.post('/defect/:idDefect/edit/:id', 'WorkPlanningsController.update').as('update')
  Route.get('/delete/:id', 'WorkPlanningsController.destroy').as('destroy')
})
  .prefix('work-planning')
  .as('work-planning')
  .middleware(['auth'])
