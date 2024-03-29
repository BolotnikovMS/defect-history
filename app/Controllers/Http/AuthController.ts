import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Role from 'App/Models/Role'
import User from 'App/Models/User'
import Department from '../../Models/Department'
import AuthValidator from '../../Validators/AuthValidator'

export default class AuthController {
  public async registerShow({ response, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.with('UserPolicy').denies('create')) {
      session.flash('dangerMessage', 'У вас нет доступа к данному разделу!')

      return response.redirect().toPath('/')
    }

    const roles = await Role.all()
    const departments = await Department.all()
    const rolesSerialize = roles.map((role) => role.serialize())
    const departmentsSerialize = departments.map((department) => department.serialize())

    return view.render('pages/auth/register', {
      title: 'Добавление нового пользователя',
      rolesSerialize,
      departmentsSerialize,
      options: {
        routePath: {
          savePath: 'auth.register',
        },
      },
    })
  }

  public async register({ request, response, session, auth, bouncer }: HttpContextContract) {
    if (await bouncer.with('UserPolicy').denies('create')) {
      session.flash('dangerMessage', 'У вас нет прав на добавление нового пользователя!')

      return response.redirect().toPath('/')
    }

    let data = await request.validate(AuthValidator)

    if (data) {
      await User.create({
        ...data,
        id_user_created: auth.user?.id,
        id_department: data.department,
        id_role: data.role,
      })

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
    const _schema = schema.create({
      uid: schema.string(),
      password: schema.string(),
      remember_me: schema.boolean.optional(),
    })

    const { uid, password, remember_me } = await request.validate({ schema: _schema })

    try {
      await auth.attempt(uid, password, !!remember_me)

      if (auth.user?.blocked === true) {
        await auth.logout()

        session.flash('dangerMessage', 'Ваша учетная запись заблокирована!')

        return response.redirect().back()
      }

      return response.redirect().toPath('/')
    } catch (err) {
      session.flash('dangerMessage', 'Не верно введен "username", "email" или пароль!')

      response.redirect().back()
    }
  }

  public async logout({ response, auth, session }: HttpContextContract) {
    if (!auth.user) {
      return response.redirect().toPath('/')
    }

    await auth.logout()

    session.flash('successMessage', `Вы успешно вышли из системы!`)
    response.redirect().toPath('/')
  }
}
