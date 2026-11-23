export type AppId = 'about' | 'finder' | 'settings' | 'calendar' | 'contacts'
export type WindowId = AppId | `project:${string}`

export interface Fact { label: string; value: string }

export interface Profile {
  name: string
  headline: string
  focus: string
  experience: string
  stackLine: string
  status: string
  avatar: string
  facts: Fact[]
  about: { title: string; text: string }[]
}

export interface Education { title: string; place: string; detail: string; year: string; kind: 'degree' | 'course' }

export interface Project {
  slug: string
  name: string
  icon: string
  /** суть простыми словами — для HR */
  plain: string
  /** «О проекте» — полное описание */
  description: string
  info: Fact[]
  features: string[]
  /** пояснение к схеме «Как устроено» */
  archNote: string
  details: string[]
  stack: string[]
  github: string
}

export interface StackCategory { id: string; title: string; color: string; glyph: string; items: { name: string; note?: string }[] }

export interface Job {
  company: string
  role: string
  location?: string
  start: string // YYYY-MM
  end: string | null
  summary: string
  points: string[]
  tags: string[]
}

export interface Link { id: 'github' | 'telegram' | 'email' | 'hh'; label: string; value: string; href: string; icon: string; enabled: boolean }

export interface AppDef { id: AppId; title: string; icon: string; defaultSize: { w: number; h: number } }
