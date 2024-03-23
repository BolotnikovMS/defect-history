import { CustomMessages, rules, schema } from '@ioc:Adonis/Core/Validator'

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class DepartmentValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({}, [
      rules.trim(),
      rules.escape(),
      rules.minLength(2),
      rules.maxLength(100),
    ]),
    addNext: schema.boolean.optional(),
  })

  public messages: CustomMessages = {
    required: 'Поле является обязательным.',
    minLength: 'Минимальная длина поля {{ options.minLength }} символа.',
    maxLength: 'Максимальная длинна поля {{ options.maxLength }} символов',
  }
}
