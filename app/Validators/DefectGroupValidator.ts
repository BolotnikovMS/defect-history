import { CustomMessages, rules, schema } from '@ioc:Adonis/Core/Validator'

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class DefectGroupValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({}, [
      rules.trim(),
      rules.minLength(2),
      rules.maxLength(100),
      rules.escape(),
    ]),
    type: schema.string([rules.trim(), rules.alpha()]),
  })

  public messages: CustomMessages = {
    required: 'Поле является обязательным.',
    minLength: 'Минимальная длина поля {{ options.minLength }} символа.',
    maxLength: 'Максимальная длина поля {{ options.maxLength }} символов.',
    alpha: 'Выберите тип для группы дефектов.',
  }
}
