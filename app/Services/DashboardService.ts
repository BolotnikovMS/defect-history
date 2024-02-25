import DefectType from 'App/Models/DefectType'

export default class DashboardService {
  public static async getTMDefectsByType(close: boolean = false): Promise<DefectType[]> {
    console.log('close: ', close)
    const typesDefectsTM = await DefectType.query().preload('defects', (query) => {
      query.if(close, (query) => query.whereNotNull('result'))
    })

    return typesDefectsTM
  }
}
