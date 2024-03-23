import { IDefectParams } from 'App/Interfaces/DefectParams'
import DefectOs from 'App/Models/DefectOs'

export default class DefectOSService {
  public static async getNumberDefects(params?: IDefectParams): Promise<number> {
    const numberDefects = (
      await DefectOs.query()
        .if(params?.closedDefects, (query) => query.whereNotNull('result'))
        .if(params?.openedDefects, (query) => query.whereNull('result'))
        .count('* as total')
    )[0].$extras.total

    return numberDefects
  }
}
