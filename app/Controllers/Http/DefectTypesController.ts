import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import DefectType from '../../Models/DefectType'
import TypesDefectValidator from '../../Validators/TypesDefectValidator'

export default class DefectTypesController {
  public async index({ view }: HttpContextContract) {
    const typesDefects = await DefectType.query()

    typesDefects.map((typeDefect) => {
      typeDefect.serialize({
        fields: ['id', 'type_defect', 'defect_description'],
      })
    })

    return view.render('pages/type-defect/index', {
      title: 'Типы дефектов',
      typesDefects,
    })
  }

  public async create({}: HttpContextContract) {}

  public async store({ request, response, session }: HttpContextContract) {
    const validateTypeDefectData = await request.validate(TypesDefectValidator)

    if (validateTypeDefectData) {
      await DefectType.create(validateTypeDefectData)

      session.flash(
        'successMessage',
        `Тип дефекта с названием "${validateTypeDefectData.type_defect}" успешно добавлен!`
      )
      response.redirect().back()
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().back()
    }
  }

  public async show({}: HttpContextContract) {}

  public async edit({ params, view }: HttpContextContract) {
    const typeDefect = await DefectType.find(params.id)
  }

  public async update({}: HttpContextContract) {}

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
