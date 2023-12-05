import { CustomMessages, rules, schema } from '@ioc:Adonis/Core/Validator'

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class TypesDefectValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    type_defect: schema.string({}, [
      rules.trim(),
      rules.escape(),
      rules.minLength(2),
      rules.maxLength(180),
    ]),
    defect_description: schema.string.optional({}, [
      rules.trim(),
      rules.escape(),
      rules.minLength(2),
      rules.maxLength(350),
    ]),
    group: schema.number.optional(),
  })

  public messages: CustomMessages = {
    required: 'Поле является обязательным.',
    minLength: 'Минимальная длина поля {{ options.minLength }} символа.',
    maxLength: 'Максимальная длинна поля {{ options.maxLength }} символов',
  }
}
