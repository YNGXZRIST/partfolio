import { beforeEach, it, expect } from 'vitest'
import { useTheme, initTheme } from '@/stores/theme'

beforeEach(() => { localStorage.clear(); delete document.documentElement.dataset.theme })

it('по умолчанию тёмная', () => {
  initTheme()
  expect(useTheme().theme.value).toBe('dark')
  expect(document.documentElement.dataset.theme).toBe('dark')
})

it('переключение сохраняется', () => {
  initTheme()
  useTheme().setTheme('light')
  expect(document.documentElement.dataset.theme).toBe('light')
  expect(localStorage.getItem('theme')).toBe('light')
  initTheme()
  expect(useTheme().theme.value).toBe('light')
})
