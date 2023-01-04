import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/register', 'AuthController.registerShow').as('register.show').middleware(['auth'])
  Route.post('/register', 'AuthController.register').as('register').middleware(['auth'])
  Route.get('/login', 'AuthController.loginShow').as('login.show')
  Route.post('/login', 'AuthController.login').as('login')
  Route.get('/logout', 'AuthController.logout').as('logout')
})
  .prefix('/auth')
  .as('auth')
