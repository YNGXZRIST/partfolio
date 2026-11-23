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

it('при загрузке открывается «Обо мне»', () => {
  mount(Desktop)
  const w = useWindows()
  expect(w.activeId.value).toBe('about')
})

it('пуш — уведомление: шапка «Портфолио», клик открывает «Обо мне»', async () => {
  const c = mount(Desktop)
  const w = useWindows()
  w.close('about')
  const n = c.find('[data-test="widget"]')
  expect(n.find('.n-app').text()).toContain('ПОРТФОЛИО')
  await n.trigger('click')
  expect(w.windows.value.has('about')).toBe(true)
})
