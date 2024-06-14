import { CustomMessages, schema } from '@ioc:Adonis/Core/Validator'

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { EDateQueryType } from 'App/Enums/DateQueryType'
import { IQueryParams } from 'App/Interfaces/QueryParams'
import Defect from 'App/Models/Defect'
import DefectGroup from 'App/Models/DefectGroup'
import DefectOs from 'App/Models/DefectOs'
import DefectType from 'App/Models/DefectType'
import District from 'App/Models/District'
import Substation from 'App/Models/Substation'

export default class ReportsController {
  public async showDistrictDefects({ response, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.with('ReportPolicy').denies('viewReportDistrictDefects')) {
      session.flash('dangerMessage', 'У вас нет доступа к данной странице!')

      return response.redirect().toPath('/')
    }

    const districts = await District.query()

    return view.render('pages/reports/districts_defect/index', {
      title: 'Список дефектов по РЭС или ГП',
      messages: {
        noContent: 'Отчет не сформирован.',
      },
      districts,
    })
  }

  public async getDistrictDefects({
    request,
    response,
    view,
    session,
    bouncer,
  }: HttpContextContract) {
    if (await bouncer.with('ReportPolicy').denies('viewReportDistrictDefects')) {
      session.flash('dangerMessage', 'У вас нет доступа к данной странице!')

      return response.redirect().toPath('/')
    }

    const districts = await District.query()
    const validationSchema = schema.create({
      district: schema.number(),
      status: schema.string(),
    })
    const customMessages: CustomMessages = {
      required: 'Поле является обязательным.',
    }
    const validateData = await request.validate({
      schema: validationSchema,
      messages: customMessages,
    })
    const districtData = await District.find(validateData.district)
    let noContentDefect: string | null = null
    let titleText: string = ''

    if (districtData) {
      await districtData.load((loader) => {
        loader.load('substations', (substationsQuery) => {
          substationsQuery.preload('defects', (defectsQuery) => {
            titleText = 'всех'
            noContentDefect = 'По ПС нету дефектов'
            defectsQuery
              .if(validateData.status === 'openDefects', (query) => {
                titleText = 'открытых'
                noContentDefect = 'По ПС нету открытых дефектов'
                query.whereNull('result')
              })
              .if(validateData.status === 'closeDefects', (query) => {
                titleText = 'закрытых'
                noContentDefect = 'По ПС нету закрытых дефектов'
                query.whereNotNull('result')
              })
              .orderBy('term_elimination', 'asc')
              .preload('defect_type')
              .preload('accession')
          })
        })
      })

      return view.render('pages/reports/districts_defect/index', {
        title: `Список ${titleText} дефектов по "${districtData?.name}"`,
        messages: {
          noContent: 'В районе или ГП нету ПС.',
          noContentDefect: noContentDefect,
        },
        district: districtData,
        districts,
        filters: {
          status: validateData.status,
        },
      })
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().toRoute('reports.show.district.defects')
    }
  }

  public async showAllDefectsTM({ response, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.with('ReportPolicy').denies('viewReportAllDefectsTm')) {
      session.flash('dangerMessage', 'У вас нет доступа к данной странице!')

      return response.redirect().toPath('/')
    }

    const substations = await Substation.query()
    const typesDefects = await DefectType.query()

    return view.render('pages/reports/all-defects-tm/index', {
      title: 'Список всех дефектов по ТМ',
      messages: {
        noContent: 'Отчет не сформирован.',
      },
      substations: [{ id: 'all', name: 'Все ПС' }, ...substations],
      typesDefects,
    })
  }

  public async getAllDefectsTM({ request, response, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.with('ReportPolicy').denies('viewReportAllDefectsTm')) {
      session.flash('dangerMessage', 'У вас нет доступа к данной странице!')

      return response.redirect().toPath('/')
    }

    const { substation, typeDefect, status, dateStart, dateEnd, dateQueryType } =
      request.qs() as IQueryParams
    const substations = await Substation.query()
    const typesDefects = await DefectType.query()
    const defects = await Defect.query()
      .if(dateStart && dateEnd && EDateQueryType[dateQueryType], (query) => {
        query.whereBetween(EDateQueryType[dateQueryType], [dateStart, dateEnd])
      })
      .orderBy('id_substation', 'asc')
      .if(substation !== 'all' && substation !== undefined, (query) => {
        query.where('id_substation', '=', substation)
      })
      .preload('substation')
      .preload('accession')
      .preload('defect_type')
      .if(status === 'open', (query) => query.whereNull('result'))
      .if(status === 'close', (query) => query.whereNotNull('result'))
      .if(typeDefect !== undefined && typeDefect !== 'all', (query) =>
        query.where('id_type_defect', '=', typeDefect!)
      )
    const countDefect = defects.length

    return view.render('pages/reports/all-defects-tm/index', {
      title: 'Список всех дефектов по ТМ',
      messages: {
        noContent: 'Дефектов нету или не выбрана ПС',
      },
      filters: {
        substation,
        typeDefect,
        status,
        dateStart,
        dateEnd,
        dateQueryType,
      },
      substations: [{ id: 'all', name: 'Все ПС' }, ...substations],
      typesDefects,
      defects,
      countDefect,
    })
  }

  public async showAllDefectsOS({ response, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.with('ReportPolicy').denies('viewReportAllDefectsOs')) {
      session.flash('dangerMessage', 'У вас нет доступа к данной странице!')

      return response.redirect().toPath('/')
    }

    const substations = await Substation.query()
    const defectOsGroups = await DefectGroup.query()

    return view.render('pages/reports/all-defects-os/index', {
      title: 'Все дефекты по ОС',
      messages: {
        noContent: 'Отчет не сформирован.',
      },
      substations: [{ id: 'all', name: 'Все ПС' }, ...substations],
      defectGroups: [{ id: 'all', name: 'Все категории' }, ...defectOsGroups],
    })
  }

  public async getAllDefectsOS({ request, response, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.with('ReportPolicy').denies('viewReportAllDefectsOs')) {
      session.flash('dangerMessage', 'У вас нет доступа к данной странице!')

      return response.redirect().toPath('/')
    }

    const { substation, status, dateStart, dateEnd, dateQueryType, groupDefect } =
      request.qs() as IQueryParams
    const substations = await Substation.query()
    const defectOsGroups = await DefectGroup.query()
    const defectsOs = await DefectOs.query()
      .if(groupDefect && groupDefect !== 'all', (query) => {
        query.where('id_defect_group', '=', groupDefect)
      })
      .if(dateStart && dateEnd && EDateQueryType[dateQueryType], (query) => {
        query.whereBetween(EDateQueryType[dateQueryType], [dateStart, dateEnd])
      })
      .orderBy('id_substation', 'asc')
      .if(substation !== 'all' && substation !== undefined, (query) => {
        query.where('id_substation', '=', substation)
      })
      .if(status === 'open', (query) => query.whereNull('result'))
      .if(status === 'close', (query) => query.whereNotNull('result'))
      .preload('substation')
      .preload('defect_group')
    const countDefectOs = defectsOs.length

    return view.render('pages/reports/all-defects-os/index', {
      title: 'Все дефекты по ОС',
      messages: {
        noContent: 'Дефектов нету или не выбрана ПС.',
      },
      filters: {
        substation,
        status,
        dateStart,
        dateEnd,
        dateQueryType,
        groupDefect,
      },
      substations: [{ id: 'all', name: 'Все ПС' }, ...substations],
      defectGroups: [{ id: 'all', name: 'Все категории' }, ...defectOsGroups],
      defectsOs,
      countDefectOs,
    })
  }
}
