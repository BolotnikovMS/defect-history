import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class DefectDeadlineValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    term_elimination: schema.date({ format: 'dd.MM.yyyy HH:mm' }),
  })

  public messages: CustomMessages = {
    // eslint-disable-next-line prettier/prettier
    required: 'Поле является обязательным.',
    'date.format': 'Дата и время должны иметь формат: {{ options.format }}.',
  }
}
