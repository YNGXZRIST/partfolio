import { it, expect } from 'vitest'
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const root = join(__dirname, '..')
const dist = join(root, 'dist')
const walk = (d: string): string[] => readdirSync(d).flatMap(f => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p] })

it('ресурсы в index.html идут от /partfolio/', () => {
  const html = readFileSync(join(dist, 'index.html'), 'utf8')
  const refs = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(m => m[1]).filter(u => !u.startsWith('http'))
  expect(refs.length).toBeGreaterThan(0)
  refs.forEach(u => expect(u.startsWith('/partfolio/')).toBe(true))
})

it('каждый asset() из исходников существует в public/assets', () => {
  const src = walk(join(root, 'src')).filter(f => /\.(ts|vue)$/.test(f)).map(f => readFileSync(f, 'utf8')).join('\n')
  const names = new Set<string>()
  for (const m of src.matchAll(/(?:asset\(|icon: |avatar: )'([\w.-]+\.(?:png|svg))'/g)) names.add(m[1])
  expect(names.size).toBeGreaterThan(10)
  names.forEach(n => expect(existsSync(join(root, 'public/assets', n)), n).toBe(true))
})

it('в HTML сборки нет hh.ru и временных страниц', () => {
  const files = walk(dist)
  // ссылка на hh лежит в данных выключенной (enabled: false) — в разметку она не попадает
  files.filter(f => f.endsWith('.html')).forEach(f => expect(readFileSync(f, 'utf8')).not.toContain('hh.ru'))
  expect(files.some(f => f.endsWith('fonts-preview.html'))).toBe(false)
})
