import { IDistrictParams } from 'App/Interfaces/DistrictParams'
import District from 'App/Models/District'

export default class DistrictService {
  public static async getDistricts(params: IDistrictParams): Promise<District[]> {
    const { req, limit = 15, status } = params
    const page = req ? req.input('page', 1) : 1
    const districts = await District.query()
      .preload('district_defects', (query) =>
        query
          .if(status === 'close', (query) => query.whereNotNull('result'))
          .if(status === 'open', (query) => query.whereNull('result'))
      )
      .preload('district_defects_os', (query) =>
        query
          .if(status === 'close', (query) => query.whereNotNull('result'))
          .if(status === 'open', (query) => query.whereNull('result'))
      )
      .paginate(page, limit)

    districts.baseUrl('/districts')

    return districts
  }
  public static async getDistrictSubstations(params: Record<string, unknown>): Promise<District> {
    const district = await District.findOrFail(params.id)

    await district.load('substations', (query) => {
      query.preload('defects')
      query.preload('defectsOs')
    })

    return district
  }
}
