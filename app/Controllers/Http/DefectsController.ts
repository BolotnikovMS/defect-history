import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Defect from 'App/Models/Defect'
import Substation from 'App/Models/Substation'
import DefectValidator from 'App/Validators/DefectValidator'
import DefectType from '../../Models/DefectType'
import Staff from '../../Models/Staff'
import IntermediateCheck from '../../Models/IntermediateCheck'
import DefectResultValidator from '../../Validators/DefectResultValidator'

export default class DefectsController {
  public async index({ request, view }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = 10

    const defects = await Defect.query()
      .orderBy('elimination_date', 'asc')
      .preload('defect_type')
      .preload('substation')
      .preload('intermediate_checks')
      .paginate(page, limit)

    defects.baseUrl('/')

    // const defectsSerialize = defects.serialize({
    //   fields: ['id', 'accession', 'description_defect', 'term_elimination', 'elimination_date'],
    //   relations: {
    //     substation: {
    //       fields: ['nameAndClass'],
    //     },
    //     defect_type: {
    //       fields: ['type_defect'],
    //     },
    //   },
    // })

    return view.render('pages/defect/index', {
      title: 'Все дефекты',
      defects,
      activeMenuLink: 'defects.index',
    })
  }

  public async create({ response, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.denies('createDefect')) {
      session.flash('dangerMessage', 'У вас нет прав на добавление новой записи!')

      return response.redirect().toPath('/')
    }

    const typeDefects = await DefectType.all()
    const substations = await Substation.all()

    return view.render('pages/defect/form', {
      title: 'Добавление нового дефекта',
      options: {
        routePath: {
          savePath: 'defects.store',
        },
      },
      typeDefects,
      substations,
    })
  }

