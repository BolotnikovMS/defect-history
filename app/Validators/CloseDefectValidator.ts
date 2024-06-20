import { CustomMessages, schema } from '@ioc:Adonis/Core/Validator'
import { text700, img, numberCheck } from './fields'

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CloseDefectValidator {
  constructor(protected ctx: HttpContextContract) { }

  public schema = schema.create({
    employee: numberCheck,
    description_results: text700,
    defect_img: img,
  })

  public messages: CustomMessages = {
    required: 'Поле является обязательным.',
    minLength: 'Минимальная длина поля {{ options.minLength }} символа.',
    maxLength: 'Максимальная длина поля {{ options.maxLength }} символов',
  }
}
