import { rules, schema } from '@ioc:Adonis/Core/Validator'

export const employee = schema.string()
export const text700 = schema.string([
  rules.trim(),
  rules.minLength(2),
  rules.maxLength(700),
  rules.escape(),
])
export const text700Optional = schema.string.optional([
  rules.trim(),
  rules.minLength(2),
  rules.maxLength(700),
  rules.escape(),
])
export const text350Optional = schema.string.optional([
  rules.trim(),
  rules.minLength(2),
  rules.maxLength(350),
  rules.escape(),
])
export const text250 = schema.string([
  rules.trim(),
  rules.minLength(2),
  rules.maxLength(250),
  rules.escape(),
])
export const text40 = schema.string([
  rules.trim(),
  rules.minLength(2),
  rules.maxLength(40),
  rules.escape(),
])
export const text20 = schema.string([
  rules.trim(),
  rules.minLength(2),
  rules.maxLength(20),
  rules.escape(),
])
export const text100 = schema.string([
  rules.trim(),
  rules.minLength(2),
  rules.maxLength(100),
  rules.escape(),
])
export const text110 = schema.string([
  rules.trim(),
  rules.minLength(2),
  rules.maxLength(110),
  rules.escape(),
])
export const img = schema.array
  .optional()
  .members(schema.file({ size: '1mb', extnames: ['jpg', 'png', 'jpeg'] }))
export const typeDefect = schema.enum(['tm', 'os', 'rs'] as const)
export const dateFormat = schema.date({ format: 'dd.MM.yyyy HH:mm' })
export const numberCheck = schema.number()
export const numberOptional = schema.number.optional()
export const booleanCheckOptional = schema.boolean.optional()
export const numbersArray = schema
  .array([rules.minLength(1), rules.maxLength(10)])
  .members(schema.number())
export const username = schema.string([
  rules.trim(),
  rules.minLength(2),
  rules.maxLength(40),
  rules.unique({ table: 'users', column: 'username', caseInsensitive: true }),
  rules.escape(),
])
export const email = schema.string([
  rules.trim(),
  rules.email(),
  rules.unique({ table: 'users', column: 'email', caseInsensitive: true }),
  rules.escape(),
])
export const password = schema.string([rules.minLength(8), rules.maxLength(160)])
