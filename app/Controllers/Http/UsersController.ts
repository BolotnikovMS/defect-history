import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Roles from '../../Enums/Roles'
import Role from 'App/Models/Role'
import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import Department from 'App/Models/Department'
import ChangePasswordValidator from 'App/Validators/ChangePasswordValidator'
import Permission from 'App/Models/Permission'
import UsersPermission from 'App/Models/UsersPermission'

export default class UsersController {
  public async index({ request, response, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.denies('viewUsers')) {
      session.flash('dangerMessage', 'У вас нет доступа к данному разделу!')

      return response.redirect().toPath('/')
    }

    const page = request.input('page', 1)
    const limit = 20

    const users = await User.query().preload('role').preload('department').paginate(page, limit)

    users.baseUrl('/users')

    return view.render('pages/user/index', {
      title: 'Пользователи',
      users,
      activeMenuLink: 'users.index',
    })
  }

  public async profile({ view, response, session, auth }: HttpContextContract) {
    const authUser = auth.user

    if (authUser) {
      await authUser.load('role')
      await authUser.load('department')
      await authUser.load('defects', (query) => {
        query.limit(3).orderBy('created_at', 'desc')
        query.preload('substation')
        query.preload('defect_type')
      })

      // console.log(authUser.serialize())
      return view.render('pages/user/profile', {
        title: 'Профиль',
        user: authUser,
      })
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().back()
    }
  }

  public async changePassword({ view }: HttpContextContract) {
    return view.render('pages/user/change_pass', {
      title: 'Смена пароля',
      options: {
        routePath: {
          savePath: 'users.save.password',
        },
      },
    })
  }

  public async saveChangesPassword({ request, response, session, auth }: HttpContextContract) {
    const validateData = await request.validate(ChangePasswordValidator)
    const user = await User.find(auth.user?.id)

    if (user) {
      await user.merge(validateData).save()

      session.flash('successMessage', 'Пароль успешно изменен!')
      response.redirect().toRoute('defects.index')
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().toRoute('defects.index')
    }
  }

  public async showPermissionUser({
    view,
    response,
    params,
    session,
    bouncer,
  }: HttpContextContract) {
    if (await bouncer.denies('viewingUserPermissions')) {
      session.flash('dangerMessage', 'У вас нет доступа на просмотр прав пользователей!')

      return response.redirect().toPath('/')
    }

    const idUser = await params.idUser
    const user = await User.find(idUser)

    if (user && user.blocked === false) {
      await user.load('permissions')
      const permissions = await Permission.query().orderBy('id', 'asc')
      const filteredUserPermissions = permissions.filter((permission) => {
        return user.permissions.every((userPerm) => {
          return userPerm.id !== permission.id
        })
      })

      return view.render('pages/user/show_permissions', {
        title: `Права пользователя: '${user.fullName}'`,
        userPermissions: user.permissions,
        idUser,
        permissions: filteredUserPermissions,
      })
    } else {
      session.flash('dangerMessage', 'Учетная запись пользователя не существует или заблокирована!')
      response.redirect().back()
    }
  }

  public async addPermissionToUser({
    params,
    request,
    response,
    session,
    bouncer,
  }: HttpContextContract) {
    if (await bouncer.denies('addingPermissionToUser')) {
      session.flash('dangerMessage', 'Вы не можете добавлять права пользователям!')

      return response.redirect().toPath('/')
    }

    const idUser: number = parseInt(await params.idUser)
    const user = await User.find(idUser)

    if (user) {
      const validationScheme = schema.create({
        permissions: schema.array([rules.minLength(1)]).members(schema.number()),
      })
      const customMessages: CustomMessages = {
        required: 'Поле является обязательным.',
      }
      const validateData = await request.validate({
        schema: validationScheme,
        messages: customMessages,
      })

      validateData.permissions.forEach(async (permission) => {
        await UsersPermission.create({
          id_user: idUser,
          id_permission: permission,
        })
      })

      session.flash('successMessage', `Права успешно присвоены пользователю!`)
      response.redirect().back()
    } else {
      session.flash(
        'dangerMessage',
        `Пользователю которому присваиваются права не существует в базе!`
      )
      response.redirect().back()
    }
  }

  public async removeUserPermission({ response, params, session, bouncer }: HttpContextContract) {
    if (await bouncer.denies('removeUserPermissions')) {
      session.flash('dangerMessage', 'У вас нет доступа на удаление прав пользователей!')

      return response.redirect().toPath('/')
    }

    const idUser = await params.idUser
    const idPermission = await params.idPermission
    const userPermissionObject = await UsersPermission.query().whereIn(
      ['id_user', 'id_permission'],
      [[idUser, idPermission]]
    )

    if (userPermissionObject.length) {
      await userPermissionObject[0].delete()

      session.flash('successMessage', `Доступ пользователя успешно удален!`)
      response.redirect().back()
    } else {
      session.flash('dangerMessage', `Что-то пошло не так!`)
      response.redirect().back()
    }
  }

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

    if (user) {
      const validationScheme = schema.create({
        username: schema.string([rules.minLength(2), rules.trim(), rules.escape()]),
        surname: schema.string([rules.minLength(2), rules.trim(), rules.escape()]),
        name: schema.string([rules.minLength(2), rules.trim(), rules.escape()]),
        patronymic: schema.string([rules.minLength(2), rules.trim(), rules.escape()]),
        position: schema.string([rules.minLength(2), rules.trim(), rules.escape()]),
        department: schema.number(),
        role: schema.number(),
        blocked: schema.boolean.optional(),
      })
      const validateData = await request.validate({ schema: validationScheme })

      await user
        .merge({
          ...validateData,
          blocked: validateData.blocked ? true : false,
          id_department: validateData.department,
          id_role: validateData.role,
        })
        .save()

      session.flash('successMessage', `Данные пользователя "${user.fullName}" успешно обновлены.`)
      response.redirect().toRoute('users.index')
    } else {
      session.flash('dangerMessage', 'Пользователя нет в базе!')
      response.redirect().back()
    }
  }

  public async destroy({ response, params, session, bouncer }: HttpContextContract) {
    if (await bouncer.denies('deleteUser')) {
      session.flash('dangerMessage', 'У вас нет прав на удаление!')

      return response.redirect().toPath('/')
    }

    const user = await User.find(params.id)

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
