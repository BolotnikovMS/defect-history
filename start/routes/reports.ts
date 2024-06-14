import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/district-defects', 'ReportsController.showDistrictDefects').as(
    'show.district.defects'
  )
  Route.get('/district-defects/get', 'ReportsController.getDistrictDefects').as(
    'get.district.defects'
  )
  Route.get('/all-defects-tm', 'ReportsController.showAllDefectsTM').as('show.all.defectsTm')
  Route.get('/all-defects-tm/get', 'ReportsController.getAllDefectsTM').as('get.all.defectsTm')
  Route.get('/all-defects-os', 'ReportsController.showAllDefectsOS').as('show.all.defectsOs')
  Route.get('/all-defects-os/get', 'ReportsController.getAllDefectsOS').as('get.all.defectsOs')
})
  .prefix('/reports')
  .as('reports')
  .middleware(['auth'])
