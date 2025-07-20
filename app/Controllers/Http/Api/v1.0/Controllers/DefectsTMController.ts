import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import DefectTMService from 'App/Services/DefectTMService'
import { defectsCountValidationParams } from '../Validators/defectsTm/DefectsCountValidationParams'

export default class DefectsTMController {
  public async index({}: HttpContextContract) {}

  public async getCountDefectsByIdSubstation({ request, response, params }: HttpContextContract) {
    const validatedParams = await request.validate({
      ...defectsCountValidationParams,
      data: {
        idSubstation: params.idSubstation,
        status: request.qs().status,
      },
    })
    const defects = await DefectTMService.getNumberDefectsByIdSubstation(validatedParams)

    response.status(200).json(defects)
  }

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
