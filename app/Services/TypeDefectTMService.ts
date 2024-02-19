import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import DefectType from 'App/Models/DefectType'
import TypesDefectValidator from 'App/Validators/TypesDefectValidator'

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
  public static async store(req: RequestContract, auth: AuthContract): Promise<DefectType> {
    const validatedData = await req.validate(TypesDefectValidator)
    const typeDefect = await DefectType.create({
      id_user_created: auth.user?.id,
      id_distribution_group: validatedData.group,
      type_defect: validatedData.type_defect,
      defect_description: validatedData.defect_description,
    })

    return typeDefect
  }
}
