import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { CustomMessages, schema } from '@ioc:Adonis/Core/Validator'
import { booleanCheckOptional, text100, typeDefect } from './fields'


export default class DefectGroupValidator {
  constructor(protected ctx: HttpContextContract) { }

  public schema = schema.create({
    name: text100,
    // type: schema.string([rules.trim(), rules.alpha()]),
    type: typeDefect,
    importance: booleanCheckOptional,
  })

  public messages: CustomMessages = {
    required: 'Поле является обязательным.',
    minLength: 'Минимальная длина поля {{ options.minLength }} символа.',
    maxLength: 'Максимальная длина поля {{ options.maxLength }} символов.',
    alpha: 'Выберите тип для группы дефектов.',
    enum: 'Поле должно содержать одно из значений: тм, ос, рс',
  }
}
