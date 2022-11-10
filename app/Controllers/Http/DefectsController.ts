import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Defect from 'App/Models/Defect'
import Substation from 'App/Models/Substation'
import DefectValidator from 'App/Validators/DefectValidator'
import DefectType from '../../Models/DefectType'

export default class DefectsController {
  public async index({ view }: HttpContextContract) {
    const defects = await Defect.query().preload('defect_type').preload('substation')
    const typeDefects = await DefectType.query()
    const substations = await Substation.query()

    return view.render('pages/defect/index', {
      title: 'Все дефекты',
      defects,
      typeDefects,
      substations,
    })
  }

  public async create({}: HttpContextContract) {}

  public async store({ request, response, session }: HttpContextContract) {
    const validateDefectData = await request.validate(DefectValidator)

    if (validateDefectData) {
      const defect = {
        id_substation: +validateDefectData.substation,
        id_type_defect: +validateDefectData.defect_type,
        id_user: 1,
        ...validateDefectData,
        term_elimination: validateDefectData.term_elimination
          .replace(new RegExp('-', 'g'), '.')
          .split('.')
          .reverse()
          .join('.'),
      }

      await Defect.create(defect)

      session.flash('successMessage', `Дефект успешно добавлен!`)
      response.redirect().back()
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().back()
    }
  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({ response, params, session }: HttpContextContract) {
    const defect = await Defect.find(params.id)

    if (defect) {
      await defect.delete()

      session.flash('successMessage', `Дефект успешно удален!`)
      response.redirect().back()
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().back()
    }
  }
}
