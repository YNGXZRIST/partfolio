import { it, expect } from 'vitest'
import { search } from '@/lib/search'
import { searchIndex } from '@/content/searchIndex'

it('регистр и пробелы не важны', () => {
  const a = search('Go', searchIndex)
  expect(a.length).toBeGreaterThan(0)
  expect(search('go', searchIndex)).toEqual(a)
  expect(search(' GO ', searchIndex)).toEqual(a)
})
it('находит проект по технологии', () => {
  expect(search('rabbitmq', searchIndex).map(r => r.target)).toContain('project:gophprofile')
})
it('русский синоним', () => {
  expect(search('го', searchIndex).map(r => r.target)).toContain('settings')
})
it('пустой запрос — пусто, максимум 8', () => {
  expect(search('', searchIndex)).toEqual([])
  expect(search('   ', searchIndex)).toEqual([])
  expect(search('о', searchIndex).length).toBeLessThanOrEqual(8)
})
it('префикс заголовка выше подстроки', () => {
  const r = search('gophk', searchIndex)
  expect(r[0].target).toBe('project:gophkeeper')
})
it('Kubernetes, Helm, Grafana, Prometheus ищутся по оригинальным названиям', () => {
  expect(search('k8s', searchIndex).map(r => r.title)).toContain('Kubernetes')
  ;['helm', 'grafana', 'prometheus', 'kubernetes'].forEach(q => expect(search(q, searchIndex).length).toBeGreaterThan(0))
  expect(search('графана', searchIndex)).toEqual([])
})
