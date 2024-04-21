/* eslint-disable prettier/prettier */
import { CustomMessages, rules, schema } from '@ioc:Adonis/Core/Validator'

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class IntermediateCheckValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    employee: schema.string(),
    description_results: schema.string({}, [rules.trim(), rules.escape(), rules.minLength(2), rules.maxLength(700)]),
    transferred: schema.number.optional(),
    type_defect: schema.enum(['tm', 'os', 'rs'] as const),
  })

  public messages: CustomMessages = {
    'required': 'Поле является обязательным.',
    'minLength': 'Минимальная длина поля {{ options.minLength }} символа.',
    'maxLength': 'Максимальная длинна поля {{ options.maxLength }} символов',
    'enum': 'Поле "тип дефекта" должно содержать одно из значений: tm, os, rs ',
  }
}
