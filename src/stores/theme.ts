import { ref } from 'vue'

export type Theme = 'dark' | 'light'
const KEY = 'theme'
const theme = ref<Theme>('dark')

function apply(t: Theme) {
  theme.value = t
  document.documentElement.dataset.theme = t
}

/** Читает сохранённую тему (по умолчанию тёмная) и применяет к <html>. */
export function initTheme() {
  let saved: string | null = null
  try { saved = localStorage.getItem(KEY) } catch { /* приватный режим */ }
  apply(saved === 'light' ? 'light' : 'dark')
}

function setTheme(t: Theme) {
  apply(t)
  try { localStorage.setItem(KEY, t) } catch { /* не критично */ }
}

export function useTheme() {
  return { theme, setTheme }
}
