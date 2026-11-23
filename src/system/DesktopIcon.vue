<script setup lang="ts">
import { onBeforeUnmount } from 'vue'

const props = defineProps<{ label: string; icon: string; x: number; y: number; selected?: boolean }>()
const emit = defineEmits<{ select: []; open: [origin: DOMRect]; move: [x: number, y: number]; drop: [] }>()

// Перетаскивание как в Finder: после сдвига на 4px иконка едет за курсором; простой клик — выделение.
const THRESHOLD = 4
let start: { px: number; py: number; x: number; y: number } | null = null
let dragging = false

function onDown(e: PointerEvent) {
  if (e.button !== 0) return
  start = { px: e.clientX, py: e.clientY, x: props.x, y: props.y }
  dragging = false
  emit('select')
  window.addEventListener('pointermove', onMove)
  window.addEventListener('pointerup', onUp, { once: true })
}
function onMove(e: PointerEvent) {
  if (!start) return
  const dx = e.clientX - start.px, dy = e.clientY - start.py
  if (!dragging && Math.hypot(dx, dy) < THRESHOLD) return
  dragging = true
  emit('move', start.x + dx, start.y + dy)
}
function onUp() {
  window.removeEventListener('pointermove', onMove)
  if (dragging) emit('drop')
  start = null
}
onBeforeUnmount(() => window.removeEventListener('pointermove', onMove))
</script>

<template>
  <div
    class="dicon" :class="{ selected }" data-test="desktop-icon"
    :style="{ left: x + 'px', top: y + 'px' }"
    @pointerdown.stop="onDown" @click.stop
    @dblclick.stop="emit('open', ($event.currentTarget as HTMLElement).querySelector('.glyph')!.getBoundingClientRect())"
  >
    <div class="glyph"><img :src="icon" alt="" draggable="false"></div>
    <div class="label">{{ label }}</div>
  </div>
</template>

<style scoped>
.dicon { position: absolute; z-index: 2; width: 96px; display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: default; user-select: none; touch-action: none; }
.glyph { width: 68px; height: 68px; padding: 4px; border-radius: 8px; display: grid; place-items: center; }
.glyph img { width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 2px 4px rgba(0,0,0,.25)); }
.label { max-width: 96px; padding: 1px 5px; border-radius: 4px; font-size: 12px; font-weight: 500; text-align: center; color: #fff; text-shadow: 0 1px 3px rgba(0,0,0,.6); overflow-wrap: anywhere; }
.glyph { transition: transform .12s ease, filter .12s ease; }
.dicon:active .glyph { transform: scale(.94); filter: brightness(.7); }
.selected .glyph { background: rgba(0, 0, 0, .22); box-shadow: inset 0 0 0 1px rgba(255,255,255,.25); }
.selected .label { background: var(--accent); text-shadow: none; }
</style>
