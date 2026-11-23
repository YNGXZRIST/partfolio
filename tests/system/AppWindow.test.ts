import { beforeEach, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import AppWindow from '@/system/AppWindow.vue'
import { useWindows, resetWindows } from '@/stores/windows'

beforeEach(() => resetWindows())

function mountWin(id: 'about' | 'finder' = 'about') {
  return mount(AppWindow, { props: { id, title: 'Тест' }, slots: { default: '<p>тело</p>' }, attachTo: document.body })
}

it('красная кнопка закрывает окно', async () => {
  const w = useWindows(); w.open('about')
  const c = mountWin()
  await c.find('[data-test="close"]').trigger('click')
  expect(w.windows.value.has('about')).toBe(false)
})

it('mousedown поднимает окно наверх', async () => {
  const w = useWindows(); w.open('about'); w.open('finder')
  const c = mountWin('about')
  await c.trigger('pointerdown')
  expect(w.order.value.at(-1)).toBe('about')
})

it('неактивное окно помечено is-inactive', async () => {
  const w = useWindows(); w.open('about'); w.open('finder')
  const c = mountWin('about')
  expect(c.classes()).toContain('is-inactive')
  w.focus('about'); await nextTick()
  expect(c.classes()).not.toContain('is-inactive')
})

it('двойной клик по заголовку разворачивает', async () => {
  const w = useWindows(); w.open('about')
  const c = mountWin()
  await c.find('[data-test="titlebar"]').trigger('dblclick')
  expect(w.windows.value.get('about')!.zoomed).toBe(true)
})

it('resize браузера пере-клампит окно', async () => {
  const w = useWindows(); w.open('about')
  w.setRect('about', { x: 1300, y: 700, w: 640, h: 600 })
  mountWin()
  Object.defineProperty(window, 'innerWidth', { value: 800, configurable: true })
  Object.defineProperty(window, 'innerHeight', { value: 600, configurable: true })
  window.dispatchEvent(new Event('resize'))
  const r = w.windows.value.get('about')!.rect
  expect(r.x).toBeLessThanOrEqual(800 - 120)
  expect(r.y).toBeLessThanOrEqual(600 - 44)
})
