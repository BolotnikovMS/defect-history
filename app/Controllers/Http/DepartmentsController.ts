import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Department from 'App/Models/Department'
import DepartmentValidator from 'App/Validators/DepartmentValidator'

export default class DepartmentsController {
  public async index({ request, response, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.denies('viewDepartment')) {
      session.flash('dangerMessage', 'У вас нет доступа к данному разделу!')

      return response.redirect().toPath('/')
    }

    const page = request.input('page', 1)
    const limit = 15
    const departments = await Department.query().preload('department_users').paginate(page, limit)

    departments.baseUrl('/departments')

    return view.render('pages/department/index', {
      title: 'Список отделов',
      departments,
      activeMenuLink: 'departments.index',
    })
  }

  public async create({ response, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.denies('createDepartment')) {
      session.flash('dangerMessage', 'У вас нет прав на добавление новой записи!')

      return response.redirect().toPath('/')
    }

    return view.render('pages/department/form', {
      title: 'Добавление нового отдела',
      options: {
        routePath: {
          saveData: 'departments.store',
        },
      },
    })
  }

  public async store({ request, response, session, auth, bouncer }: HttpContextContract) {
    if (await bouncer.denies('createDepartment')) {
      session.flash('dangerMessage', 'У вас нет прав на добавление новой записи!')

      return response.redirect().toPath('/')
    }

    const validateData = await request.validate(DepartmentValidator)

    await Department.create({ id_user_created: auth.user?.id, name: validateData.name })

    session.flash('successMessage', `Отдел "${validateData.name}" успешно добавлен!`)

    if (validateData.addNext) {
      return response.redirect().back()
    }

    response.redirect().toRoute('departments.index')
  }

  public async show({ response, params, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.denies('viewingUsersForDepartment')) {
      session.flash('dangerMessage', 'У вас нет доступа к данному разделу!')

      return response.redirect().toPath('/')
    }

    const department = await Department.find(params.id)

    if (department) {
      await department.load('department_users')

      return view.render('pages/department/show', {
        title: `Пользователи отдела ${department.name}`,
        department,
      })
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().back()
    }
  }

  public async edit({ params, response, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.denies('updateDepartment')) {
      session.flash('dangerMessage', 'У вас нет прав на редактирование записи!')

      return response.redirect().toPath('/')
    }

    const department = await Department.find(params.id)

    if (department) {
      return view.render('pages/department/form', {
        title: 'Редактирование',
        options: {
          idData: department.id,
          routePath: {
            saveData: 'departments.update',
          },
        },
        department,
      })
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().back()
    }
  }

  public async update({ params, request, response, session, bouncer }: HttpContextContract) {
    if (await bouncer.denies('updateDepartment')) {
      session.flash('dangerMessage', 'У вас нет прав на редактирование записи!')

      return response.redirect().toPath('/')
    }

    const department = await Department.find(params.id)

    if (department) {
      const validateData = await request.validate(DepartmentValidator)

      await department.merge(validateData).save()

      session.flash('successMessage', `Данные отдела успешно обновлены.`)
      response.redirect().toRoute('departments.index')
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().back()
    }
  }

  public async destroy({ response, params, session, bouncer }: HttpContextContract) {
    if (await bouncer.denies('deleteDepartment')) {
      session.flash('dangerMessage', 'У вас нет прав на удаление записи!')

      return response.redirect().toPath('/')
    }

    const department = await Department.find(params.id)

    if (department) {
      await department.delete()

      session.flash('successMessage', `Отдел успешно удален из базы!`)
      response.redirect().back()
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().back()
    }
  }
}
