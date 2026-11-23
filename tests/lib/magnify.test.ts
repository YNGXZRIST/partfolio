import { it, expect } from 'vitest'
import { dockScale } from '@/lib/magnify'

it('максимум под курсором, 1 за радиусом', () => {
  expect(dockScale(0)).toBe(1.7)
  expect(dockScale(140)).toBe(1)
  expect(dockScale(500)).toBe(1)
  expect(dockScale(70)).toBeCloseTo(1.35, 5)
})
it('монотонно убывает', () => {
  for (let d = 0; d < 140; d += 10) expect(dockScale(d)).toBeGreaterThanOrEqual(dockScale(d + 10))
})
