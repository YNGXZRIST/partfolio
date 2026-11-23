import { it, expect } from 'vitest'
import { animateRestore } from '@/lib/motion'

it('restore при reduced motion не стирает позицию окна', async () => {
  const el = document.createElement('section')
  el.style.left = '120px'; el.style.top = '60px'; el.style.width = '640px'; el.style.zIndex = '101'
  el.style.transform = 'translateY(10px)'
  await animateRestore(el, new DOMRect(0, 0, 50, 50))
  expect([el.style.left, el.style.top, el.style.width, el.style.zIndex]).toEqual(['120px', '60px', '640px', '101'])
  expect(el.style.transform).toBe('')
})
