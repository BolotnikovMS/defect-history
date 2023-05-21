import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import DefectType from 'App/Models/DefectType'

export default class DefectTypesController {
  public async index({ request, response }: HttpContextContract) {
    const { limit, sortBy, offset, pattern } = request.qs()
    const defectTypes = await DefectType.query()
      .if(limit, (query) => query.limit(limit))
      .if(sortBy, (query) => query.orderBy('created_at', sortBy))
      .if(offset, (query) => query.offset(offset))
      // sqlite не поддерживает whereILike - поиск без учета регистра (только pg)
      .if(pattern, (query) => query.whereLike('type_defect', `%${pattern}%`))

    return response.status(200).json(defectTypes)
  }

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({ response, params }: HttpContextContract) {
    const defectType = await DefectType.find(params.id)

    if (defectType) {
      return response.status(200).json(defectType)
    } else {
      return response.status(404).send({ status: 404, messages: 'Not Found' })
    }
  }

  public async showDefects({ request, response, params }: HttpContextContract) {
    const { limit, sortBy, offset } = request.qs()
    console.log(sortBy)

    const defectType = await DefectType.find(params.id)

    if (defectType) {
      await defectType.load('defects', (queryDefects) => {
        queryDefects
          .if(limit, (query) => query.limit(limit))
          .if(sortBy, (query) => {
            const [key, direction] = sortBy.split('.')

            query.orderBy(key, direction)
          })
          .if(offset, (query) => query.offset(offset))
      })

      return response.status(200).json(defectType)
    } else {
      return response.status(404).send({ status: 404, messages: 'Not Found' })
    }
  }

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
