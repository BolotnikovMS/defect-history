import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Permission from 'App/Models/Permission'
import PermissionValidator from 'App/Validators/PermissionValidator'

export default class PermissionsController {
  public async index({ request, response, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.denies('viewPermissions')) {
      session.flash('dangerMessage', 'У вас нет прав на просмотр страницы!')

      return response.redirect().toPath('/')
    }

    const page = request.input('page', 1)
    const limit = 15
    const permissions = await Permission.query().paginate(page, limit)

    permissions.baseUrl('/permissions')

    return view.render('pages/permission/index', {
      title: 'Все права в приложений',
      permissions,
    })
  }

  public async create({ response, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.denies('createPermissions')) {
      session.flash('dangerMessage', 'У вас нет прав на создание записи!')

      return response.redirect().toPath('/')
    }

    return view.render('pages/permission/form', {
      title: 'Добавление нового доступа',
      options: {
        routePath: {
          saveData: 'permissions.store',
        },
      },
    })
  }

  public async store({ request, response, session, bouncer }: HttpContextContract) {
    if (await bouncer.denies('createPermissions')) {
      session.flash('dangerMessage', 'У вас нет прав на создание записи!')

      return response.redirect().toPath('/')
    }

    const validateData = await request.validate(PermissionValidator)

    await Permission.create(validateData)

    session.flash('successMessage', `Доступ "${validateData.description}" успешно добавлен!`)

    response.redirect().toRoute('permissions.index')
  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
