import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import DefectType from '../../Models/DefectType'
import TypesDefectValidator from '../../Validators/TypesDefectValidator'
import DistributionGroup from 'App/Models/DistributionGroup'

export default class DefectTypesController {
  public async index({ request, response, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.denies('viewTypesDefects')) {
      session.flash('dangerMessage', 'У вас нет доступа к данному разделу!')

      return response.redirect().toPath('/')
    }

    const page = request.input('page', 1)
    const limit = 10
    const typesDefects = await DefectType.query()
      .orderBy('created_at', 'asc')
      .preload('group')
      .paginate(page, limit)

    typesDefects.baseUrl('/types-defects')

    return view.render('pages/type-defect/index', {
      title: 'Типы дефектов',
      typesDefects,
      activeMenuLink: 'types-defects.index',
    })
  }

  public async create({ response, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.denies('createTypeDefect')) {
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
    if (await bouncer.denies('createTypeDefect')) {
      session.flash('dangerMessage', 'У вас нет прав на создание записи!')

      return response.redirect().toPath('/')
    }

    const validateTypeDefectData = await request.validate(TypesDefectValidator)

    await DefectType.create({
      id_user_created: auth.user?.id,
      id_distribution_group:
        validateTypeDefectData.group === 0 ? null : validateTypeDefectData.group,
      type_defect: validateTypeDefectData.type_defect,
      defect_description: validateTypeDefectData.defect_description
        ? validateTypeDefectData.defect_description
        : 'Описание дефекта не добавлено...',
    })

    session.flash(
      'successMessage',
      `Тип дефекта с названием "${validateTypeDefectData.type_defect}" успешно добавлен!`
    )
    response.redirect().toRoute('types-defects.index')
  }

  public async show({ response, params, view, session }: HttpContextContract) {
    const typeDefect = await DefectType.find(params.id)
    const typesDefects = await DefectType.query().orderBy('created_at', 'asc')
    const typesDefectsToSort = typesDefects.map((type) => ({
      name: type.type_defect,
      path: 'types-defects.show',
      params: { id: type.id },
    }))

    if (typeDefect) {
      await typeDefect.load('defects', (query) => {
        query
          .orderBy('elimination_date', 'asc')
          .preload('substation')
          .preload('accession')
          .preload('intermediate_checks')
      })

      return view.render('pages/defect/index', {
        title: `Дефекты '${typeDefect.type_defect}'`,
        typeDefect,
        typesDefects,
        typesDefectsToSort,
        defects: typeDefect.defects,
        activeTabLink: typeDefect.id,
      })
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().back()
    }
  }

  public async edit({ params, response, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.denies('editTypeDefect')) {
      session.flash('dangerMessage', 'У вас нет прав на внесение изменений!')

      return response.redirect().toPath('/')
    }

    const typeDefect = await DefectType.find(params.id)

    if (typeDefect) {
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
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().back()
    }
  }

  public async update({ request, response, params, session, bouncer }: HttpContextContract) {
    const typeDefect = await DefectType.find(params.id)

    if (await bouncer.denies('editTypeDefect')) {
      session.flash('dangerMessage', 'У вас нет прав на внесение изменений!')

      return response.redirect().toPath('/')
    }

    if (typeDefect) {
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
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().back()
    }
  }

  public async destroy({ params, response, session, bouncer }: HttpContextContract) {
    const typeDefect = await DefectType.find(params.id)

    if (await bouncer.denies('deleteTypeDefect')) {
      session.flash('dangerMessage', 'У вас нет прав на удаление записи!')

      return response.redirect().back()
    }

    if (typeDefect) {
      await typeDefect.delete()

      session.flash('successMessage', `Тип дефекта "${typeDefect.type_defect}" был удален!`)
      response.redirect().back()
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().toPath('/')
    }
  }
}
