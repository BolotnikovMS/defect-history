import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import District from 'App/Models/District'
import Substation from 'App/Models/Substation'
import DistrictService from 'App/Services/DistrictService'
import DistrictValidator from 'App/Validators/DistrictValidator'

export default class DistrictsController {
  public async index({ request, response, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.with('DistrictPolicy').denies('view')) {
      session.flash('dangerMessage', 'У вас нет прав на для просмотра!')

      return response.redirect().toPath('/')
    }

    const districts = await DistrictService.getDistricts({ req: request })

    return view.render('pages/district/index', {
      title: 'Список РЭС и ГП',
      districts,
      activeMenuLink: 'districts.index',
    })
  }

  public async create({ response, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.with('DistrictPolicy').denies('create')) {
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
    if (await bouncer.with('DistrictPolicy').denies('create')) {
      session.flash('dangerMessage', 'У вас нет прав на добавление новой записи!')

      return response.redirect().toPath('/')
    }

    const validateData = await request.validate(DistrictValidator)

    await District.create({ id_user_created: auth.user?.id, name: validateData.name })

    session.flash('successMessage', `Район "${validateData.name}" успешно добавлен!`)

    if (validateData.addNext) {
      return response.redirect().back()
    }

    response.redirect().toRoute('districts.index')
  }

  public async show({ response, params, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.with('SubstationPolicy').denies('view')) {
      session.flash('dangerMessage', 'У вас нет прав для просмотра!')

      return response.redirect().toPath('/')
    }

    const district = await DistrictService.getDistrictSubstations(params)

    district.substations.sort(
      (prevItem: Substation, nextItem: Substation) =>
        nextItem.numberOpenDefects - prevItem.numberOpenDefects
    )

    return view.render('pages/district/show', {
      title: district.name,
      district,
    })
  }

  public async edit({ params, response, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.with('DistrictPolicy').denies('update')) {
      session.flash('dangerMessage', 'У вас нет прав на редактирование записи!')

      return response.redirect().toPath('/')
    }

    const district = await District.findOrFail(params.id)

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
  }

  public async update({ params, request, response, session, bouncer }: HttpContextContract) {
    if (await bouncer.with('DistrictPolicy').denies('update')) {
      session.flash('dangerMessage', 'У вас нет прав на редактирование записи!')

      return response.redirect().toPath('/')
    }

    const district = await District.findOrFail(params.id)
    const validateData = await request.validate(DistrictValidator)

    await district.merge(validateData).save()

    session.flash('successMessage', `Данные отдела успешно обновлены.`)
    response.redirect().toRoute('districts.index')
  }

  public async destroy({ response, params, session, bouncer }: HttpContextContract) {
    if (await bouncer.with('DistrictPolicy').denies('delete')) {
      session.flash('dangerMessage', 'У вас нет прав на удаление записи!')

      return response.redirect().toPath('/')
    }

    const district = await District.findOrFail(params.id)

    await district.delete()

    session.flash('successMessage', `Район успешно удален из базы!`)
    response.redirect().back()
  }
}
