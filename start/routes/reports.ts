import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/substations-defects', 'ReportsController.showSubstationDefects').as(
    'show.substation.defects'
  )
  Route.get('/substations-defects/get', 'ReportsController.getSubstationDefects').as(
    'get.substation.defects'
  )
  Route.get('/district-defects', 'ReportsController.showDistrictDefects').as(
    'show.district.defects'
  )
  Route.get('/district-defects/get', 'ReportsController.getDistrictDefects').as(
    'get.district.defects'
  )
  Route.get('/all-defects', 'ReportsController.showAllDefects').as('show.all.defects')
  Route.get('/all-defects/get', 'ReportsController.getAllDefects').as('get.all.defects')
  Route.get('/all-defects-tm', 'ReportsController.showAllDefectsTM').as('show.all.defectsTm')
  Route.get('/all-defects-tm/get', 'ReportsController.getAllDefectsTM').as('get.all.defectsTm')
})
  .prefix('/reports')
  .as('reports')
  .middleware(['auth'])
