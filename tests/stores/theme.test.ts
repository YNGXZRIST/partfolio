import { afterEach, beforeEach, it, expect, vi } from 'vitest'
import { useTheme, initTheme } from '@/stores/theme'

function mockSystem(dark: boolean) {
  window.matchMedia = vi.fn().mockImplementation((q: string) => ({
    matches: q.includes('dark') ? dark : !dark, media: q, addEventListener: () => {}, removeEventListener: () => {},
  })) as unknown as typeof window.matchMedia
}
beforeEach(() => { localStorage.clear(); delete document.documentElement.dataset.theme })
afterEach(() => { delete (window as { matchMedia?: unknown }).matchMedia })

it('по умолчанию — как в системе (светлая)', () => {
  mockSystem(false)
  initTheme()
  expect(useTheme().mode.value).toBe('system')
  expect(document.documentElement.dataset.theme).toBe('light')
})

it('по умолчанию — как в системе (тёмная)', () => {
  mockSystem(true)
  initTheme()
  expect(useTheme().theme.value).toBe('dark')
})

it('выбор вручную сохраняется, «Авто» возвращает системную', () => {
  mockSystem(true)
  initTheme()
  useTheme().setMode('light')
  expect(document.documentElement.dataset.theme).toBe('light')
  expect(localStorage.getItem('theme')).toBe('light')
  initTheme()
  expect(useTheme().mode.value).toBe('light')
  useTheme().setMode('system')
  expect(localStorage.getItem('theme')).toBeNull()
  expect(useTheme().theme.value).toBe('dark')
})
