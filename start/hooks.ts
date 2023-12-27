/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/

import View from '@ioc:Adonis/Core/View'
import { DateTime } from 'luxon'

View.global('menu', [
  {
    url: 'defects.index',
    name: 'Дефекты',
  },
  {
    url: 'types-defects.index',
    name: 'Типы дефектов',
  },
  {
    url: 'substations.index',
    name: 'Объекты',
  },
  {
    url: 'users.index',
    name: 'Пользователи',
  },
])

/*
  Функция возвращает компактный вид пагинации.
  @pagination - объект пагинации.
  @delta - ближайшие страницы к текущей страницы ( по умолчанию 2, если значение не передано).
*/

View.global('pageDottedRange', (pagination, delta: number = 2) => {
  // if (pagination.length === 0 || pagination.length === 1) {
  //   return []
  // }
  let current = parseInt(pagination.currentPage, 10)
  const last = pagination.lastPage
  let left = current - delta
  let right = current + delta + 1
  const range: number[] = []
  const pages: string[] = []
  const dots: string = '...'
  let l

  for (let i: number = 1; i <= last; i++) {
    if (i === 1 || i === last || (i >= left && i < right)) {
      range.push(i)
    }
  }

  range.forEach(function (i) {
    if (l) {
      if (i - l > 1) {
        pages.push(dots)
      }
    }

    pages.push(i)
    l = i
  })

  const objectPagination = {
    pages: pages,
    firstPage: pagination?.firstPage,
    total: pagination?.total,
    hasTotal: pagination?.hasTotal,
    lastPage: pagination?.lastPage,
    hasPages: pagination?.hasPages,
  }

  return objectPagination
})

View.global('isCurrent', (pagination, page) => {
  return pagination.currentPage === page
})

View.global('dateFormat', (date: string | DateTime): string | DateTime => {
  if (typeof date === 'string') {
    return date.replace(new RegExp('-', 'g'), '.').split('.').reverse().join('.')
  } else {
    return date.toFormat('dd.MM.yyyy HH:mm')
  }
})
