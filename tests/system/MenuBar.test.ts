import { beforeEach, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MenuBar from '@/system/MenuBar.vue'
import { useWindows, resetWindows } from '@/stores/windows'

beforeEach(() => resetWindows())
const mk = () => mount(MenuBar, { attachTo: document.body })

it('пункты слева по порядку', () => {
  const c = mk()
  expect(c.findAll('[data-menu]').map(m => m.text())).toEqual(['', 'Василий Кулагин', 'Проекты', 'Опыт', 'Стек', 'Контакты'])
  c.unmount()
})

it('«Проекты» показывает 4 проекта и открывает выбранный', async () => {
  const c = mk()
  await c.find('[data-menu="projects"]').trigger('click')
  const items = c.findAll('[data-test="menu-item"]')
  expect(items).toHaveLength(4)
  await items[0].trigger('click')
  expect(useWindows().windows.value.has('project:gophprofile')).toBe(true)
  expect(c.find('[data-test="dropdown"]').exists()).toBe(false)
  c.unmount()
})

it('«Опыт», «Стек», «Контакты», «Обо мне»', async () => {
  const c = mk()
  await c.find('[data-menu="exp"]').trigger('click')
  expect(c.findAll('[data-test="menu-item"]').map(i => i.text())).toEqual(['R-брокер', 'TonyLead Company', 'ООО «Лемборган Техно»'])
  await c.findAll('[data-test="menu-item"]')[1].trigger('click')
  expect(useWindows().windows.value.has('calendar')).toBe(true)

  await c.find('[data-menu="stack"]').trigger('click')
  await c.findAll('[data-test="menu-item"]')[0].trigger('click')
  expect(useWindows().windows.value.has('settings')).toBe(true)

  await c.find('[data-menu="contacts"]').trigger('click')
  const hrefs = c.findAll('a[data-test="menu-item"]').map(a => a.attributes('href'))
  expect(hrefs).toContain('https://t.me/xzrist')
  expect(c.html()).not.toContain('hh.ru')

  await c.find('[data-menu="apple"]').trigger('click')
  const about = c.findAll('[data-test="menu-item"]').find(i => i.text() === 'Обо мне')!
  await about.trigger('click')
  expect(useWindows().windows.value.has('about')).toBe(true)
  c.unmount()
})

it('Esc и клик мимо закрывают меню', async () => {
  const c = mk()
  await c.find('[data-menu="projects"]').trigger('click')
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
  await c.vm.$nextTick()
  expect(c.find('[data-test="dropdown"]').exists()).toBe(false)
  await c.find('[data-menu="projects"]').trigger('click')
  document.body.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))
  await c.vm.$nextTick()
  expect(c.find('[data-test="dropdown"]').exists()).toBe(false)
  c.unmount()
})

it('при открытом меню наведение переключает его', async () => {
  const c = mk()
  await c.find('[data-menu="projects"]').trigger('click')
  await c.find('[data-menu="exp"]').trigger('mouseenter')
  expect(c.findAll('[data-test="menu-item"]')[0].text()).toBe('R-брокер')
  c.unmount()
})

it('лупа открывает Spotlight', async () => {
  const c = mk()
  await c.find('[data-test="spotlight-btn"]').trigger('click')
  expect(c.emitted('open-spotlight')).toHaveLength(1)
  c.unmount()
})

it('Пункт управления переключает тему', async () => {
  const { initTheme, useTheme } = await import('@/stores/theme')
  localStorage.clear(); initTheme()
  const c = mk()
  await c.find('[data-test="cc-btn"]').trigger('click')
  await c.find('[data-theme-option="light"]').trigger('click')
  expect(useTheme().theme.value).toBe('light')
  expect(document.documentElement.dataset.theme).toBe('light')
  c.unmount()
})
