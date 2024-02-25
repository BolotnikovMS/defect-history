import { RequestContract } from '@ioc:Adonis/Core/Request'
import { IDefectParams } from './DefectParams'

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface IDistrictParams extends IDefectParams {
  req?: RequestContract
  limit?: number
}
