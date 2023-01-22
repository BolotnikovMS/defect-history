import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'SubstationsController.index').as('index').middleware(['auth'])
  Route.get('/new', 'SubstationsController.create').as('create').middleware(['auth'])
  Route.post('/new', 'SubstationsController.store').as('store').middleware(['auth'])
  Route.get('/show/:id', 'SubstationsController.show').as('show')
  Route.get('/edit/:id', 'SubstationsController.edit').as('edit').middleware(['auth'])
  Route.post('/edit/:id', 'SubstationsController.update').as('update').middleware(['auth'])
  Route.get('/delete/:id', 'SubstationsController.destroy').as('destroy').middleware(['auth'])
})
  .prefix('/substations')
  .as('substations')
