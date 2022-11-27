import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Defect from 'App/Models/Defect'
import Substation from 'App/Models/Substation'
import DefectValidator from 'App/Validators/DefectValidator'
import DefectType from '../../Models/DefectType'

export default class DefectsController {
  public async index({ view }: HttpContextContract) {
    const defects = await Defect.query().preload('defect_type').preload('substation')

    return view.render('pages/defect/index', {
      title: 'Все дефекты',
      defects,
      activeMenuLink: 'defects.all',
    })
  }

  public async create({ view }: HttpContextContract) {
    const typeDefects = await DefectType.all()
    const substations = await Substation.all()

    return view.render('pages/defect/form', {
      title: 'Добавление нового дефекта',
      options: {
        routePath: {
          savePath: 'defect.store',
        },
      },
      typeDefects,
      substations,
    })
  }

  public async store({ request, response, session }: HttpContextContract) {
    const validateDefectData = await request.validate(DefectValidator)

    if (validateDefectData) {
      const defect = {
        id_substation: +validateDefectData.substation,
        id_type_defect: +validateDefectData.defect_type,
        id_user: 1,
        ...validateDefectData,
      }

      await Defect.create(defect)

      session.flash('successMessage', `Дефект успешно добавлен!`)
      response.redirect().toRoute('DefectsController.index')
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().toRoute('DefectsController.index')
    }
  }

  public async show({ params, view }: HttpContextContract) {
    const defect = await Defect.query()
      .where('id', '=', params.id)
      .preload('substation')
      .preload('defect_type')
      .preload('intermediate_checks')

    const [defectDes] = defect
    const defectSerialize = defectDes.serialize()

    return view.render('pages/defect/show', {
      title: 'Подробный просмотр',
      defectSerialize,
    })
  }

  public async edit({ params, response, view, session }: HttpContextContract) {
    const defect = await Defect.find(params.id)

    if (defect) {
      const defectSerialize = defect.serialize()
      const typeDefects = await DefectType.all()
      const substations = await Substation.all()

      return view.render('pages/defect/form', {
        title: 'Редактирование',
        options: {
          idData: defect.id,
          routePath: {
            savePath: 'defect.update',
          },
        },
        defectSerialize,
        typeDefects,
        substations,
      })
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().back()
    }
  }

  public async checkupCreate({}: HttpContextContract) {}

  public async update({ params, request, response, session }: HttpContextContract) {
    const defect = await Defect.find(params.id)

    if (defect) {
      const validateDefectData = await request.validate(DefectValidator)

      defect.id_type_defect = +validateDefectData.defect_type
      defect.id_substation = +validateDefectData.substation
      defect.accession = validateDefectData.accession
      defect.description_defect = validateDefectData.description_defect
      defect.term_elimination = validateDefectData.term_elimination

      await defect.save()

      session.flash('successMessage', `Данные дефекта успешно обновлены.`)
      response.redirect().toRoute('DefectsController.index')
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().back()
    }
  }

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
