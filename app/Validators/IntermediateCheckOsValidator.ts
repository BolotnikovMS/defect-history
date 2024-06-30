import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { CustomMessages, schema } from '@ioc:Adonis/Core/Validator'
import { text700, numberOptional, typeDefect } from './fields'

export default class IntermediateCheckOsValidator {
  constructor(protected ctx: HttpContextContract) { }

  public schema = schema.create({
    description_results: text700,
    transferred: numberOptional,
    type_defect: typeDefect,
  })

  public messages: CustomMessages = {
    required: 'Поле является обязательным.',
    minLength: 'Минимальная длина поля {{ options.minLength }} символа.',
    maxLength: 'Максимальная длинна поля {{ options.maxLength }} символов',
    enum: 'Поле "тип дефекта" должно содержать одно из значений: tm, os, rs ',
  }
}