import { it, expect } from 'vitest'
import { clampRect } from '@/lib/geometry'

const vp = { w: 1440, h: 900 }

it('окно за левым краем оставляет 120px заголовка', () => {
  const r = clampRect({ x: -2000, y: 100, w: 600, h: 400 }, vp)
  expect(r.x + r.w).toBe(120)
})
it('окно за правым краем оставляет 120px', () => {
  expect(clampRect({ x: 5000, y: 100, w: 600, h: 400 }, vp).x).toBe(1440 - 120)
})
it('нельзя залезть под меню-бар и уйти за низ', () => {
  expect(clampRect({ x: 100, y: 0, w: 600, h: 400 }, vp).y).toBe(28)
  expect(clampRect({ x: 100, y: 2000, w: 600, h: 400 }, vp).y).toBe(900 - 144)
})
it('минимальный размер 420×300', () => {
  expect(clampRect({ x: 100, y: 100, w: 100, h: 50 }, vp)).toMatchObject({ w: 420, h: 300 })
})
it('большое окно при маленьком вьюпорте ужимается', () => {
  const r = clampRect({ x: 500, y: 400, w: 1200, h: 900 }, { w: 800, h: 600 })
  expect(r.w).toBeLessThanOrEqual(800)
  expect(r.h).toBeLessThanOrEqual(600 - 28)
  expect(r.y).toBeGreaterThanOrEqual(28)
  expect(r.y).toBeLessThanOrEqual(600 - 144)
  expect(r.x).toBeLessThanOrEqual(800 - 120)
})

it('заголовок окна не может уйти под Dock', () => {
  const r = clampRect({ x: 500, y: 880, w: 560, h: 480 }, vp)
  expect(r.y + 52).toBeLessThanOrEqual(900 - 92)
})
