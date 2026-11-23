import { beforeEach, it, expect } from 'vitest'
import { useWindows, resetWindows } from '@/stores/windows'

beforeEach(() => resetWindows())

it('activate на закрытом открывает', () => {
  const w = useWindows()
  w.activate('about')
  expect(w.windows.value.get('about')?.status).toBe('open')
  expect(w.activeId.value).toBe('about')
})

it('activate на свёрнутом разворачивает и поднимает наверх', () => {
  const w = useWindows()
  w.open('about'); w.open('finder'); w.minimize('about')
  w.activate('about')
  expect(w.windows.value.get('about')?.status).toBe('open')
  expect(w.order.value.at(-1)).toBe('about')
})

it('activate на открытом только поднимает наверх', () => {
  const w = useWindows()
  w.open('about'); w.open('finder')
  const rect = { ...w.windows.value.get('about')!.rect }
  w.activate('about')
  expect(w.order.value).toEqual(['finder', 'about'])
  expect(w.windows.value.get('about')!.rect).toEqual(rect)
})

it('повторный open не создаёт второе окно', () => {
  const w = useWindows()
  w.open('project:gophprofile'); w.open('project:gophprofile')
  expect(w.windows.value.size).toBe(1)
  expect(w.windows.value.get('project:gophprofile')!.rect).toMatchObject({ w: 760, h: 620 })
})

it('minimize активного делает активным предыдущее открытое', () => {
  const w = useWindows()
  w.open('about'); w.open('finder'); w.open('contacts')
  w.minimize('finder')
  w.minimize('contacts')
  expect(w.activeId.value).toBe('about')
})

it('close удаляет окно', () => {
  const w = useWindows()
  w.open('about'); w.close('about')
  expect(w.windows.value.has('about')).toBe(false)
  expect(w.order.value).toEqual([])
  expect(w.activeId.value).toBeNull()
})

it('toggleZoom дважды возвращает исходный rect', () => {
  const w = useWindows()
  w.open('about')
  const before = { ...w.windows.value.get('about')!.rect }
  w.toggleZoom('about', { w: 1440, h: 900 })
  expect(w.windows.value.get('about')!.zoomed).toBe(true)
  w.toggleZoom('about', { w: 1440, h: 900 })
  expect(w.windows.value.get('about')!.rect).toEqual(before)
})

it('новые окна открываются по центру каскадом', () => {
  const w = useWindows()
  w.open('about'); w.open('finder')
  const a = w.windows.value.get('about')!.rect, f = w.windows.value.get('finder')!.rect
  expect([a.x, a.y]).toEqual([Math.round((window.innerWidth - a.w) / 2), 60])
  expect([f.x - Math.round((window.innerWidth - f.w) / 2), f.y]).toEqual([28, 88])
})

it('activate запоминает точку раскрытия только для нового окна', () => {
  const w = useWindows()
  const r = { left: 10, top: 10, width: 50, height: 50 } as DOMRect
  w.activate('about', r)
  expect(w.takeOrigin('about')).toBe(r)
  expect(w.takeOrigin('about')).toBeUndefined()
  w.activate('about', r)
  expect(w.takeOrigin('about')).toBeUndefined()
})
