import { CustomMessages, rules, schema } from '@ioc:Adonis/Core/Validator'

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

const descriptionResults = schema.string([
  rules.trim(),
  rules.escape(),
  rules.minLength(2),
  rules.maxLength(700),
])
const transferred = schema.number.optional()
const typeDefect = schema.enum(['tm', 'os', 'rs'] as const)

export default class IntermediateCheckOsValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    description_results: descriptionResults,
    transferred,
    type_defect: typeDefect,
  })

  public messages: CustomMessages = {
    required: 'Поле является обязательным.',
    minLength: 'Минимальная длина поля {{ options.minLength }} символа.',
    maxLength: 'Максимальная длинна поля {{ options.maxLength }} символов',
    enum: 'Поле "тип дефекта" должно содержать одно из значений: tm, os, rs ',
  }
}
