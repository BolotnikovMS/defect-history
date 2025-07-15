type TStatus = 'open' | 'close'

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface IDefectParams {
  idSubstation: number
  status?: TStatus
}
