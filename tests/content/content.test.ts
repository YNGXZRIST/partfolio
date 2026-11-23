import { it, expect } from 'vitest'
import { profile, education } from '@/content/profile'
import { projects } from '@/content/projects'
import { stack } from '@/content/stack'
import { jobs } from '@/content/experience'
import { links, enabledLinks } from '@/content/links'
import { apps } from '@/content/apps'

it('позиционирование по спеке', () => {
  expect(profile.name).toBe('Василий Кулагин')
  expect(profile.headline).toBe('Backend-разработчик · Go')
  expect(profile.focus).toBe('highload · распределённые системы · AI')
  expect([profile.experience, profile.stackLine]).toEqual(['5+ лет', 'Go · PHP · Vue'])
  expect(profile.status).toBe('Открыт к предложениям')
})

it('hh выключен', () => {
  expect(links.find(l => l.id === 'hh')?.enabled).toBe(false)
  expect(enabledLinks.map(l => l.id)).toEqual(['github', 'telegram', 'email'])
})

it('нет пустых полей и запрещённых данных', () => {
  const json = JSON.stringify({ profile, education, projects, stack, jobs, links })
  expect(json).not.toMatch(/""/)
  expect(json).not.toMatch(/\+7|телефон|зарплат|родил/i)
  expect(json).not.toMatch(/Fullstack-разработчик/)
})

it('проекты в нужном порядке', () => {
  expect(projects.map(p => p.slug)).toEqual(['gophprofile', 'gophkeeper', 'sys-metrics', 'gophermart-loyalty'])
  projects.forEach(p => {
    expect(p.github).toMatch(/^https:\/\/github\.com\/YNGXZRIST\//)
    expect(p.features.length).toBeGreaterThanOrEqual(3)
    expect(p.info).toHaveLength(4)
  })
})

it('опыт и приложения', () => {
  expect(jobs.map(j => j.company)).toEqual(['R-брокер', 'TonyLead Company', 'ООО «Лемборган Техно»'])
  jobs.forEach(j => expect(j.start).toMatch(/^\d{4}-\d{2}$/))
  expect(apps.map(a => a.id)).toEqual(['finder', 'about', 'settings', 'calendar', 'contacts'])
  expect(stack[0].items[0].name).toBe('Go')
})
