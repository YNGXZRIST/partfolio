import type { WindowId } from '@/content/types'

export interface SearchItem { id: string; title: string; subtitle: string; icon: string; keywords: string[]; target: WindowId; group: string }

const MAX = 8

/** Поиск Spotlight: без учёта регистра; префикс заголовка > подстрока заголовка > ключевое слово. */
export function search(q: string, index: SearchItem[]): SearchItem[] {
  const needle = q.trim().toLowerCase()
  if (!needle) return []
  const scored: { item: SearchItem; score: number; i: number }[] = []
  index.forEach((item, i) => {
    const title = item.title.toLowerCase()
    let score = 0
    if (title.startsWith(needle)) score = 3
    else if (title.includes(needle)) score = 2
    else if (item.keywords.some(k => k.toLowerCase().includes(needle))) score = 1
    if (score) scored.push({ item, score, i })
  })
  return scored.sort((a, b) => b.score - a.score || a.i - b.i).slice(0, MAX).map(s => s.item)
}
