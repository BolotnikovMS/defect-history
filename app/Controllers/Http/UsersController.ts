import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UsersController {
  public async index({ request, view }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = 10

    const users = await User.query().preload('role').paginate(page, limit)

    users.baseUrl('/users')

    return view.render('pages/user/index', {
      title: 'Пользователи',
      users,
      activeMenuLink: 'users.all',
    })
  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({ response, params, session }: HttpContextContract) {
    const user = await User.find(params.id)

    if (user) {
      await user.delete()

      session.flash('successMessage', `Пользователь успешно удален!`)
      response.redirect().back()
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().back()
    }
  }
}
