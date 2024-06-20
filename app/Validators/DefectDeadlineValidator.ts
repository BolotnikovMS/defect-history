import { CustomMessages, schema } from '@ioc:Adonis/Core/Validator'

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { dateFormat } from './fields'

export default class DefectDeadlineValidator {
  constructor(protected ctx: HttpContextContract) { }

  public schema = schema.create({
    term_elimination: dateFormat,
  })

  public messages: CustomMessages = {
    // eslint-disable-next-line prettier/prettier
    required: 'Поле является обязательным.',
    'date.format': 'Дата и время должны иметь формат: {{ options.format }}.',
  }
}
