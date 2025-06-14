import { RequestContract } from '@ioc:Adonis/Core/Request'
import { EDateQueryType } from 'App/Enums/DateQueryType'
import { IQueryParams } from 'App/Interfaces/QueryParams'
import Defect from 'App/Models/Defect'
import ExcelJS, { Cell } from 'exceljs'

export default class ReportService {
  static #applyStylesRowTitle(worksheet: ExcelJS.Worksheet): void {
    worksheet.getRow(1).eachCell((cell: Cell) => {
      cell.alignment = { vertical: 'middle', horizontal: 'center' }
      cell.font = { bold: true, size: 15 }
      cell.border = {
        top: { style: 'medium' },
        bottom: { style: 'medium' },
        left: { style: 'medium' },
        right: { style: 'medium' },
      }
    })
  }

  static #applyStyles(worksheet: ExcelJS.Worksheet, columnNames?: string[]): void {
    worksheet.eachRow((row, rowNum) => {
      if (rowNum > 1) {
        row.eachCell({ includeEmpty: true }, (cell) => {
          cell.alignment = { vertical: 'middle', horizontal: 'center' }
          cell.font = { size: 14 }
          cell.border = {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' },
          }
        })
      }
    })

    if (columnNames && columnNames.length) {
      columnNames.forEach((colName) => {
        const column = worksheet.getColumn(colName)

        column.eachCell({ includeEmpty: false }, (cell, cellNum) => {
          if (cellNum > 1) {
            cell.alignment = { vertical: 'middle', wrapText: true }
          }
        })
      })
    }
  }
  public static async createExcelAllDefectsTM(req: RequestContract) {
    const { substation, typeDefect, status, dateStart, dateEnd, dateQueryType } =
      req.qs() as IQueryParams
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
      .preload('intermediate_checks', (query) => {
        query.preload('name_inspector')
      })
      .preload('work_planning', (query) => {
        query.preload('user_created')
      })
      .if(status === 'open', (query) => query.whereNull('result'))
      .if(status === 'close', (query) => query.whereNotNull('result'))
      .if(typeDefect !== undefined && typeDefect !== 'all', (query) =>
        query.where('id_type_defect', '=', typeDefect!)
      )
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Sheet1')

    worksheet.columns = [
      { header: 'Дата добавления', key: 'createdAt', width: 20 },
      { header: 'Объект', key: 'substation', width: 26 },
      { header: 'Тип', key: 'typeDefect', width: 15 },
      { header: 'Присоединение', key: 'accession', width: 30 },
      { header: 'Описание дефекта', key: 'description', width: 45 },
      { header: 'Срок устранения', key: 'termElimination', width: 20 },
      { header: 'Дата устранения', key: 'eliminationDate', width: 20 },
      { header: 'Результат', key: 'result', width: 45 },
      { header: 'Промежуточные результаты', key: 'intermediateChecks', width: 45 },
      { header: 'Подготовительные работы', key: 'workPlanning', width: 45 },
    ]

    this.#applyStylesRowTitle(worksheet)

    defects.forEach((defect) => {
      worksheet.addRow({
        createdAt: defect.created_at.toFormat('dd.MM.yyyy HH:mm'),
        substation: defect.substation.name,
        typeDefect: defect.defect_type.type_defect,
        accession: defect.accession.name,
        description: defect.description_defect,
        termElimination: defect.term_elimination.toFormat('dd.MM.yyyy HH:mm'),
        eliminationDate: defect.elimination_date?.toFormat('dd.MM.yyyy HH:mm'),
        result: defect.result,
        intermediateChecks: defect.intermediate_checks
          .map(
            (check, i) =>
              `${i + 1}. ${check.description_results}. ${check.name_inspector.shortUserName}`
          )
          .join(',\n'),
        workPlanning: defect.work_planning
          .map((work, i) => `${i + 1}. ${work.comment}. ${work.user_created.shortUserName}`)
          .join(',\n'),
      })
    })

    this.#applyStyles(worksheet, ['description', 'result', 'intermediateChecks', 'workPlanning'])

    const buffer = await workbook.xlsx.writeBuffer()

    return buffer
  }
}
