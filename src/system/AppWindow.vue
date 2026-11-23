<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { WindowId } from '@/content/types'
import { useWindows } from '@/stores/windows'
import { clampRect, type Rect } from '@/lib/geometry'
import { animateMinimize, animateOpen, animateRestore, clearAnim } from '@/lib/motion'

const props = withDefaults(defineProps<{ id: WindowId; title: string; sidebar?: boolean; sidebarWidth?: number }>(), {
  sidebar: false,
  sidebarWidth: 220,
})

const wm = useWindows()
const el = ref<HTMLElement | null>(null)
const animating = ref(false)

const state = computed(() => wm.windows.value.get(props.id))
const rect = computed<Rect>(() => state.value?.rect ?? { x: 0, y: 0, w: 0, h: 0 })
const isActive = computed(() => wm.activeId.value === props.id)
const z = computed(() => 100 + wm.order.value.indexOf(props.id))
const hidden = computed(() => state.value?.status === 'minimized' && !animating.value)

const viewport = () => ({ w: window.innerWidth, h: window.innerHeight })
const dockId = () => (props.id.startsWith('project:') ? 'finder' : props.id)
const dockRect = (): DOMRect | null =>
  document.querySelector(`[data-dock-id="${dockId()}"]`)?.getBoundingClientRect() ?? null

function onClose() { wm.close(props.id) }

async function onMinimize() {
  const target = dockRect()
  if (el.value && target) {
    animating.value = true
    await animateMinimize(el.value, target)
  }
  wm.minimize(props.id)
  animating.value = false
  if (el.value) clearAnim(el.value)
}

function onZoom() { wm.toggleZoom(props.id, viewport()) }

watch(() => state.value?.status, async (now, before) => {
  if (before === 'minimized' && now === 'open' && el.value) {
    const from = dockRect()
    if (from) await animateRestore(el.value, from)
  }
})

type Dir = 'move' | 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'
let drag: { dir: Dir; sx: number; sy: number; start: Rect } | null = null

function startDrag(e: PointerEvent, dir: Dir) {
  if (e.button !== 0) return
  if (dir === 'move' && (e.target as HTMLElement).closest('button, a, input, [data-no-drag]')) return
  if (state.value?.zoomed && dir === 'move') return
  drag = { dir, sx: e.clientX, sy: e.clientY, start: { ...rect.value } }
  ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
  window.addEventListener('pointermove', onMove)
  window.addEventListener('pointerup', endDrag, { once: true })
  e.preventDefault()
}

function onMove(e: PointerEvent) {
  if (!drag) return
  const dx = e.clientX - drag.sx, dy = e.clientY - drag.sy
  const s = drag.start
  let { x, y, w, h } = s
  if (drag.dir === 'move') { x += dx; y += dy }
  else {
    if (drag.dir.includes('e')) w = s.w + dx
    if (drag.dir.includes('s')) h = s.h + dy
    if (drag.dir.includes('w')) { w = s.w - dx; x = s.x + dx }
    if (drag.dir.includes('n')) { h = s.h - dy; y = s.y + dy }
  }
  wm.setRect(props.id, clampRect({ x, y, w, h }, viewport()))
}

function endDrag() {
  drag = null
  window.removeEventListener('pointermove', onMove)
}

function onViewportResize() {
  if (state.value) wm.setRect(props.id, clampRect(rect.value, viewport()))
}

onMounted(() => {
  window.addEventListener('resize', onViewportResize)
  if (el.value) animateOpen(el.value)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', onViewportResize)
  window.removeEventListener('pointermove', onMove)
})

const edges: Dir[] = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw']
</script>

