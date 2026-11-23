import { beforeEach, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Desktop from '@/system/Desktop.vue'
import { useWindows, resetWindows } from '@/stores/windows'
import { projects } from '@/content/projects'

beforeEach(() => resetWindows())

it('на обоях ровно «welcome»', () => {
  const c = mount(Desktop)
  const w = c.find('[data-test="welcome"]')
  expect(w.attributes('aria-label')).toBe('welcome')
  w.findAll('.layer').forEach(l => expect(l.text()).toBe('welcome'))
})

it('виджет — 5 строк по спеке', () => {
  const c = mount(Desktop)
  const lines = c.findAll('[data-test="widget"] [data-line]').map(l => l.text())
  expect(lines).toEqual([
    'Василий Кулагин',
    'Backend-разработчик · Go',
    'highload · распределённые системы · AI',
    '5+ лет · Go · PHP · Vue',
    '● Открыт к предложениям',
  ])
})

it('на рабочем столе папки проектов, двойной клик открывает проект', async () => {
  const c = mount(Desktop)
  const icons = c.findAll('[data-test="desktop-icon"]')
  expect(icons.map(i => i.text())).toEqual(projects.map(p => p.name))
  await icons[0].trigger('dblclick')
  expect(useWindows().windows.value.has('project:gophprofile')).toBe(true)
})

it('при загрузке окна закрыты — виден welcome', () => {
  mount(Desktop)
  expect(useWindows().windows.value.size).toBe(0)
})

it('пуш — уведомление: шапка «Портфолио», клик открывает «Обо мне»', async () => {
  const c = mount(Desktop)
  const w = useWindows()
  const n = c.find('[data-test="widget"]')
  expect(n.find('.n-app').text()).toContain('ПОРТФОЛИО')
  await n.trigger('click')
  expect(w.windows.value.has('about')).toBe(true)
  await new Promise(r => setTimeout(r, 0))
  expect(c.find('[data-test="widget"]').exists()).toBe(false)
})

it('иконку можно перетащить, и при этом проект не открывается', async () => {
  localStorage.clear()
  const c = mount(Desktop, { attachTo: document.body })
  const icon = c.findAll('[data-test="desktop-icon"]')[0]
  const el = icon.element as HTMLElement
  const before = { left: el.style.left, top: el.style.top }
  await icon.trigger('pointerdown', { button: 0, clientX: 100, clientY: 100, pointerId: 1 })
  window.dispatchEvent(new PointerEvent('pointermove', { clientX: 40, clientY: 160, pointerId: 1 }))
  window.dispatchEvent(new PointerEvent('pointerup', { clientX: 40, clientY: 160, pointerId: 1 }))
  await c.vm.$nextTick()
  expect(parseFloat(el.style.left)).toBe(parseFloat(before.left) - 60)
  expect(parseFloat(el.style.top)).toBe(parseFloat(before.top) + 60)
  expect(useWindows().windows.value.size).toBe(0)
  expect(JSON.parse(localStorage.getItem('desktop-icons')!).gophprofile).toBeTruthy()
  c.unmount()
})
