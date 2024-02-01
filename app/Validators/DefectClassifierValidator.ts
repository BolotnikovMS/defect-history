import { CustomMessages, rules, schema } from '@ioc:Adonis/Core/Validator'

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class DefectClassifierValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    defect_group: schema.number(),
    name: schema.string([rules.trim(), rules.minLength(2), rules.escape()]),
  })

  public messages: CustomMessages = {
    required: 'Поле является обязательным.',
    minLength: 'Минимальная длина поля {{ options.minLength }} символа.',
  }
}
