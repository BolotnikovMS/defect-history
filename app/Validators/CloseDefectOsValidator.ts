import { CustomMessages, rules, schema } from '@ioc:Adonis/Core/Validator'

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CloseDefectOsValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    description_results: schema.string({}, [
      rules.trim(),
      rules.minLength(2),
      rules.maxLength(700),
      rules.escape(),
    ]),
  })

  public messages: CustomMessages = {
    required: 'Поле является обязательным.',
    minLength: 'Минимальная длина поля {{ options.minLength }} символа.',
    maxLength: 'Максимальная длина поля {{ options.maxLength }} символов',
  }
}
