import { CustomMessages, schema } from '@ioc:Adonis/Core/Validator'

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { EDateQueryType } from 'App/Enums/DateQueryType'
import { IQueryParams } from 'App/Interfaces/QueryParams'
import Defect from 'App/Models/Defect'
import DefectType from 'App/Models/DefectType'
import District from 'App/Models/District'
import Substation from 'App/Models/Substation'

export default class ReportsController {
  public async showSubstationDefects({ response, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.with('ReportPolicy').denies('viewReportSubstationDefects')) {
      session.flash('dangerMessage', 'У вас нет доступа к данной странице!')

      return response.redirect().toPath('/')
    }

    const substations = await Substation.query()

    return view.render('pages/reports/substation_defects/index', {
      title: 'Список дефектов по ПС',
      messages: {
        noContent: 'Отчет не сформирован.',
      },
      substations,
    })
  }

  public async getSubstationDefects({
    request,
    response,
    view,
    session,
    bouncer,
  }: HttpContextContract) {
    if (await bouncer.with('ReportPolicy').denies('viewReportSubstationDefects')) {
      session.flash('dangerMessage', 'У вас нет доступа к данной странице!')

      return response.redirect().toPath('/')
    }

    const validationSchema = schema.create({
      substation: schema.number(),
      status: schema.string(),
    })
    const customMessages: CustomMessages = {
      required: 'Поле является обязательным.',
    }
    const validateData = await request.validate({
      schema: validationSchema,
      messages: customMessages,
    })
    const substations = await Substation.query()
    const substationData = await Substation.find(validateData.substation)
    let noContent: string | null = null
    let titleText: string = ''

    if (substationData) {
      await substationData.load((loader) => {
        loader.load('defects', (defectQuery) => {
          titleText = 'всех'
          noContent = 'По ПС нету открытых дефектов'
          defectQuery
            .preload('defect_type')
            .preload('accession')
            .preload('intermediate_checks')
            .if(validateData.status === 'openDefects', (query) => {
              titleText = 'открытых дефектов'
              noContent = substationData?.defects?.length ? null : 'По ПС нету открытых дефектов.'
              query.whereNull('result')
            })
            .if(validateData.status === 'openDefectsWithResults', (query) => {
              titleText = 'открытых дефектов с промежуточными результатами'
              noContent = substationData?.defects?.length
                ? null
                : 'По ПС нету открытых дефектов с промежуточными результатами.'
              query.has('intermediate_checks')
            })
            .if(validateData.status === 'closeDefects', (query) => {
              titleText = 'закрытых дефектов'
              noContent = substationData?.defects?.length ? null : 'По ПС нету закрытых дефектов.'
              query.whereNotNull('result')
            })
        })
      })

      return view.render('pages/reports/substation_defects/index', {
        title: `Список ${titleText} дефектов по ПС '${substationData.name}'`,
        messages: {
          noContent: noContent,
        },
        substations,
        substation: substationData,
        filters: {
          status: validateData.status,
        },
      })
    } else {
      session.flash('dangerMessage', 'Что-то пошло не так!')
      response.redirect().toRoute('reports.show.substation.defects')
    }
  }

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

  public async showAllDefects({ response, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.with('ReportPolicy').denies('viewReportAllDefects')) {
      session.flash('dangerMessage', 'У вас нет доступа к данной странице!')

      return response.redirect().toPath('/')
    }

    const typesDefects = await DefectType.query()

    return view.render('pages/reports/all_defects/index', {
      title: 'Список дефектов',
      messages: {
        noContent: 'Отчет не сформирован.',
      },
      typesDefects,
    })
  }

  public async getAllDefects({ request, response, view, session, bouncer }: HttpContextContract) {
    if (await bouncer.with('ReportPolicy').denies('viewReportAllDefects')) {
      session.flash('dangerMessage', 'У вас нет доступа к данной странице!')

      return response.redirect().toPath('/')
    }

    const validationSchema = schema.create({
      status: schema.string(),
      type: schema.number(),
    })
    const customMessages: CustomMessages = {
      required: 'Поле является обязательным.',
    }
    const validateData = await request.validate({
      schema: validationSchema,
      messages: customMessages,
    })
    let noContentDefect: string | null = null
    let titleText: string = 'всех'
    const typesDefects = await DefectType.query()
    const districts = await District.query()
      .preload('district_defects')
      .preload('substations', (substationQuery) => {
        substationQuery.preload('defects', (defectQuery) => {
          titleText = 'всех'
          noContentDefect = 'Дефектов нету'
          defectQuery
            .if(validateData?.type !== undefined && validateData?.type, (query) => {
              query.where('id_type_defect', '=', validateData.type)
            })
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

    // const test = districts.map((district) => district.serialize())
    // console.log(test[0])

    return view.render('pages/reports/all_defects/index', {
      title: `Список ${titleText} дефектов`,
      messages: {
        noContent: 'Нету дефектов',
        noContentDefect: noContentDefect,
      },
      districts,
      typesDefects,
      currentTypeDefect: validateData.type,
      filters: {
        status: validateData.status,
      },
    })
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

  public async index({}: HttpContextContract) {}

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
