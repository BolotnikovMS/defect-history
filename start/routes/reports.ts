import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/substation-defects', 'ReportsController.showSubstationDefects').as(
    'show.substation.defects'
  )
  Route.post('/substation-defects', 'ReportsController.getSubstationDefects').as(
    'get.substation.defects'
  )
  Route.get('/district-defects', 'ReportsController.showDistrictDefects').as(
    'show.district.defects'
  )
})
  .prefix('/reports')
  .as('reports')
  .middleware(['auth'])
