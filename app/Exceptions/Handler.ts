/*
|--------------------------------------------------------------------------
| Http Exception Handler
|--------------------------------------------------------------------------
|
| AdonisJs will forward all exceptions occurred during an HTTP request to
| the following class. You can learn more about exception handling by
| reading docs.
|
| The exception handler extends a base `HttpExceptionHandler` which is not
| mandatory, however it can do lot of heavy lifting to handle the errors
| properly.
|
*/

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'
import Logger from '@ioc:Adonis/Core/Logger'

export default class ExceptionHandler extends HttpExceptionHandler {
  // protected disableStatusPagesInDevelopment = false
  protected statusPages = {
    '403': 'errors/unauthorized',
    '404': 'errors/not-found',
    '500..599': 'errors/server-error',
  }

  constructor() {
    super(Logger)
  }

  public async handle(_error: any, ctx: HttpContextContract) {
    if (_error.code === 'E_ROUTE_NOT_FOUND') {
      ctx.session.flash('dangerMessage', 'Страницы не существует!')
      return ctx.response.redirect().toRoute('dashboard.index')
    }

    if (_error.code === 'E_ROW_NOT_FOUND') {
      ctx.session.flash('dangerMessage', 'Записи не существует!')
      return ctx.response.redirect().toRoute('dashboard.index')
    }

    return super.handle(_error, ctx)
  }
}
