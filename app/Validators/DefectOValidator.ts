import { CustomMessages, rules, schema } from '@ioc:Adonis/Core/Validator'

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class DefectOsValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    departments: schema.array([rules.minLength(1), rules.maxLength(10)]).members(schema.number()),
    substation: schema.number(),
    accession: schema.string({}, [
      rules.trim(),
      rules.minLength(2),
      rules.maxLength(250),
      rules.escape(),
    ]),
    defect_group: schema.number(),
    defect_classifier: schema.number(),
    description_defect: schema.string({}, [
      rules.trim(),
      rules.minLength(2),
      rules.maxLength(700),
      rules.escape(),
    ]),
    importance: schema.boolean.optional(),
    comment: schema.string.optional({}, [
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
