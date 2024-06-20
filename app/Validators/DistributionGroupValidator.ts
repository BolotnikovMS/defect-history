import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { CustomMessages, schema } from '@ioc:Adonis/Core/Validator'
import { text350Optional, text250 } from './fields'

export default class DistributionGroupValidator {
  constructor(protected ctx: HttpContextContract) { }

  public schema = schema.create({
    name: text250,
    description: text350Optional,
  })

  public messages: CustomMessages = {
    required: 'Поле является обязательным.',
    minLength: 'Минимальная длина поля {{ options.minLength }} символа.',
    maxLength: 'Максимальная длинна поля {{ options.maxLength }} символов',
  }
}
