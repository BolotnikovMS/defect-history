import { CustomMessages, schema } from '@ioc:Adonis/Core/Validator'

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { text700 } from './fields'

export default class CloseDefectOsValidator {
  constructor(protected ctx: HttpContextContract) { }

  public schema = schema.create({
    description_results: text700,
  })

  public messages: CustomMessages = {
    required: 'Поле является обязательным.',
    minLength: 'Минимальная длина поля {{ options.minLength }} символа.',
    maxLength: 'Максимальная длина поля {{ options.maxLength }} символов',
  }
}
