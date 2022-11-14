import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import DefectType from '../../Models/DefectType'
import TypesDefectValidator from '../../Validators/TypesDefectValidator'

export default class DefectTypesController {
  public async index({ request, view }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = 10

    const typesDefects = await DefectType.query().orderBy('created_at', 'asc').paginate(page, limit)

    typesDefects.baseUrl('/types-defects')

    typesDefects.map((typeDefect) => {
      typeDefect.serialize({
        fields: ['id', 'type_defect', 'defect_description'],
      })
    })

    return view.render('pages/type-defect/index', {
      title: 'Типы дефектов',
      typesDefects,
      activeMenuLink: 'types-defects.all',
    })
  }

  public async create({ view }: HttpContextContract) {
    return view.render('pages/type-defect/form', {
      title: 'Добавление нового типа дефекта',
      options: {
        routePath: {
          saveData: 'type-defect.store',
        },
      },
    })
  }

  public async store({ request, response, session }: HttpContextContract) {
    const validateTypeDefectData = await request.validate(TypesDefectValidator)

    if (validateTypeDefectData) {
      await DefectType.create(validateTypeDefectData)

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

  public async edit({ params, response, view, session }: HttpContextContract) {
    const typeDefect = await DefectType.find(params.id)

    if (typeDefect) {
      return view.render('pages/type-defect/form', {
        title: 'Редактирование',
        options: {
          idData: typeDefect.id,
          routePath: {
            saveData: 'type-defect.update',
          },
        },
        typeDefect,
      })
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().back()
    }
  }

  public async update({ request, response, params, session }: HttpContextContract) {
    const typeDefect = await DefectType.find(params.id)

    if (typeDefect) {
      const validateTypeDefectData = await request.validate(TypesDefectValidator)

      typeDefect.type_defect = validateTypeDefectData.type_defect
      typeDefect.defect_description = validateTypeDefectData.defect_description

      await typeDefect.save()

      session.flash(
        'successmessage',
        `Данные "${validateTypeDefectData.type_defect}" успешно обновлены.`
      )
      response.redirect().toRoute('DefectTypesController.index')
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().back()
    }
  }

  public async destroy({ params, response, session }: HttpContextContract) {
    const typeDefect = await DefectType.find(params.id)

    if (typeDefect) {
      await typeDefect.delete()

      session.flash('successMessage', `Тип дефекта "${typeDefect.type_defect}" был удален!`)
      response.redirect().back()
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().back()
    }
  }
}