<template>
  <section
    v-show="!hidden"
    ref="el"
    class="win glass-window"
    :class="{ 'is-inactive': !isActive, 'is-zoomed': state?.zoomed, 'has-sidebar': sidebar }"
    :style="{ left: rect.x + 'px', top: rect.y + 'px', width: rect.w + 'px', height: rect.h + 'px', zIndex: z }"
    role="dialog"
    :aria-label="title"
    @pointerdown="wm.focus(id)"
  >
    <aside v-if="sidebar" class="win-sidebar" :style="{ width: sidebarWidth + 'px' }" @pointerdown="startDrag($event, 'move')">
      <div class="win-sidebar-top" />
      <div class="win-sidebar-body" data-no-drag><slot name="sidebar" /></div>
    </aside>

    <div class="win-main">
      <header class="win-titlebar" data-test="titlebar" @pointerdown="startDrag($event, 'move')" @dblclick="onZoom">
        <span class="win-title">{{ title }}</span>
        <div class="win-toolbar"><slot name="toolbar" /></div>
      </header>
      <div class="win-body"><slot /></div>
    </div>

    <div class="traffic" :class="{ 'over-sidebar': sidebar }">
      <button class="tl tl-close" data-test="close" aria-label="Закрыть" @click.stop="onClose">
        <svg viewBox="0 0 12 12"><path d="M3.5 3.5l5 5M8.5 3.5l-5 5" /></svg>
      </button>
      <button class="tl tl-min" data-test="minimize" aria-label="Свернуть" @click.stop="onMinimize">
        <svg viewBox="0 0 12 12"><path d="M3 6h6" /></svg>
      </button>
      <button class="tl tl-zoom" data-test="zoom" aria-label="Развернуть" @click.stop="onZoom">
        <svg viewBox="0 0 12 12"><path d="M3.6 8.4V4.6l3.8 3.8zM8.4 3.6v3.8L4.6 3.6z" class="fill" /></svg>
      </button>
    </div>

    <template v-if="!state?.zoomed">
      <div v-for="d in edges" :key="d" class="edge" :class="'edge-' + d" @pointerdown.stop="startDrag($event, d)" />
    </template>
  </section>
</template>

<style scoped>
.win {
  position: absolute;
  display: flex;
  border-radius: var(--radius-window);
  box-shadow: var(--shadow-window), inset 0 .5px 0 var(--glass-border);
  overflow: hidden;
  color: var(--text);
}
.win.is-zoomed { border-radius: 0; }
.win.is-inactive { box-shadow: var(--shadow-window-inactive), inset 0 .5px 0 var(--glass-border); }
.win.is-inactive .win-title { color: var(--text-3); }
.win-sidebar {
  flex: none; margin: 8px 0 8px 8px; border-radius: 12px;
  background: var(--glass-sidebar); box-shadow: inset 0 0 0 .5px var(--hairline);
  display: flex; flex-direction: column; overflow: hidden;
}
.win-sidebar-top { height: 44px; flex: none; }
.win-sidebar-body { flex: 1; overflow: auto; padding: 0 10px 10px; }
.win-main { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.win-titlebar { height: 52px; flex: none; display: flex; align-items: center; gap: 12px; padding: 0 16px 0 84px; user-select: none; }
.has-sidebar .win-titlebar { padding-left: 20px; }
.win-title { font-size: 15px; font-weight: 700; letter-spacing: -.01em; white-space: nowrap; }
.win-toolbar { margin-left: auto; display: flex; align-items: center; gap: 8px; }
.win-body { flex: 1; min-height: 0; overflow: auto; }
.traffic { position: absolute; top: 19px; left: 20px; display: flex; gap: 8px; z-index: 2; }
.traffic.over-sidebar { top: 27px; left: 26px; }
.tl { width: 13px; height: 13px; border-radius: 50%; border: 0; padding: 0; display: grid; place-items: center; cursor: default; box-shadow: inset 0 0 0 .5px rgba(0,0,0,.18); }
.tl svg { width: 9px; height: 9px; stroke: rgba(0,0,0,.6); stroke-width: 1.3; fill: none; opacity: 0; }
.tl svg .fill { fill: rgba(0,0,0,.6); stroke: none; }
.traffic:hover .tl svg { opacity: 1; }
.tl-close { background: var(--red); }
.tl-min { background: var(--yellow); }
.tl-zoom { background: var(--green); }
.is-inactive .traffic:not(:hover) .tl { background: var(--fill-2); box-shadow: inset 0 0 0 .5px var(--hairline); }
.edge { position: absolute; z-index: 3; }
.edge-n, .edge-s { left: 8px; right: 8px; height: 6px; cursor: ns-resize; }
.edge-n { top: -3px; } .edge-s { bottom: -3px; }
.edge-e, .edge-w { top: 8px; bottom: 8px; width: 6px; cursor: ew-resize; }
.edge-e { right: -3px; } .edge-w { left: -3px; }
.edge-ne, .edge-nw, .edge-se, .edge-sw { width: 14px; height: 14px; }
.edge-ne { top: -4px; right: -4px; cursor: nesw-resize; }
.edge-sw { bottom: -4px; left: -4px; cursor: nesw-resize; }
.edge-nw { top: -4px; left: -4px; cursor: nwse-resize; }
.edge-se { bottom: -4px; right: -4px; cursor: nwse-resize; }
</style>
