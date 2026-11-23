import { it, expect } from 'vitest'
import { asset } from '@/lib/asset'

it('строит путь от base', () => {
  expect(import.meta.env.BASE_URL).toBe('/partfolio/')
  expect(asset('github.png')).toBe('/partfolio/assets/github.png')
})
