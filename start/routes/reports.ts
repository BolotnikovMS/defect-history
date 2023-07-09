import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/substation_defects', 'ReportsController.showSubstationDefects').as(
    'show.substation.defects'
  )
  Route.post('/substation_defects', 'ReportsController.getSubstationDefects').as(
    'get.substation.defects'
  )
})
  .prefix('/reports')
  .as('reports')
  .middleware(['auth'])
