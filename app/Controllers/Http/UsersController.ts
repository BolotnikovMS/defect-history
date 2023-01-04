import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Roles from '../../Enums/Roles'

export default class UsersController {
  public async index({ request, response, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.denies('viewUsers')) {
      session.flash('dangerMessage', 'У вас нет доступа к данному разделу!')

      return response.redirect().toPath('/')
    }

    const page = request.input('page', 1)
    const limit = 10

    const users = await User.query().preload('role').paginate(page, limit)

    users.baseUrl('/users')

    return view.render('pages/user/index', {
      title: 'Пользователи',
      users,
      activeMenuLink: 'users.index',
    })
  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({ response, params, session, bouncer }: HttpContextContract) {
    const user = await User.find(params.id)

    if (await bouncer.denies('deleteUser')) {
      session.flash('dangerMessage', 'У вас нет прав на удаление!')

      return response.redirect().toPath('/')
    }

    if (user && user.id_role !== Roles.ADMIN) {
      await user.delete()

      session.flash('successMessage', `Пользователь успешно удален!`)
      response.redirect().back()
    } else {
      session.flash('dangerMessage', 'Пользователя с ролью "Admin" нельзя удалить!')
      response.redirect().back()
    }
  }
}
