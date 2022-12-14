import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import DefectType from '../../Models/DefectType'
import TypesDefectValidator from '../../Validators/TypesDefectValidator'

export default class DefectTypesController {
  public async index({ request, response, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.denies('viewTypesDefects')) {
      session.flash('dangerMessage', 'У вас нет доступа к данному разделу!')

      return response.redirect().toPath('/')
    }

    const page = request.input('page', 1)
    const limit = 10
    const typesDefects = await DefectType.query().orderBy('created_at', 'asc').paginate(page, limit)

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

    return view.render('pages/type-defect/form', {
      title: 'Добавление нового типа дефекта',
      options: {
        routePath: {
          saveData: 'types-defects.store',
        },
      },
    })
  }

  public async store({ request, response, session, auth, bouncer }: HttpContextContract) {
    if (await bouncer.denies('createTypeDefect')) {
      session.flash('dangerMessage', 'У вас нет прав на создание записи!')

      return response.redirect().toPath('/')
    }

    const validateTypeDefectData = await request.validate(TypesDefectValidator)

    if (validateTypeDefectData) {
      validateTypeDefectData.defect_description = validateTypeDefectData.defect_description
        ? validateTypeDefectData.defect_description
        : 'Описание дефекта не добавлено...'

      await DefectType.create({ ...validateTypeDefectData, id_user: auth.user?.id })

      session.flash(
        'successMessage',
        `Тип дефекта с названием "${validateTypeDefectData.type_defect}" успешно добавлен!`
      )
      response.redirect().toRoute('DefectTypesController.index')
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().toRoute('DefectTypesController.index')
    }
  }

  public async show({}: HttpContextContract) {}

  public async edit({ params, response, view, session, bouncer }: HttpContextContract) {
    const typeDefect = await DefectType.find(params.id)

    if (await bouncer.denies('editTypeDefect')) {
      session.flash('dangerMessage', 'У вас нет прав на внесение изменений!')

      return response.redirect().toPath('/')
    }

    if (typeDefect) {
      return view.render('pages/type-defect/form', {
        title: 'Редактирование',
        options: {
          idData: typeDefect.id,
          routePath: {
            saveData: 'types-defects.update',
          },
        },
        typeDefect,
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

      typeDefect.type_defect = validateTypeDefectData.type_defect
      typeDefect.defect_description = validateTypeDefectData.defect_description
        ? validateTypeDefectData.defect_description
        : 'Описание дефекта не добавлено...'

      await typeDefect.save()

      session.flash(
        'successMessage',
        `Данные "${validateTypeDefectData.type_defect}" успешно обновлены.`
      )
      response.redirect().toRoute('DefectTypesController.index')
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
