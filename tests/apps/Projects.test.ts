import { beforeEach, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Finder from '@/apps/Finder.vue'
import ProjectPage from '@/apps/ProjectPage.vue'
import { projects } from '@/content/projects'
import { useWindows, resetWindows } from '@/stores/windows'

beforeEach(() => { resetWindows(); useWindows().open('finder') })

it('Finder: сайдбар разделов и 4 папки', async () => {
  const c = mount(Finder, { props: { id: 'finder' } })
  expect(c.findAll('[data-test="side"]').map(s => s.text())).toEqual(['Проекты', 'Обо мне', 'Стек', 'Опыт', 'Контакты'])
  await c.findAll('[data-test="side"]')[2].trigger('click')
  expect(useWindows().windows.value.has('settings')).toBe(true)
  const folders = c.findAll('[data-test="folder"]')
  expect(folders.map(f => f.text())).toEqual(projects.map(p => p.name))
  await folders[1].trigger('dblclick')
  expect(useWindows().windows.value.has('project:gophkeeper')).toBe(true)
})

it('ProjectPage: блоки в порядке App Store, детали свёрнуты', async () => {
  const p = projects[0]
  useWindows().open(`project:${p.slug}`)
  const c = mount(ProjectPage, { props: { id: `project:${p.slug}` } })
  const order = c.findAll('[data-block]').map(b => b.attributes('data-block'))
  expect(order).toEqual(['header', 'info', 'features', 'arch', 'details'])
  expect(c.find('[data-block="header"]').text()).toContain(p.plain)
  expect(c.find('a.mac-pill').attributes('href')).toBe(p.github)
  expect(c.find('[data-block="arch"] svg').exists()).toBe(true)
  expect(c.text()).not.toContain(p.details[p.details.length - 1])
  await c.find('[data-test="more"]').trigger('click')
  p.details.forEach(d => expect(c.text()).toContain(d))
})

it('в Finder у проектов их иконки, а не папки', () => {
  const c = mount(Finder, { props: { id: 'finder' } })
  const srcs = c.findAll('[data-test="folder"] img').map(i => i.attributes('src'))
  expect(srcs.some(s => s?.includes('folder-sys'))).toBe(false)
  projects.forEach(p => expect(srcs.some(s => s?.includes(p.icon))).toBe(true))
})