  public async store({ request, response, auth, session, bouncer }: HttpContextContract) {
    if (await bouncer.denies('createDefect')) {
      session.flash('dangerMessage', 'У вас нет прав на добавление новой записи!')

      return response.redirect().toPath('/')
    }

    const validateDefectData = await request.validate(DefectValidator)

    if (validateDefectData) {
      const defect = {
        id_substation: +validateDefectData.substation,
        id_type_defect: +validateDefectData.defect_type,
        id_user: auth.user!.id,
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
      .preload('intermediate_checks', (interQuery) => {
        interQuery.preload('name_inspector')
      })
      .preload('name_eliminated')

    const [defectDes] = defect
    const defectSerialize = defectDes.serialize({
      fields: [
        'id',
        'id_user',
        'accession',
        'description_defect',
        'term_elimination',
        'elimination_date',
        'result',
      ],
      relations: {
        substation: {
          fields: ['name', 'voltage_class', 'nameAndClass'],
        },
        defect_type: {
          fields: ['type_defect'],
        },
        intermediate_checks: {
          fields: ['check_date', 'description_results', 'transferred'],
          relations: {
            name_inspector: {
              fields: ['fullName', 'position'],
            },
          },
        },
        name_eliminated: {
          fields: ['fullName', 'position'],
        },
      },
    })

    return view.render('pages/defect/show', {
      title: 'Подробный просмотр',
      defectSerialize,
    })
  }

  public async edit({ params, response, view, session, bouncer }: HttpContextContract) {
    const defect = await Defect.find(params.id)

    if (await bouncer.denies('editDefect', defect)) {
      session.flash('dangerMessage', 'У вас нет прав на редактирование записи!')

      return response.redirect().toPath('/')
    }

    if (defect) {
      const defectSerialize = defect.serialize()
      const typeDefects = await DefectType.all()
      const substations = await Substation.all()

      return view.render('pages/defect/form', {
        title: 'Редактирование',
        options: {
          idData: defect.id,
          routePath: {
            savePath: 'defects.update',
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

  public async update({ params, request, response, session, bouncer }: HttpContextContract) {
    const defect = await Defect.find(params.id)

    if (await bouncer.denies('editDefect', defect)) {
      session.flash('dangerMessage', 'У вас нет прав на редактирование записи!')

      return response.redirect().toPath('/')
    }

    if (defect) {
      const validateDefectData = await request.validate(DefectValidator)

      defect.id_type_defect = +validateDefectData.defect_type
      defect.id_substation = +validateDefectData.substation
      defect.accession = validateDefectData.accession
      defect.description_defect = validateDefectData.description_defect
      defect.term_elimination = validateDefectData.term_elimination
      defect.importance = validateDefectData.importance ? validateDefectData.importance : 'false'

      await defect.save()

      session.flash('successMessage', `Данные дефекта успешно обновлены.`)
      response.redirect().toRoute('DefectsController.index')
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().back()
    }
  }

  public async destroy({ response, params, session, bouncer }: HttpContextContract) {
    const defect = await Defect.find(params.id)

    if (await bouncer.denies('deleteDefect', defect)) {
      session.flash('dangerMessage', 'У вас нет прав на удаление записи!')

      return response.redirect().toPath('/')
    }

    if (defect) {
      await defect.related('intermediate_checks').query().delete()
      await defect.delete()

      session.flash('successMessage', `Дефект успешно удален!`)
      response.redirect().back()
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().back()
    }
  }

  public async checkupCreate({ response, params, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.denies('createCheckup')) {
      session.flash('dangerMessage', 'У вас нет прав на добавление проверки!')

      return response.redirect().toPath('/')
    }

    const idDefect = await params.idDefect
    const defect = await Defect.find(idDefect)

    if (defect) {
      const staff = await Staff.all()

      return view.render('pages/defect/form_checkupandclose', {
        title: 'Добавление проверки',
        checkup: true,
        options: {
          defect: idDefect,
          routes: {
            saveData: 'defects.checkup.store',
            back: 'defects.show',
          },
        },
        staff,
      })
    } else {
      session.flash('dangerMessage', 'Вы не можете добавить проверку к не существующему дефекту!')

      return response.redirect().toPath('/')
    }
  }

  public async checkupStore({ params, request, response, auth, session, bouncer }: HttpContextContract) {
    if (await bouncer.denies('createCheckup')) {
      session.flash('dangerMessage', 'У вас нет прав на добавление проверки!')

      return response.redirect().toPath('/')
    }

    const idDefect = await params.idDefect
    const defect = await Defect.find(idDefect)

    if (defect) {
      const validateData = await request.validate(DefectResultValidator)

      if (validateData) {
        const checkupDefect = {
          id_defect: +idDefect,
          id_user: auth.user!.id,
          id_inspector: +validateData.employee,
          check_date: validateData.date,
          description_results: validateData.description_results,
          transferred: validateData.transferred,
        }

        // const test = ({ employee, ...rest }) => rest

        await IntermediateCheck.create(checkupDefect)

        session.flash('successMessage', `Проверка успешно добавлена!`)
        response.redirect().toRoute('DefectsController.show', { id: params.idDefect })
      } else {
        session.flash('dangerMessage', 'Что-то пошло не так!')
        response.redirect().toRoute('DefectsController.index')
      }
    } else {
      session.flash('dangerMessage', 'Вы не можете добавить проверку к не существующему дефекту!')

      return response.redirect().toPath('/')
    }
  }

  public async closeDefectCreate({ response, params, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.denies('createCloseDefect')) {
      session.flash('dangerMessage', 'У вас нет прав на закрытие дефекта!')

      return response.redirect().toPath('/')
    }

    const idDefect = await params.idDefect
    const defect = await Defect.find(idDefect)

    if (defect) {
      const staff = await Staff.all()

      return view.render('pages/defect/form_checkupandclose', {
        title: 'Закрытие дефекта',
        options: {
          defect: idDefect,
          routes: {
            saveData: 'defects.close.store',
            back: 'defects.show',
          },
        },
        staff,
      })
    } else {
      session.flash('dangerMessage', 'Вы не можете закрыть несуществующий дефект!')

      return response.redirect().toPath('/')
    }
  }

  public async closeDefectStore({ params, request, response, session, bouncer }: HttpContextContract) {
    if (await bouncer.denies('createCloseDefect')) {
      session.flash('dangerMessage', 'У вас нет прав на закрытие дефекта!')

      return response.redirect().toPath('/')
    }

    const defect = await Defect.find(params.idDefect)

    if (defect) {
      const validateData = await request.validate(DefectResultValidator)

      defect.id_name_eliminated = +validateData.employee
      defect.result = validateData.description_results
      defect.elimination_date = validateData.date

      await defect.save()

      session.flash('successMessage', `Дефект закрыт.`)
      response.redirect().toRoute('DefectsController.show', { id: params.idDefect })
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().toRoute('DefectsController.index')
    }
  }
}
