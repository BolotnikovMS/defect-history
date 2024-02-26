import { IDistrictParams } from 'App/Interfaces/DistrictParams'
import District from 'App/Models/District'

export default class DistrictService {
  public static async getDistricts(params: IDistrictParams): Promise<District[]> {
    const { req, limit = 15, closedDefects, openedDefects } = params
    const page = req ? req.input('page', 1) : 1
    const districts = await District.query()
      .preload('district_defects', (query) =>
        query
          .if(closedDefects, (query) => query.whereNotNull('result'))
          .if(openedDefects, (query) => query.whereNull('result'))
      )
      .preload('district_defects_os', (query) =>
        query
          .if(closedDefects, (query) => query.whereNotNull('result'))
          .if(openedDefects, (query) => query.whereNull('result'))
      )
      .paginate(page, limit)

    districts.baseUrl('/districts')

    return districts
  }
}
