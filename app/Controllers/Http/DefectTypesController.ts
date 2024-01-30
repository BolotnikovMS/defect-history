import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import DistributionGroup from 'App/Models/DistributionGroup'
import TypeDefectTMService from 'App/Services/TypeDefectTMService'
import DefectType from '../../Models/DefectType'
import TypesDefectValidator from '../../Validators/TypesDefectValidator'

export default class DefectTypesController {
  public async index({ request, response, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.with('TypeDefectPolicy').denies('view')) {
      session.flash('dangerMessage', 'У вас нет доступа к данному разделу!')

      return response.redirect().toPath('/')
    }

    const typesDefects = await TypeDefectTMService.getTypeDefectTM(request)

    return view.render('pages/type-defect/index', {
      title: 'Типы дефектов',
      typesDefects,
      activeMenuLink: 'types-defects.index',
    })
  }

  public async create({ response, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.with('TypeDefectPolicy').denies('create')) {
      session.flash('dangerMessage', 'У вас нет прав на создание записи!')

      return response.redirect().toPath('/')
    }

    const groups = await DistributionGroup.all()

    return view.render('pages/type-defect/form', {
      title: 'Добавление нового типа дефекта',
      options: {
        routePath: {
          saveData: 'types-defects.store',
        },
      },
      groups,
    })
  }

  public async store({ request, response, session, auth, bouncer }: HttpContextContract) {
    if (await bouncer.with('TypeDefectPolicy').denies('create')) {
      session.flash('dangerMessage', 'У вас нет прав на создание записи!')

      return response.redirect().toPath('/')
    }

    const newTypeDefect = await TypeDefectTMService.store(request, auth)

    session.flash(
      'successMessage',
      `Тип дефекта с названием "${newTypeDefect.type_defect}" успешно добавлен!`
    )
    response.redirect().toRoute('types-defects.index')
  }

  public async show({ params, response }: HttpContextContract) {
    const typeDefect = await DefectType.findOrFail(params.id)

    return response.redirect().toRoute('defects.index', {}, { qs: { typeDefect: typeDefect.id } })
  }

  public async edit({ params, response, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.with('TypeDefectPolicy').denies('update')) {
      session.flash('dangerMessage', 'У вас нет прав на внесение изменений!')

      return response.redirect().toPath('/')
    }

    const typeDefect = await DefectType.findOrFail(params.id)
    const groups = await DistributionGroup.all()

    return view.render('pages/type-defect/form', {
      title: 'Редактирование',
      options: {
        idData: typeDefect.id,
        routePath: {
          saveData: 'types-defects.update',
        },
      },
      typeDefect,
      groups,
    })
  }

  public async update({ request, response, params, session, bouncer }: HttpContextContract) {
    const typeDefect = await DefectType.findOrFail(params.id)

    if (await bouncer.with('TypeDefectPolicy').denies('update')) {
      session.flash('dangerMessage', 'У вас нет прав на внесение изменений!')

      return response.redirect().toPath('/')
    }

    const validateTypeDefectData = await request.validate(TypesDefectValidator)

    await typeDefect
      .merge({
        id_distribution_group:
          validateTypeDefectData.group === 0 ? null : validateTypeDefectData.group,
        type_defect: validateTypeDefectData.type_defect,
        defect_description: validateTypeDefectData.defect_description
          ? validateTypeDefectData.defect_description
          : 'Описание дефекта не добавлено...',
      })
      .save()

    session.flash(
      'successMessage',
      `Данные "${validateTypeDefectData.type_defect}" успешно обновлены.`
    )
    response.redirect().toRoute('types-defects.index')
  }

  public async destroy({ params, response, session, bouncer }: HttpContextContract) {
    const typeDefect = await DefectType.findOrFail(params.id)

    if (await bouncer.with('TypeDefectPolicy').denies('delete')) {
      session.flash('dangerMessage', 'У вас нет прав на удаление записи!')

      return response.redirect().back()
    }

    await typeDefect.delete()

    session.flash('successMessage', `Тип дефекта "${typeDefect.type_defect}" был удален!`)
    response.redirect().back()
  }
}
