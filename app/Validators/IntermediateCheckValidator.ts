/* eslint-disable prettier/prettier */
import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class IntermediateCheckValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    employee: schema.string(),
    description_results: schema.string({}, [rules.trim(), rules.escape(), rules.minLength(2)]),
    date: schema.date({ format: 'dd.MM.yyyy HH:mm' }),
    transferred: schema.number.optional(),
  })

  public messages: CustomMessages = {
    required: 'Поле является обязательным.',
    minLength: 'Минимальная длина поля 2 символа.',
    'date.format': 'Дата и время должны иметь формат: {{ options.format }}.',
  }
}
