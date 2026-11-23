import { computed, ref } from 'vue'
import type { Rect } from '@/lib/geometry'
import type { AppId, WindowId } from '@/content/types'
import { appById } from '@/content/apps'

export interface WinState { id: WindowId; status: 'open' | 'minimized'; rect: Rect; zoomed: boolean; prevRect: Rect | null }

const PROJECT_SIZE = { w: 760, h: 620 }
const MENUBAR_H = 28
const DOCK_RESERVE = 92

const windows = ref(new Map<WindowId, WinState>())
const order = ref<WindowId[]>([])

const activeId = computed<WindowId | null>(() => {
  for (let i = order.value.length - 1; i >= 0; i--) {
    const id = order.value[i]
    if (windows.value.get(id)?.status === 'open') return id
  }
  return null
})

function sizeFor(id: WindowId) {
  return id.startsWith('project:') ? PROJECT_SIZE : appById(id as AppId).defaultSize
}

function raise(id: WindowId) {
  order.value = [...order.value.filter(x => x !== id), id]
}

function open(id: WindowId) {
  const existing = windows.value.get(id)
  if (existing) { existing.status = 'open'; raise(id); return }
  const n = windows.value.size
  const { w, h } = sizeFor(id)
  const vw = typeof window === 'undefined' ? 1440 : window.innerWidth
  const x = Math.max(16, Math.round((vw - w) / 2)) + 28 * n
  windows.value.set(id, { id, status: 'open', rect: { x, y: 60 + 28 * n, w, h }, zoomed: false, prevRect: null })
  raise(id)
}

function close(id: WindowId) {
  windows.value.delete(id)
  order.value = order.value.filter(x => x !== id)
}

function minimize(id: WindowId) {
  const s = windows.value.get(id)
  if (s) s.status = 'minimized'
}

function restore(id: WindowId) {
  const s = windows.value.get(id)
  if (!s) return
  s.status = 'open'
  raise(id)
}

function focus(id: WindowId) {
  if (windows.value.get(id)?.status === 'open' && order.value.at(-1) !== id) raise(id)
}

/** Поведение клика по иконке Dock/меню/Spotlight: закрыто → открыть, свёрнуто → развернуть, открыто → наверх. */
function activate(id: WindowId) {
  const s = windows.value.get(id)
  if (!s) open(id)
  else if (s.status === 'minimized') restore(id)
  else focus(id)
}

function toggleZoom(id: WindowId, viewport: { w: number; h: number }) {
  const s = windows.value.get(id)
  if (!s) return
  if (s.zoomed && s.prevRect) {
    s.rect = s.prevRect
    s.prevRect = null
    s.zoomed = false
  } else {
    s.prevRect = { ...s.rect }
    s.rect = { x: 0, y: MENUBAR_H, w: viewport.w, h: viewport.h - MENUBAR_H - DOCK_RESERVE }
    s.zoomed = true
  }
}

function setRect(id: WindowId, r: Rect) {
  const s = windows.value.get(id)
  if (s) s.rect = r
}

export function useWindows() {
  return { windows, order, activeId, open, close, minimize, restore, focus, activate, toggleZoom, setRect }
}

export function resetWindows() {
  windows.value = new Map()
  order.value = []
}
