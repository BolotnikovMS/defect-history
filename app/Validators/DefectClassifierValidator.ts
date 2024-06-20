import { CustomMessages, schema } from '@ioc:Adonis/Core/Validator'

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { text250 } from './fields'

export default class DefectClassifierValidator {
  constructor(protected ctx: HttpContextContract) { }

  public schema = schema.create({
    name: text250,
  })

  public messages: CustomMessages = {
    required: 'Поле является обязательным.',
    minLength: 'Минимальная длина поля {{ options.minLength }} символа.',
  }
}
