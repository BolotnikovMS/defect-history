import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { CustomMessages, schema } from '@ioc:Adonis/Core/Validator'
import { text700, text700Optional, text250, numberCheck, numbersArray } from './fields'

export default class DefectOsValidator {
  constructor(protected ctx: HttpContextContract) { }

  public schema = schema.create({
    departments: numbersArray,
    substation: numberCheck,
    accession: text250,
    defect_group: numberCheck,
    defect_classifier: numberCheck,
    description_defect: text700,
    comment: text700Optional,
  })

  public messages: CustomMessages = {
    required: 'Поле является обязательным.',
    minLength: 'Минимальная длина поля {{ options.minLength }} символа.',
    maxLength: 'Максимальная длина поля {{ options.maxLength }} символов',
  }
}
