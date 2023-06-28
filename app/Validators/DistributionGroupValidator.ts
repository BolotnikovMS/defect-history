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
    minLength: 'Минимальная длина поля {{ options.minLength }} символа.',
    maxLength: 'Максимальная длинна поля {{ options.maxLength }} символов',
  }
}
