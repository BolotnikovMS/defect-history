import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Staff from 'App/Models/Staff'
import StaffValidator from 'App/Validators/StaffValidator'

export default class StaffController {
  public async index({ request, response, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.denies('noAccess')) {
      session.flash('dangerMessage', 'У вас нет доступа к данному разделу!')

      return response.redirect().toPath('/')
    }

    const page = request.input('page', 1)
    const limit = 10
    const staff = await Staff.query().orderBy('created_at', 'asc').paginate(page, limit)

    staff.baseUrl('/staff')

    return view.render('pages/staff/index', {
      title: 'Список сотрудников',
      staff,
      activeMenuLink: 'staff.index',
    })
  }

  public async create({ response, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.denies('noAccess')) {
      session.flash('dangerMessage', 'У вас нет прав на добавление новой записи!')

      return response.redirect().toPath('/')
    }

    return view.render('pages/staff/form', {
      title: 'Добавление нового сотрудника',
      options: {
        routePath: {
          saveData: 'staff.store',
        },
      },
    })
  }

  public async store({ request, response, session, bouncer }: HttpContextContract) {
    if (await bouncer.denies('noAccess')) {
      session.flash('dangerMessage', 'У вас нет прав на добавление новой записи!')

      return response.redirect().toPath('/')
    }

    const validateStaffData = await request.validate(StaffValidator)

    if (validateStaffData) {
      await Staff.create(validateStaffData)

      session.flash(
        'successMessage',
        `Сотрудник "${validateStaffData.surname} ${validateStaffData.name} ${validateStaffData.patronymic}" успешно добавлен!`
      )
      response.redirect().toRoute('StaffController.index')
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().toRoute('StaffController.index')
    }
  }

  public async show({}: HttpContextContract) {}

  public async edit({ params, response, view, session, bouncer }: HttpContextContract) {
    const employee = await Staff.find(params.id)

    if (await bouncer.denies('noAccess')) {
      session.flash('dangerMessage', 'У вас нет прав на редактирование записи!')

      return response.redirect().toPath('/')
    }

    if (employee) {
      return view.render('pages/staff/form', {
        title: 'Редактирование',
        options: {
          idData: employee.id,
          routePath: {
            saveData: 'staff.update',
          },
        },
        employee,
      })
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().back()
    }
  }

  public async update({ params, request, response, session, bouncer }: HttpContextContract) {
    let employee = await Staff.find(params.id)

    if (await bouncer.denies('noAccess')) {
      session.flash('dangerMessage', 'У вас нет прав на редактирование записи!')

      return response.redirect().toPath('/')
    }

    if (employee) {
      const validateStaffData = await request.validate(StaffValidator)

      employee.surname = validateStaffData.surname
      employee.name = validateStaffData.name
      employee.patronymic = validateStaffData.patronymic
      employee.position = validateStaffData.position

      await employee.save()

      session.flash('successMessage', `Данные сотрудика успешно обновлены.`)
      response.redirect().toRoute('StaffController.index')
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().back()
    }
  }

  public async destroy({ response, params, session, bouncer }: HttpContextContract) {
    const employee = await Staff.find(params.id)

    if (await bouncer.denies('noAccess')) {
      session.flash('dangerMessage', 'У вас нет прав на удаление записи!')

      return response.redirect().toPath('/')
    }

    if (employee) {
      await employee.delete()

      session.flash('successMessage', `Сотрудник успешно удален из базы!`)
      response.redirect().back()
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().back()
    }
  }
}
