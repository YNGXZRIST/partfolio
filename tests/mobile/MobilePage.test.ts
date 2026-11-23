import { afterEach, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '@/App.vue'
import MobilePage from '@/mobile/MobilePage.vue'
import { projects } from '@/content/projects'
import { jobs } from '@/content/experience'

function mockMatch(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((q: string) => ({
    matches, media: q, addEventListener: () => {}, removeEventListener: () => {},
  })) as unknown as typeof window.matchMedia
}
afterEach(() => { delete (window as { matchMedia?: unknown }).matchMedia })

it('узкий экран — мобильная страница вместо рабочего стола', () => {
  mockMatch(true)
  const c = mount(App)
  expect(c.findComponent(MobilePage).exists()).toBe(true)
  expect(c.find('.desktop').exists()).toBe(false)
})

it('широкий экран — рабочий стол', () => {
  mockMatch(false)
  const c = mount(App)
  expect(c.find('.desktop').exists()).toBe(true)
})

const tap = async (c: ReturnType<typeof mount>, sel: string) => { await c.find(sel).trigger('click'); await c.vm.$nextTick() }

it('домашний экран iPhone: виджет, иконки приложений и проектов, Dock', () => {
  const c = mount(MobilePage)
  const w = c.find('[data-test="ios-widget"]').text()
  ;['Василий Кулагин', 'Backend-разработчик · Go', 'highload · распределённые системы · AI', '5+ лет · Go · PHP · Vue', 'Открыт к предложениям'].forEach(t => expect(w).toContain(t))
  const labels = c.findAll('[data-test="ios-icon"]').map(i => i.find('.lbl, .sr').text())
  ;['Проекты', 'Обо мне', 'Стек', 'Опыт', 'Контакты', ...projects.map(p => p.name)].forEach(l => expect(labels).toContain(l))
  expect(c.findAll('[data-test="ios-dock"] a, [data-test="ios-dock"] button').length).toBe(4)
  expect(c.html()).not.toContain('hh.ru')
})

it('Проекты → список → страница проекта → назад → домой', async () => {
  const c = mount(MobilePage)
  await tap(c, '[data-app="projects"]')
  expect(c.find('[data-test="ios-app"] h1').text()).toBe('Проекты')
  const rows = c.findAll('[data-test="m-project"]')
  expect(rows).toHaveLength(projects.length)
  await rows[1].trigger('click'); await c.vm.$nextTick()
  expect(c.find('[data-test="ios-app"] h1').text()).toBe(projects[1].name)
  expect(c.find('a.ios-pill').attributes('href')).toBe(projects[1].github)
  expect(c.find('.dscroll svg').exists()).toBe(true)
  await tap(c, '[data-test="ios-back"]')
  expect(c.find('[data-test="ios-app"] h1').text()).toBe('Проекты')
  await tap(c, '[data-test="ios-back"]')
  expect(c.find('[data-test="ios-app"]').exists()).toBe(false)
})

it('иконка проекта открывает сразу его страницу; опыт и стек полные', async () => {
  const c = mount(MobilePage)
  await tap(c, `[data-app="project:${projects[0].slug}"]`)
  expect(c.find('[data-test="ios-app"] h1').text()).toBe(projects[0].name)
  await tap(c, '[data-test="ios-home"]')
  await tap(c, '[data-app="exp"]')
  expect(c.findAll('[data-test="m-job"]')).toHaveLength(jobs.length)
  await tap(c, '[data-test="ios-home"]')
  await tap(c, '[data-app="stack"]')
  expect(c.text()).toContain('Kubernetes')
})
