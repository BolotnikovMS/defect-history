import { RequestContract } from '@ioc:Adonis/Core/Request'
import { TStatus } from 'App/Types'

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface IDistrictParams {
  status?: TStatus
  req?: RequestContract
  limit?: number
}
