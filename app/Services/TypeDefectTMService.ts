import { RequestContract } from '@ioc:Adonis/Core/Request'
import DefectType from 'App/Models/DefectType'

export default class TypeDefectTMService {
  public static async getTypeDefectTM(req: RequestContract, limit: number = 15) {
    const page = req.input('page', 1)
    const limitData = limit
    const typesDefects = await DefectType.query()
      .orderBy('created_at', 'asc')
      .preload('group')
      .paginate(page, limitData)

    typesDefects.baseUrl('/types-defects')

    return typesDefects
  }
}
