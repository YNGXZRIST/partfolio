import type { AppDef, AppId } from './types'

export const apps: AppDef[] = [
  { id: 'finder', title: 'Проекты', icon: 'finder.svg', defaultSize: { w: 820, h: 520 } },
  { id: 'about', title: 'Об этом разработчике', icon: 'about.svg', defaultSize: { w: 640, h: 600 } },
  { id: 'settings', title: 'Стек', icon: 'gear.png', defaultSize: { w: 760, h: 540 } },
  { id: 'calendar', title: 'Опыт', icon: 'exp.png', defaultSize: { w: 940, h: 600 } },
  { id: 'contacts', title: 'Контакты', icon: 'vcard.png', defaultSize: { w: 560, h: 480 } },
]

export const appById = (id: AppId): AppDef => apps.find(a => a.id === id)!
