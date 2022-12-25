import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AuthValidator from '../../Validators/AuthValidator'
import User from 'App/Models/User'
import Role from 'App/Models/Role'

export default class AuthController {
  public async registerShow({ view }: HttpContextContract) {
    const roles = await Role.all()

    const dataSerialize = roles.map((role) => {
      return role.serialize()
    })

    return view.render('pages/auth/register', {
      title: 'Добавление нового пользователя',
      dataSerialize,
      options: {
        routePath: {
          savePath: 'auth.register',
        },
      },
    })
  }

  public async register({ request, response, session }: HttpContextContract) {
    const data = await request.validate(AuthValidator)

    if (data) {
      await User.create(data)

      session.flash(
        'successMessage',
        `Пользователь "${data.surname} ${data.name} ${data.patronymic}" успешно добавлен в систему!`
      )
      response.redirect().back()
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().back()
    }
  }

  public async loginShow({ response, view, auth }: HttpContextContract) {
    if (auth.user) {
      return response.redirect().toPath('/')
    }

    return view.render('pages/auth/login', {
      title: 'Вход в систему',
    })
  }

  public async login({ request, response, auth, session }: HttpContextContract) {
    const { uid, password } = request.only(['uid', 'password'])

    try {
      await auth.attempt(uid, password)
    } catch (err) {
      session.flash('dangerMessage', 'Не верно введен "username", "email" или пароль!')

      response.redirect().back()
    }

    return response.redirect().toPath('/')
  }

  public async logout({ response, auth, session }: HttpContextContract) {
    console.log(auth.user)

    if (!auth.user) {
      return response.redirect().toPath('/')
    }

    await auth.logout()

    session.flash('successMessage', `Вы успешно вышли из системы!`)
    response.redirect().toPath('/')
  }
}
