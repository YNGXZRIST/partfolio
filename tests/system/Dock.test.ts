import { beforeEach, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Dock from '@/system/Dock.vue'
import { useWindows, resetWindows } from '@/stores/windows'

beforeEach(() => resetWindows())

it('порядок: приложения, разделитель, ссылки без hh', () => {
  const c = mount(Dock)
  expect(c.findAll('[data-dock-id]').map(e => e.attributes('data-dock-id'))).toEqual(['finder', 'about', 'settings', 'calendar', 'contacts'])
  expect(c.find('.dock-sep').exists()).toBe(true)
  const hrefs = c.findAll('a.dock-item').map(a => a.attributes('href'))
  expect(hrefs).toEqual(['https://github.com/YNGXZRIST', 'https://t.me/xzrist', 'mailto:vascool66@icloud.com'])
  expect(c.html()).not.toContain('hh.ru')
})

it('клик по приложению вызывает activate', async () => {
  const c = mount(Dock)
  await c.find('[data-dock-id="about"]').trigger('click')
  expect(useWindows().windows.value.has('about')).toBe(true)
})

it('точка под открытым приложением; проект — под Finder', async () => {
  const w = useWindows()
  const c = mount(Dock)
  w.open('project:gophkeeper'); w.open('contacts'); await nextTick()
  expect(c.find('[data-dock-id="finder"] .dock-dot').exists()).toBe(true)
  expect(c.find('[data-dock-id="contacts"] .dock-dot').exists()).toBe(true)
  expect(c.find('[data-dock-id="about"] .dock-dot').exists()).toBe(false)
})

it('внешние ссылки открываются в новой вкладке', () => {
  const c = mount(Dock)
  const gh = c.findAll('a.dock-item')[0]
  expect(gh.attributes('target')).toBe('_blank')
  expect(gh.attributes('rel')).toBe('noopener')
})
