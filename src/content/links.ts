import type { Link } from './types'

export const links: Link[] = [
  { id: 'github', label: 'GitHub', value: 'YNGXZRIST', href: 'https://github.com/YNGXZRIST', icon: 'github.png', enabled: true },
  { id: 'telegram', label: 'Telegram', value: '@xzrist', href: 'https://t.me/xzrist', icon: 'telegram.png', enabled: true },
  { id: 'email', label: 'Почта', value: 'vascool66@icloud.com', href: 'mailto:vascool66@icloud.com', icon: 'email.png', enabled: true },
  // Резюме временно скрыто по решению владельца — вернуть: enabled: true
  { id: 'hh', label: 'Резюме', value: 'hh.ru', href: 'https://hh.ru/resume/8091e8ecff09eef9150039ed1f69554c743242', icon: 'hh.png', enabled: false },
]

export const enabledLinks = links.filter(l => l.enabled)
