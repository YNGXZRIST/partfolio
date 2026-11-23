import { beforeEach, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AboutDeveloper from '@/apps/AboutDeveloper.vue'
import Contacts from '@/apps/Contacts.vue'
import { profile, education } from '@/content/profile'
import { enabledLinks } from '@/content/links'
import { useWindows, resetWindows } from '@/stores/windows'

beforeEach(() => { resetWindows(); useWindows().open('about'); useWindows().open('contacts') })

it('About: имя, позиция, факты, образование, тексты', () => {
  const c = mount(AboutDeveloper, { props: { id: 'about' } })
  const t = c.text()
  expect(t).toContain(profile.name)
  expect(t).toContain(profile.headline)
  profile.facts.forEach(f => { expect(t).toContain(f.label); expect(t).toContain(f.value) })
  education.forEach(e => expect(t).toContain(e.title))
  profile.about.forEach(a => expect(t).toContain(a.title))
})

it('Contacts: только включённые ссылки', () => {
  const c = mount(Contacts, { props: { id: 'contacts' } })
  const hrefs = c.findAll('a').map(a => a.attributes('href'))
  enabledLinks.forEach(l => expect(hrefs).toContain(l.href))
  expect(c.html()).not.toContain('hh.ru')
})
