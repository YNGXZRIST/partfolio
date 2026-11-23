import { it, expect } from 'vitest'
import { formatMenuClock } from '@/lib/date'

it('формат как в меню-баре macOS', () => {
  expect(formatMenuClock(new Date(2026, 10, 23, 9, 41))).toBe('Пн 23 нояб. 09:41')
  expect(formatMenuClock(new Date(2026, 4, 3, 18, 5))).toBe('Вс 3 мая 18:05')
})
