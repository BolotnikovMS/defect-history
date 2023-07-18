import Env from '@ioc:Adonis/Core/Env'
import Event from '@ioc:Adonis/Core/Event'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Departments } from 'App/Enums/Departments'
import Defect from 'App/Models/Defect'
import DefectImg from 'App/Models/DefectImg'
import DefectType from 'App/Models/DefectType'
import Department from 'App/Models/Department'
import IntermediateCheck from 'App/Models/IntermediateCheck'
import Substation from 'App/Models/Substation'
import User from 'App/Models/User'
import { addDays, randomStr } from 'App/Utils/utils'
import CloseDefectValidator from 'App/Validators/CloseDefectValidator'
import DefectDeadlineValidator from 'App/Validators/DefectDeadlineValidator'
import DefectValidator from 'App/Validators/DefectValidator'
import IntermediateCheckValidator from 'App/Validators/IntermediateCheckValidator'
import { DateTime } from 'luxon'
import { unlink } from 'node:fs/promises'

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
      title: 'Дефекты по ТМ',
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
      const defect = {
        id_substation: validateDefectData.substation,
        id_type_defect: validateDefectData.defect_type,
        id_user_created: auth.user!.id,
        id_accession: validateDefectData.accession,
        description_defect: validateDefectData.description_defect,
        term_elimination: addDays(20),
        importance: validateDefectData.importance,
      }

      const newDefect = await Defect.create(defect)

      validateDefectData?.defect_img?.forEach(async (img) => {
        const imgName = `${new Date().getTime()}${randomStr()}.${img.extname}`

        await DefectImg.create({
          id_defect: newDefect.id,
          path_img: `/uploads/images/defects/${imgName}`,
        })
        await img.moveToDisk('images/defects/', { name: imgName })
      })

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
      await defect.load('defect_imgs')

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

      await defect.load('defect_imgs')

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

  public async update({ params, request, response, auth, session, bouncer }: HttpContextContract) {
    const defect = await Defect.find(params.id)

    if (defect) {
      if (await bouncer.denies('editDefect', defect)) {
        session.flash('dangerMessage', 'У вас нет прав на редактирование записи!')

        return response.redirect().toPath('/')
      }

      const validateDefectData = await request.validate(DefectValidator)
      const editedDefect = {
        id_user_updater: auth.user!.id,
        id_type_defect: +validateDefectData.defect_type,
        id_substation: +validateDefectData.substation,
        id_accession: validateDefectData.accession,
        description_defect: validateDefectData.description_defect,
        importance: validateDefectData.importance ? true : false,
      }

      const updDefect = await defect.merge(editedDefect).save()

      validateDefectData.defect_img?.forEach(async (img) => {
        const imgName = `${new Date().getTime()}${randomStr()}.${img.extname}`

        await DefectImg.create({
          id_defect: updDefect.id,
          path_img: `/uploads/images/defects/${imgName}`,
        })
        await img.moveToDisk('images/defects/', { name: imgName })
      })

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

      await defect.load('defect_imgs')
      await defect.related('intermediate_checks').query().delete()
      defect.defect_imgs?.forEach(async (img) => {
        try {
          await unlink(`./tmp${img.path_img}`)
        } catch (error) {
          console.log(`there was an error: ${error.message}`)
        }
      })
      await defect.related('defect_imgs').query().delete()
      await defect.delete()

      session.flash('successMessage', `Дефект успешно удален!`)
      response.redirect().back()
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().back()
    }
  }

  public async deleteImg({ response, params, session, bouncer }: HttpContextContract) {
    const defectImg = await DefectImg.find(params.idImg)
    const defect = await Defect.find(params.id)

    if (defect && defectImg) {
      if (await bouncer.denies('editDefect', defect)) {
        session.flash('dangerMessage', 'У вас нет прав на удаление!')

        return response.redirect().toPath('/')
      }

      try {
        await unlink(`./tmp${defectImg.path_img}`)
      } catch (error) {
        console.log(`there was an error: ${error.message}`)
        session.flash('dangerMessage', `${error.message}`)
      }
      await defectImg.delete()

      session.flash('successMessage', `Изображение успешно удаленно!`)
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
      const users = await User.query().where((queryUser) => {
        queryUser.where('blocked', '!=', true)
        queryUser.where('id', '!=', 1)
        queryUser.where('id_department', '!=', Departments.withoutDepartment)
      })
      const departments = await Department.query().where((queryDepartment) => {
        queryDepartment.where('id', '!=', Departments.admins)
        queryDepartment.where('id', '!=', Departments.withoutDepartment)
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
          check_date: DateTime.now(),
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

  public async checkupDestroy({ response, params, session, bouncer }: HttpContextContract) {
    const intermediateCheck = await IntermediateCheck.find(params.idInterCheck)

    if (intermediateCheck) {
      if (await bouncer.denies('deleteCheckup', intermediateCheck)) {
        session.flash('dangerMessage', 'У вас нет прав на удаление записи!')

        return response.redirect().toPath('/')
      }
      await intermediateCheck.delete()

      session.flash('successMessage', `Промежуточная проверка удалена!`)
      response.redirect().back()
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().back()
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
      const users = await User.query().where((queryUser) => {
        queryUser.where('blocked', '!=', true)
        queryUser.where('id', '!=', 1)
        queryUser.where('id_department', '!=', Departments.withoutDepartment)
      })

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
