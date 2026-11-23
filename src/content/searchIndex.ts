import type { SearchItem } from '@/lib/search'
import { apps } from './apps'
import { projects } from './projects'
import { stack } from './stack'
import { jobs } from './experience'

/** Русские написания технологий, которые HR может вбить в поиск. */
const synonyms: Record<string, string[]> = {
  Go: ['го', 'голанг', 'golang'],
  'PHP 7/8': ['пхп', 'php'],
  'Vue.js': ['вью', 'vue'],
  PostgreSQL: ['постгрес', 'postgres', 'pg'],
  RabbitMQ: ['кролик', 'очереди'],
  Docker: ['докер'],
  Redis: ['редис'],
  gRPC: ['грпц'],
  'LLM-интеграции': ['ии', 'нейросети', 'llm', 'ai'],
}

export const searchIndex: SearchItem[] = [
  ...apps.map(a => ({ id: `app:${a.id}`, title: a.title, subtitle: 'Раздел', icon: a.icon, keywords: [a.id], target: a.id, group: 'Разделы' })),
  ...projects.map(p => ({
    id: `project:${p.slug}`, title: p.name, subtitle: p.plain, icon: p.icon,
    keywords: [...p.stack, ...p.info.map(f => f.value), ...p.stack.flatMap(s => synonyms[s] ?? [])],
    target: `project:${p.slug}` as const, group: 'Проекты',
  })),
  ...stack.flatMap(c => c.items.map(it => ({
    id: `tech:${it.name}`, title: it.name, subtitle: c.title, icon: 'gear.png',
    keywords: [c.title, ...(synonyms[it.name] ?? [])], target: 'settings' as const, group: 'Технологии',
  }))),
  ...jobs.map(j => ({ id: `job:${j.company}`, title: j.company, subtitle: j.role, icon: 'calendar.svg', keywords: j.tags, target: 'calendar' as const, group: 'Опыт' })),
]
