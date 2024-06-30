import DefectOs from 'App/Models/DefectOs'
import Department from 'App/Models/Department'
import DepartmentService from 'App/Services/DepartmentService'
import { IDefectParams } from 'App/Interfaces/DefectParams'
import { IQueryParams } from 'App/Interfaces/QueryParams'
import { RequestContract } from '@ioc:Adonis/Core/Request'

export default class DefectOSService {
  public static async getDefects(req: RequestContract, limit: number = 15) {
    const page = req.input('page', 1)
    const { status, department } = req.qs() as IQueryParams
    const departments = await DepartmentService.getCleanDepartments()

    if (department && department.toString() !== 'all') {
      const departmentQuery = await Department.findOrFail(department)
      const defectsOs = await departmentQuery
        .related('defect_os')
        .query()
        .if(status === 'open', (query) => query.whereNull('result'))
        .if(status === 'close', (query) => query.whereNotNull('result'))
        .orderBy([
          {
            column: 'elimination_date',
            order: 'asc',
          },
          {
            column: 'created_at',
            order: 'desc',
          },
        ])
        .preload('substation')
        .preload('defect_group')
        .preload('user')
        .preload('departments')
        .paginate(page, limit)

      defectsOs.baseUrl('/defects-os')
      defectsOs.queryString({ status, department })

      return { defectsOs, filters: { status, departments, department } }
    } else {
      const defectsOs = await DefectOs.query()
        .if(status === 'open', (query) => query.whereNull('result'))
        .if(status === 'close', (query) => query.whereNotNull('result'))
        .orderBy([
          {
            column: 'elimination_date',
            order: 'asc',
          },
          {
            column: 'created_at',
            order: 'desc',
          },
        ])
        .preload('substation')
        .preload('defect_group')
        .preload('user')
        .preload('departments')
        .paginate(page, limit)

      defectsOs.baseUrl('/defects-os')
      defectsOs.queryString({ status, department })

      return { defectsOs, filters: { status, departments, department } }
    }
  }
  public static async getNumberDefects(params?: IDefectParams): Promise<number> {
    const numberDefects = (
      await DefectOs.query()
        .if(params?.closedDefects, (query) => query.whereNotNull('result'))
        .if(params?.openedDefects, (query) => query.whereNull('result'))
        .count('* as total')
    )[0].$extras.total

    return numberDefects
  }
  public static async getDefectById(id: number): Promise<DefectOs> {
    const defectOs = await DefectOs.findOrFail(id)

    await defectOs.load('substation')
    await defectOs.load('user')
    await defectOs.load('name_eliminated')
    await defectOs.load('departments')
    await defectOs.load('defect_group')
    await defectOs.load('defect_classifier')
    await defectOs.load('intermediate_checks', (query) => {
      query.preload('name_inspector')
      query.preload('responsible_department')
    })

    return defectOs
  }
}
