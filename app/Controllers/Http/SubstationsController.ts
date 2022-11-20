import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Substation from '../../Models/Substation'
import SubstationValidator from '../../Validators/SubstationValidator'

export default class SubstationsController {
  public async index({ request, view }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = 10
    const substations = await Substation.query().orderBy('created_at', 'asc').paginate(page, limit)

    substations.baseUrl('/substations')

    return view.render('pages/substation/index', {
      title: 'Список объектов',
      substations,
      activeMenuLink: 'substations.all',
    })
  }

  public async create({ view }: HttpContextContract) {
    return view.render('pages/substation/form', {
      title: 'Добавление нового объкта',
      options: {
        routePath: {
          saveData: 'substations.store',
        },
      },
    })
  }

  public async store({ request, response, session }: HttpContextContract) {
    const validateSubstation = await request.validate(SubstationValidator)

    if (validateSubstation) {
      await Substation.create(validateSubstation)

      session.flash(
        'successMessage',
        `Объект с названием "${validateSubstation.name}" успешно добавлен!`
      )
      response.redirect().toRoute('SubstationsController.index')
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().toRoute('SubstationsController.index')
    }
  }

  public async show({}: HttpContextContract) {}

  public async edit({ params, response, view, session }: HttpContextContract) {
    const substation = await Substation.find(params.id)

    if (substation) {
      return view.render('pages/substation/form', {
        title: 'Редактирование',
        options: {
          idData: substation.id,
          routePath: {
            saveData: 'substations.update',
          },
        },
        substation,
      })
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().back()
    }
  }

  public async update({ params, request, response, session }: HttpContextContract) {
    const substation = await Substation.find(params.id)

    if (substation) {
      const validateSubstation = await request.validate(SubstationValidator)

      substation.name = validateSubstation.name
      substation.voltage_class = validateSubstation.voltage_class

      await substation.save()

      session.flash('successmessage', `Данные "${validateSubstation.name}" успешно обновлены.`)
      response.redirect().toRoute('SubstationsController.index')
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().back()
    }
  }

  public async destroy({ response, params, session }: HttpContextContract) {
    const substation = await Substation.find(params.id)

    if (substation) {
      await substation.delete()

      session.flash('successMessage', `Объект успешно удален!`)
      response.redirect().back()
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().back()
    }
  }
}