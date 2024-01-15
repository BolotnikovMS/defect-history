import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'DashboardController.index').as('dashboard.index')
}).prefix('/')
