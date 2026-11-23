import { ref } from 'vue'

export type Theme = 'dark' | 'light'
export type Mode = 'system' | Theme
const KEY = 'theme'
const QUERY = '(prefers-color-scheme: dark)'
const mode = ref<Mode>('system')
const theme = ref<Theme>('dark')
let watching = false

function systemTheme(): Theme {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return 'dark'
  return window.matchMedia(QUERY).matches ? 'dark' : 'light'
}

function apply() {
  theme.value = mode.value === 'system' ? systemTheme() : mode.value
  document.documentElement.dataset.theme = theme.value
}

/** По умолчанию тема как в системе; ручной выбор (светлая/тёмная) сохраняется в localStorage. */
export function initTheme() {
  let saved: string | null = null
  try { saved = localStorage.getItem(KEY) } catch { /* приватный режим */ }
  mode.value = saved === 'light' || saved === 'dark' ? saved : 'system'
  apply()
  if (!watching && typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    watching = true
    window.matchMedia(QUERY).addEventListener?.('change', () => { if (mode.value === 'system') apply() })
  }
}

function setMode(m: Mode) {
  mode.value = m
  try { if (m === 'system') localStorage.removeItem(KEY); else localStorage.setItem(KEY, m) } catch { /* не критично */ }
  apply()
}

export function useTheme() {
  return { theme, mode, setMode }
}
