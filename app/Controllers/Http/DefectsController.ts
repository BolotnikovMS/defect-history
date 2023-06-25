import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { DateTime } from 'luxon'
import { addDays, randomStr } from 'App/Utils/utils'
import { unlink } from 'node:fs/promises'
import Defect from 'App/Models/Defect'
import Substation from 'App/Models/Substation'
import DefectValidator from 'App/Validators/DefectValidator'
import IntermediateCheckValidator from 'App/Validators/IntermediateCheckValidator'
import DefectDeadlineValidator from 'App/Validators/DefectDeadlineValidator'
import CloseDefectValidator from 'App/Validators/CloseDefectValidator'
import IntermediateCheck from 'App/Models/IntermediateCheck'
import Department from 'App/Models/Department'
import DefectType from 'App/Models/DefectType'
import User from 'App/Models/User'
import Event from '@ioc:Adonis/Core/Event'
import Env from '@ioc:Adonis/Core/Env'
import { Departments } from 'App/Enums/Departments'

export default class DefectsController {
  public async index({ request, view }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = 10

    const typesDefects = await DefectType.query()

    const typesDefectsToSort = typesDefects.map((type) => ({
      name: type.type_defect,
      path: 'types-defects.show',
      params: { id: type.id },
    }))

    const defects = await Defect.query()
      .orderBy('elimination_date', 'asc')
      .preload('defect_type')
      .preload('substation')
      .preload('accession')
      .preload('intermediate_checks')
      .paginate(page, limit)

    defects.baseUrl('/')

    // const test = defects.map((defect) => defect.serialize())
    // console.log('test: ', test)

    return view.render('pages/defect/index', {
      title: 'Все дефекты',
      typesDefects,
      typesDefectsToSort,
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
      const imgPaths: string[] = []

      validateDefectData?.defect_img?.forEach(async (img) => {
        const imgName = `${new Date().getTime()}${randomStr()}.${img.extname}`

        imgPaths.push(`/uploads/images/defects/${imgName}`)

        await img.moveToDisk('images/defects/', { name: imgName })
      })

      // validateDefectData?.defect_img?.forEach(async (img) => {
      //   const imgName = `${new Date().getTime()}${randomStr()}.${img.extname}`
      //   imgNameArr.push(`${imgName}`)

      //   await img.move(Application.resourcesPath('images/uploads/defects/'), {
      //     name: imgName,
      //   })
      // })

      // if (validateDefectData.defect_img) {
      //  validateDefectData.defect_img.map(async (img) => {
      //     // img.clientName = `${new Date().getTime()}${randomStr()}.${img.extname}`
      //     // img.move(Application.resourcesPath('images/uploads/defects/'))

      //     // imgName.push(img.clientName)
      //     await img.moveToDisk('images/defects/')
      //     console.log(img.fileName)

      //     imgNameArr.push(`${img.fileName}`)
      //   })

      //   console.log(test[0])
      // }

      const defect = {
        id_substation: validateDefectData.substation,
        id_type_defect: validateDefectData.defect_type,
        id_user_created: auth.user!.id,
        id_accession: validateDefectData.accession,
        ...validateDefectData,
        defect_img: imgPaths.length ? imgPaths : null,
        term_elimination: addDays(20),
      }

      const newDefect = await Defect.create(defect)

      await newDefect.load('defect_type', (queryGroup) => {
        queryGroup.whereNotNull('id_distribution_group').preload('group', (queryGroupUsers) => {
          queryGroupUsers.preload('group_users')
        })
      })

      const arrayUsers = newDefect.defect_type?.group.group_users

      if (
        arrayUsers?.length &&
        Env.get('SMTP_HOST') !== 'localhost' &&
        Env.get('SMTP_HOST') !== ''
      ) {
        Event.emit('send:mail-new-entry', {
          users: arrayUsers,
          templateMail: 'emails/template_mail_defects',
          subjectMail: 'Новая запись в журнале дефектов!',
          textMail: 'В журнал дефектов была добавлена новая запись.',
          defectId: newDefect.id,
          note: newDefect,
        })
      } else {
        console.log('В списке рассылки нету пользователей или не указан SMPT host!')
      }

      session.flash('successMessage', `Дефект успешно добавлен!`)
      response.redirect().toRoute('defects.index')
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().toRoute('defects.index')
    }
  }

  public async show({ response, params, view, session }: HttpContextContract) {
    const defect = await Defect.find(params.id)

    if (defect) {
      await defect.load('substation')
      await defect.load('accession')
      await defect.load('defect_type')
      await defect.load('intermediate_checks', (query) => {
        query.preload('name_inspector')
        query.preload('responsible_department')
      })
      await defect.load('name_eliminated')

      return view.render('pages/defect/show', {
        title: 'Подробный просмотр',
        defect: defect.serialize(),
      })
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().toRoute('defects.index')
    }
  }

  public async edit({ params, response, view, session, bouncer }: HttpContextContract) {
    const defect = await Defect.find(params.id)

    if (defect) {
      if (await bouncer.denies('editDefect', defect)) {
        session.flash('dangerMessage', 'У вас нет прав на редактирование записи!')

        return response.redirect().toPath('/')
      }

      const defectSerialize = defect.serialize()
      const typeDefects = await DefectType.all()
      const substations = await Substation.all()
      const accessionSubstations = await Substation.find(defectSerialize.id_substation)

      await accessionSubstations?.load('accession')

      return view.render('pages/defect/form', {
        title: 'Редактирование',
        options: {
          idData: defect.id,
          edit: true,
          routePath: {
            savePath: 'defects.update',
          },
        },
        defectSerialize,
        typeDefects,
        substations,
        accessionSubstations: accessionSubstations?.accession,
      })
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().back()
    }
  }

  public async update({ params, request, response, session, bouncer }: HttpContextContract) {
    const defect = await Defect.find(params.id)

    if (defect) {
      if (await bouncer.denies('editDefect', defect)) {
        session.flash('dangerMessage', 'У вас нет прав на редактирование записи!')

        return response.redirect().toPath('/')
      }

      const validateDefectData = await request.validate(DefectValidator)

      defect.id_type_defect = +validateDefectData.defect_type
      defect.id_substation = +validateDefectData.substation
      defect.id_accession = validateDefectData.accession
      defect.description_defect = validateDefectData.description_defect
      // eslint-disable-next-line prettier/prettier
      defect.importance = validateDefectData.importance ? true : false,

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

    if (defect) {
      if (await bouncer.denies('deleteDefect', defect)) {
        session.flash('dangerMessage', 'У вас нет прав на удаление записи!')

        return response.redirect().toPath('/')
      }

      await defect.related('intermediate_checks').query().delete()
      defect?.defect_img?.forEach(async (imgPath) => {
        try {
          await unlink(`./tmp${imgPath}`)

          console.log(`successfully deleted ${imgPath}`)
        } catch (error) {
          console.log(`there was an error: ${error.message}`)
        }
      })

      await defect.delete()

      session.flash('successMessage', `Дефект успешно удален!`)
      response.redirect().back()
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().back()
    }
  }

  public async editDeadline({ response, params, view, session, bouncer }: HttpContextContract) {
    const defect = await Defect.find(params.id)

    if (defect) {
      if (await bouncer.denies('editDefectDeadline', defect)) {
        session.flash('dangerMessage', 'У вас нет прав на редактирование срока устранения дефекта!')

        return response.redirect().toPath('/')
      }

      return view.render('pages/defect/form_edit_deadline', {
        title: 'Изменение даты устранения дефекта',
        defect: defect.serialize(),
      })
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().back()
    }
  }

  public async updateDeadline({
    params,
    request,
    response,
    session,
    bouncer,
  }: HttpContextContract) {
    const defect = await Defect.find(params.id)

    if (defect) {
      if (await bouncer.denies('editDefectDeadline', defect)) {
        session.flash('dangerMessage', 'У вас нет прав на редактирование срока устранения дефекта!')

        return response.redirect().toPath('/')
      }

      const validateDefectData = await request.validate(DefectDeadlineValidator)

      await defect.merge(validateDefectData).save()

      session.flash('successMessage', `Сроки устранения дефекта успешно обновлены!!`)
      response.redirect().toRoute('DefectsController.index')
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
      const users = await User.query().where('blocked', '=', false)
      const departments = await Department.query().where((query) => {
        query.where('id', '!=', Departments.admins)
        query.where('id', '!=', Departments.withoutDepartment)
      })

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
        users,
        departments,
      })
    } else {
      session.flash('dangerMessage', 'Вы не можете добавить проверку к не существующему дефекту!')

      return response.redirect().toPath('/')
    }
  }

