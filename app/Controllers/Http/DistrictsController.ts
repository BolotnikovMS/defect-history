import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import District from 'App/Models/District'
import DistrictValidator from 'App/Validators/DistrictValidator'

export default class DistrictsController {
  public async index({ request, view }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = 10
    const districts = await District.query()
      .orderBy('created_at', 'asc')
      .preload('substations')
      .paginate(page, limit)

    districts.baseUrl('/districts')

    return view.render('pages/district/index', {
      title: 'Список районов и ГП',
      districts,
      activeMenuLink: 'districts.index',
    })
  }

  public async create({ response, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.denies('createDistrict')) {
      session.flash('dangerMessage', 'У вас нет прав на добавление новой записи!')

      return response.redirect().toPath('/')
    }

    return view.render('pages/district/form', {
      title: 'Добавление нового района',
      options: {
        routePath: {
          saveData: 'districts.store',
        },
      },
    })
  }

  public async store({ request, response, session, auth, bouncer }: HttpContextContract) {
    if (await bouncer.denies('createDistrict')) {
      session.flash('dangerMessage', 'У вас нет прав на добавление новой записи!')

      return response.redirect().toPath('/')
    }

    const validateData = await request.validate(DistrictValidator)

    await District.create({ ...validateData, id_user_created: auth.user?.id })

    session.flash('successMessage', `Район "${validateData.name}" успешно добавлен!`)

    response.redirect().toRoute('districts.index')
  }

  public async show({ response, params, view, session }: HttpContextContract) {
    const district = await District.find(params.id)

    if (district) {
      await district.load('substations', (query) => {
        query.preload('defects')
      })

      district.substations.sort(
        (prevItem, nextItem) => nextItem.numberOpenDefects - prevItem.numberOpenDefects
      )

      return view.render('pages/district/show', {
        title: district.name,
        district,
      })
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().back()
    }
  }

  public async edit({ params, response, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.denies('updateDistrict')) {
      session.flash('dangerMessage', 'У вас нет прав на редактирование записи!')

      return response.redirect().toPath('/')
    }

    const district = await District.find(params.id)

    if (district) {
      return view.render('pages/district/form', {
        title: 'Редактирование',
        options: {
          idData: district.id,
          routePath: {
            saveData: 'districts.update',
          },
        },
        district,
      })
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().back()
    }
  }

  public async update({ params, request, response, session, bouncer }: HttpContextContract) {
    if (await bouncer.denies('updateDistrict')) {
      session.flash('dangerMessage', 'У вас нет прав на редактирование записи!')

      return response.redirect().toPath('/')
    }

    const district = await District.find(params.id)

    if (district) {
      const validateData = await request.validate(DistrictValidator)

      await district.merge(validateData).save()

      session.flash('successMessage', `Данные отдела успешно обновлены.`)
      response.redirect().toRoute('districts.index')
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().back()
    }
  }

  public async destroy({ response, params, session, bouncer }: HttpContextContract) {
    if (await bouncer.denies('deleteDistrict')) {
      session.flash('dangerMessage', 'У вас нет прав на удаление записи!')

      return response.redirect().toPath('/')
    }

    const district = await District.find(params.id)

    if (district) {
      await district.delete()

      session.flash('successMessage', `Район успешно удален из базы!`)
      response.redirect().back()
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().back()
    }
  }
}
