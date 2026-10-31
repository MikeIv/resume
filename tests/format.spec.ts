import { describe, expect, it } from 'vitest'
import {
  formatMonth,
  formatPeriod,
  formatSalary,
  formatWorkFormats,
  telHref,
  telegramHref,
} from '../shared/utils/resume'

describe('форматирование', () => {
  it('переводит месяц в русскую подпись', () => {
    expect(formatMonth('2025-09')).toBe('сен 2025')
    expect(formatMonth('2023-01')).toBe('янв 2023')
  })

  it('собирает период, включая текущее место', () => {
    expect(formatPeriod('2025-09', null)).toBe('сен 2025 — н. в.')
    expect(formatPeriod('2021-10', '2023-03')).toBe('окт 2021 — мар 2023')
  })

  it('падает на некорректном месяце', () => {
    expect(() => formatMonth('2025-13')).toThrow()
  })

  it('форматирует зарплату с разрядами и валютой', () => {
    const formatted = formatSalary({
      amount: 225000,
      currency: 'RUR',
      period: 'month',
      note: 'на руки',
    })

    expect(formatted).toMatch(/225[\s\u00A0]000/)
    expect(formatted).toContain('₽')
    expect(formatted).toContain('на руки')
  })

  it('перечисляет форматы работы', () => {
    expect(formatWorkFormats(['remote', 'hybrid'])).toBe('удалённо, гибрид')
  })

  it('собирает ссылки на телефон и телеграм', () => {
    expect(telHref('+7 985 583-89-58')).toBe('tel:+79855838958')
    expect(telegramHref('@Mike_Iv')).toBe('https://t.me/Mike_Iv')
  })
})
