import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'AccessionSubstationsController.index').as('index')
  Route.get('/new/:idSubstation', 'AccessionSubstationsController.create').as('create')
  Route.post('/new/:idSubstation', 'AccessionSubstationsController.store').as('store')
  Route.get('/edit/:id', 'AccessionSubstationsController.edit').as('edit')
  Route.post('/edit/:id', 'AccessionSubstationsController.update').as('update')
  Route.get('/delete/:id', 'AccessionSubstationsController.destroy').as('destroy')
})
  .prefix('/accession-substations')
  .as('accession-substations')
  .middleware(['auth'])
