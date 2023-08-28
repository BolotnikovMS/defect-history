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
  Route.post('/district-defects', 'ReportsController.getDistrictDefects').as('get.district.defects')
  Route.get('/all-defects', 'ReportsController.showAllDefects').as('show.all.defects')
  Route.post('/all-defects', 'ReportsController.getAllDefects').as('get.all.defects')
})
  .prefix('/reports')
  .as('reports')
  .middleware(['auth'])
