import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'SubstationsController.index').as('index')
  Route.get('/new', 'SubstationsController.create').as('create')
  Route.post('/new', 'SubstationsController.store').as('store')
  Route.get('/show/:id', 'SubstationsController.show').as('show')
  Route.get('/show-accession/:idSubstation', 'SubstationsController.showAttachments').as(
    'show.attachments'
  )
  Route.get('/edit/:id', 'SubstationsController.edit').as('edit')
  Route.post('/edit/:id', 'SubstationsController.update').as('update')
  Route.get('/delete/:id', 'SubstationsController.destroy').as('destroy')
})
  .prefix('/substations')
  .as('substations')
  .middleware(['auth'])
