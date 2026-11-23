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

it('порядок секций и содержимое', () => {
  const c = mount(MobilePage)
  expect(c.findAll('[data-section]').map(s => s.attributes('data-section'))).toEqual(['hero', 'projects', 'exp', 'stack', 'contacts'])
  const hero = c.find('[data-section="hero"]').text()
  ;['Василий Кулагин', 'Backend-разработчик · Go', 'highload · распределённые системы · AI', '5+ лет · Go · PHP · Vue', 'Открыт к предложениям'].forEach(t => expect(hero).toContain(t))
  expect(c.findAll('[data-test="m-project"]')).toHaveLength(projects.length)
  expect(c.findAll('[data-test="m-job"]')).toHaveLength(jobs.length)
  expect(c.html()).not.toContain('hh.ru')
  expect(c.find('.dscroll').exists()).toBe(true)
})
