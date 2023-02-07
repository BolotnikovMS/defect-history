import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Substation from '../../Models/Substation'
import SubstationValidator from '../../Validators/SubstationValidator'
import District from 'App/Models/District'

export default class SubstationsController {
  public async index({ request, view }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = 15
    const substations = await Substation.query().preload('defects').paginate(page, limit)

    substations.baseUrl('/substations')

    substations.sort(
      (prevItem, nextItem) => nextItem.numberOpenDefects - prevItem.numberOpenDefects
    )

    return view.render('pages/substation/index', {
      title: 'Список объектов',
      substations,
      activeMenuLink: 'substations.index',
    })
  }

  public async create({ response, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.denies('noAccess')) {
      session.flash('dangerMessage', 'У вас нет прав на добавление новой записи!')

      return response.redirect().toPath('/')
    }

    const districts = await District.query()

    return view.render('pages/substation/form', {
      title: 'Добавление нового объкта',
      districts,
      options: {
        routePath: {
          saveData: 'substations.store',
        },
      },
    })
  }

  public async store({ request, response, session, auth, bouncer }: HttpContextContract) {
    if (await bouncer.denies('noAccess')) {
      session.flash('dangerMessage', 'У вас нет прав на добавление новой записи!')

      return response.redirect().toPath('/')
    }

    const validateSubstation = await request.validate(SubstationValidator)

    if (validateSubstation) {
      await Substation.create({
        id_district: validateSubstation.district,
        id_user: auth.user?.id,
        name: validateSubstation.name,
        importance: !!validateSubstation.importance + '',
      })

      session.flash(
        'successMessage',
        `Объект с названием "${validateSubstation.name}" успешно добавлен!`
      )
      response.redirect().toRoute('substations.index')
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().toRoute('substations.index')
    }
  }

  public async show({ response, params, view, session }: HttpContextContract) {
    const substation = await Substation.find(params.id)

    if (substation) {
      await substation.load('defects', (query) => {
        query
          .orderBy('elimination_date', 'asc')
          .preload('defect_type')
          .preload('intermediate_checks')
      })

      return view.render('pages/substation/show', {
        title: `Дефекты ${substation.name}`,
        substation,
      })
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().back()
    }
  }

  public async edit({ params, response, view, session, bouncer }: HttpContextContract) {
    const substation = await Substation.find(params.id)

    if (await bouncer.denies('noAccess')) {
      session.flash('dangerMessage', 'У вас нет прав на редактирование записи!')

      return response.redirect().toPath('/')
    }

    if (substation) {
      const districts = await District.query()

      return view.render('pages/substation/form', {
        title: 'Редактирование',
        options: {
          idData: substation.id,
          routePath: {
            saveData: 'substations.update',
          },
        },
        districts,
        substation,
      })
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().back()
    }
  }

  public async update({ params, request, response, session, bouncer }: HttpContextContract) {
    const substation = await Substation.find(params.id)

    if (await bouncer.denies('noAccess')) {
      session.flash('dangerMessage', 'У вас нет прав на редактирование записи!')

      return response.redirect().toPath('/')
    }

    if (substation) {
      const validateSubstation = await request.validate(SubstationValidator)

      await substation
        .merge({
          id_district: validateSubstation.district,
          name: validateSubstation.name,
          importance: !!validateSubstation.importance + '',
        })
        .save()

      session.flash('successmessage', `Данные "${validateSubstation.name}" успешно обновлены.`)
      response.redirect().toRoute('SubstationsController.index')
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().back()
    }
  }

  public async destroy({ response, params, session, bouncer }: HttpContextContract) {
    const substation = await Substation.find(params.id)

    if (await bouncer.denies('noAccess')) {
      session.flash('dangerMessage', 'У вас нет прав на удаление записи!')

      return response.redirect().toPath('/')
    }

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
