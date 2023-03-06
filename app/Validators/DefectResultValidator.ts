import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class DefectResultValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    employee: schema.string(),
    description_results: schema.string({}, [rules.trim(), rules.escape(), rules.minLength(2)]),
    date: schema.date(),
    transferred: schema.number.optional(),
  })

  public messages: CustomMessages = {
    required: 'Поле является обязательным.',
    minLength: 'Минимальная длина поля 2 символа.',
  }
}
