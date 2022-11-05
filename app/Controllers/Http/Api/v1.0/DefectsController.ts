import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Defect from 'App/Models/Defect'

export default class DefectsController {
  public async index({response}: HttpContextContract) {
   try {
     const defects = await Defect
       .query()
       .preload('substation')
       .preload('defect_type')
       .preload('intermediate_checks', (intermediateChecksQuery) => {
         intermediateChecksQuery.preload('name_inspector')
       })
       .preload('name_eliminated')

     const defectsJSON = defects.map(defect => {
       return defect.serialize({
         relations: {
           substation: {
             fields: ['name']
           },
           defect_type: {
             fields: ['type_defect']
           },
           intermediate_checks: {
             fields: ['id', 'check_date', 'test_result'],
             relations: {
               name_inspector: {
                 fields: ['fullName', 'position']
               }
             }
           },
           name_eliminated: {
             fields: ['fullName', 'position']
           }
         }
       })
     })

     return response.status(200).json(defectsJSON)
   } catch (e) {
      return response.badRequest(e.messages)
   }
  }

  public async create({}: HttpContextContract) {}

  public async store({request}: HttpContextContract) {
    console.log(request.body())
    await Defect.create(request.body())
  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
