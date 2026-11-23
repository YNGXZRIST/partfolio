import { beforeEach, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Settings from '@/apps/Settings.vue'
import CalendarApp from '@/apps/CalendarApp.vue'
import { stack } from '@/content/stack'
import { jobs } from '@/content/experience'
import { useWindows, resetWindows } from '@/stores/windows'

beforeEach(() => { resetWindows(); useWindows().open('settings'); useWindows().open('calendar') })

it('Settings: категории в сайдбаре, переключение панели', async () => {
  const c = mount(Settings, { props: { id: 'settings' } })
  const cats = c.findAll('[data-test="cat"]')
  expect(cats.map(x => x.text())).toEqual(stack.map(s => s.title))
  expect(c.find('[data-test="pane"]').text()).toContain(stack[0].items[0].name)
  await cats[2].trigger('click')
  stack[2].items.forEach(i => expect(c.find('[data-test="pane"]').text()).toContain(i.name))
})

it('Calendar: события по работам, «по наст. время», подробности по клику', async () => {
  const c = mount(CalendarApp, { props: { id: 'calendar' } })
  const ev = c.findAll('[data-test="event"]')
  expect(ev).toHaveLength(jobs.length)
  expect(c.text()).toContain('по наст. время')
  await ev[1].trigger('click')
  const ins = c.find('[data-test="inspector"]').text()
  expect(ins).toContain(jobs[1].role)
  jobs[1].points.forEach(p => expect(ins).toContain(p))
})
