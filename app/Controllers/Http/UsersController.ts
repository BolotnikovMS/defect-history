import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Roles from '../../Enums/Roles'
import Role from 'App/Models/Role'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Department from 'App/Models/Department'

export default class UsersController {
  public async index({ request, response, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.denies('viewUsers')) {
      session.flash('dangerMessage', 'У вас нет доступа к данному разделу!')

      return response.redirect().toPath('/')
    }

    const page = request.input('page', 1)
    const limit = 10

    const users = await User.query().preload('role').preload('department').paginate(page, limit)

    users.baseUrl('/users')

    return view.render('pages/user/index', {
      title: 'Пользователи',
      users,
      activeMenuLink: 'users.index',
    })
  }

  public async show({}: HttpContextContract) {}

  public async edit({ params, response, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.denies('editUser')) {
      session.flash('dangerMessage', 'У вас нету прав на редактирование!')

      return response.redirect().toPath('/')
    }

    const user = await User.find(params.id)
    const roles = await Role.all()
    const departments = await Department.all()
    const rolesSerialize = roles.map((role) => {
      return role.serialize({
        fields: ['id', 'name'],
      })
    })
    const departmentsSerialize = departments.map((department) => department.serialize())

    if (user) {
      return view.render('pages/user/edit', {
        title: 'Редактирование',
        user,
        rolesSerialize,
        departmentsSerialize,
      })
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().back()
    }
  }

  public async update({ request, response, params, session, bouncer }: HttpContextContract) {
    if (await bouncer.denies('editUser')) {
      session.flash('dangerMessage', 'У вас нету прав на редактирование!')

      return response.redirect().toPath('/')
    }

    const user = await User.find(params.id)
    const _schema = schema.create({
      username: schema.string([rules.minLength(2), rules.trim(), rules.escape()]),
      surname: schema.string([rules.minLength(2), rules.trim(), rules.escape()]),
      name: schema.string([rules.minLength(2), rules.trim(), rules.escape()]),
      patronymic: schema.string([rules.minLength(2), rules.trim(), rules.escape()]),
      position: schema.string([rules.minLength(2), rules.trim(), rules.escape()]),
      department: schema.number(),
      role: schema.number(),
      blocked: schema.string.optional(),
    })

    if (user) {
      const validateData = await request.validate({ schema: _schema })

      await user
        .merge({
          ...validateData,
          blocked: !!validateData.blocked + '',
          id_department: validateData.department,
          id_role: validateData.role,
        })
        .save()

      session.flash('successMessage', `Данные пользователя "${user.fullName}" успешно обновлены.`)
      response.redirect().toRoute('users.index')
    }
  }

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
