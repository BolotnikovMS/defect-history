import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class DistributionGroupValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({}, [rules.trim(), rules.minLength(2), rules.maxLength(250)]),
    description: schema.string.optional({}, [
      rules.trim(),
      rules.minLength(2),
      rules.maxLength(350),
    ]),
  })

  public messages: CustomMessages = {
    required: 'Поле является обязательным.',
    minLength: 'Минимальная длина поля 2 символа.',
    'name.maxLength': 'Максимальная длина поля 250 символов.',
    'description.maxLength': 'Максимальная длина поля 350 символов.',
  }
}
