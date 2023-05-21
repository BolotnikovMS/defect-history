import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AccessionSubstationValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({}, [
      rules.trim(),
      rules.escape(),
      rules.minLength(2),
      rules.maxLength(240),
    ]),
    importance: schema.boolean.optional(),
    addNext: schema.boolean.optional(),
  })

  public messages: CustomMessages = {
    required: 'Поле является обязательным.',
    minLength: 'Минимальная длина поля {{ options.minLength }} символа.',
    maxLength: 'Максимальная длина поля {{ options.maxLength }} символов.',
  }
}