  public async checkupStore({
    params,
    request,
    response,
    auth,
    session,
    bouncer,
  }: HttpContextContract) {
    if (await bouncer.denies('createCheckup')) {
      session.flash('dangerMessage', 'У вас нет прав на добавление проверки!')

      return response.redirect().toPath('/')
    }

    const idDefect = await params.idDefect
    const defect = await Defect.find(idDefect)

    if (defect) {
      const validateData = await request.validate(IntermediateCheckValidator)

      if (validateData) {
        const checkupDefect = {
          id_defect: +idDefect,
          id_user_created: auth.user!.id,
          id_inspector: +validateData.employee,
          check_date: validateData.date,
          description_results: validateData.description_results,
          transferred: validateData.transferred ? validateData.transferred : null,
        }
        // const test = ({ employee, ...rest }) => rest

        const newCheck = await IntermediateCheck.create(checkupDefect)

        await newCheck.load('responsible_department', (query) => {
          query.preload('department_users')
        })

        const arrayUsers = newCheck?.responsible_department?.department_users

        // console.log(newCheck?.responsible_department.serialize())

        if (
          arrayUsers?.length &&
          Env.get('SMTP_HOST') !== 'localhost' &&
          Env.get('SMTP_HOST') !== ''
        ) {
          Event.emit('send:mail-new-entry', {
            users: arrayUsers,
            templateMail: 'emails/template_mail_defects',
            subjectMail: 'Добавлена промежуточная проверка по дефекту!',
            textMail:
              'В журнал дефектов были добавлены результаты проверки. Дефект относится к вашему отделу.',
            defectId: newCheck.id_defect,
            note: newCheck,
          })
        } else {
          console.log('В списке рассылки нету пользователей или не указан SMPT host!')
        }

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

  public async closeDefectCreate({
    response,
    params,
    view,
    session,
    bouncer,
  }: HttpContextContract) {
    if (await bouncer.denies('createCloseDefect')) {
      session.flash('dangerMessage', 'У вас нет прав на закрытие дефекта!')

      return response.redirect().toPath('/')
    }

    const idDefect = await params.idDefect
    const defect = await Defect.find(idDefect)

    if (defect) {
      const users = await User.query().where('blocked', '=', false)

      return view.render('pages/defect/form_checkupandclose', {
        title: 'Закрытие дефекта',
        options: {
          defect: idDefect,
          routes: {
            saveData: 'defects.close.store',
            back: 'defects.show',
          },
        },
        users,
      })
    } else {
      session.flash('dangerMessage', 'Вы не можете закрыть несуществующий дефект!')

      return response.redirect().toPath('/')
    }
  }

  public async closeDefectStore({
    params,
    request,
    response,
    session,
    bouncer,
  }: HttpContextContract) {
    if (await bouncer.denies('createCloseDefect')) {
      session.flash('dangerMessage', 'У вас нет прав на закрытие дефекта!')

      return response.redirect().toPath('/')
    }

    const defect = await Defect.find(params.idDefect)

    if (defect) {
      const validateData = await request.validate(CloseDefectValidator)

      defect.id_name_eliminated = +validateData.employee
      defect.result = validateData.description_results
      defect.elimination_date = DateTime.now()

      await defect.save()

      session.flash('successMessage', `Дефект закрыт.`)
      response.redirect().toRoute('defects.show', { id: params.idDefect })
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().toRoute('defects.index')
    }
  }
}
