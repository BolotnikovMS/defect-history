// eslint-disable-next-line @typescript-eslint/naming-convention
export interface IQueryParams {
  status: string
  department: number
  typeDefect: string | number | undefined
  defectsClass: string
  substation: number | string
  district: number
  sort: string
  dateStart: string
  dateEnd: string
  dateQueryType: string
  groupDefect: string
  typeObject: string
}
