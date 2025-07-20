import { schema, validator } from '@ioc:Adonis/Core/Validator'
import { idSubstation, status } from 'App/Validators/fields'

const validatedParamsSchema = schema.create({
  idSubstation: idSubstation,
  status: status,
})

export const defectsCountValidationParams = {
  schema: validatedParamsSchema,
  messages: {
    required: 'Параметр "id" обязателен!',
    exists: 'Не удалось получить дефекты по указанному ключу!',
    number: 'Некорректный формат числа. Параметр должен содержать числовое значение!',
    enum: 'Допустимые значения параметра: "{{ options.choices }}".',
  },
  reporter: validator.reporters.api,
}
