<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { gsap } from 'gsap'
import { apps } from '@/content/apps'
import { enabledLinks } from '@/content/links'
import type { AppId } from '@/content/types'
import { useWindows } from '@/stores/windows'
import { asset } from '@/lib/asset'
import { dockScale } from '@/lib/magnify'
import { prefersReducedMotion } from '@/lib/motion'

const BASE = 54
const MAX = 1.55
const RADIUS = 150

const wm = useWindows()
const mouseX = ref<number | null>(null)
const slotEls = ref<HTMLElement[]>([])
const centers = ref<number[]>([])

const running = computed(() => {
  const set = new Set<string>()
  for (const id of wm.windows.value.keys()) set.add(id.startsWith('project:') ? 'finder' : id)
  return set
})

type Item = { key: string; label: string; icon?: string; app?: AppId; href?: string; external?: boolean; sep?: boolean }
const items: Item[] = [
  ...apps.map(a => ({ key: a.id, label: a.title, icon: asset(a.icon), app: a.id })),
  { key: 'sep', label: '', sep: true },
  ...enabledLinks.map(l => ({ key: l.id, label: l.id === 'email' ? l.value : l.label, icon: asset(l.icon), href: l.href, external: !l.href.startsWith('mailto:') })),
]

let raf = 0
let pendingX = 0
function onMove(e: MouseEvent) {
  // Центры слотов меряются один раз при входе, пока смещений нет, — дальше считаем от них.
  if (!centers.value.length) centers.value = slotEls.value.map(el => { const r = el.getBoundingClientRect(); return r.left + r.width / 2 })
  pendingX = e.clientX
  if (!raf) raf = requestAnimationFrame(() => { raf = 0; mouseX.value = pendingX })
}
function onLeave() { if (raf) { cancelAnimationFrame(raf); raf = 0 } mouseX.value = null; centers.value = [] }

/** Масштаб каждой иконки и смещение, раздвигающее соседей — как в macOS. */
const layout = computed(() => {
  const ks = items.map((it, i) =>
    it.sep || mouseX.value === null || centers.value[i] === undefined ? 1 : dockScale(Math.abs(mouseX.value - centers.value[i]), MAX, RADIUS))
  const extra = ks.map((k, i) => (items[i].sep ? 0 : BASE * (k - 1)))
  const total = extra.reduce((a, b) => a + b, 0)
  let cum = 0
  const offs = extra.map(e => { const o = cum + e / 2 - total / 2; cum += e; return o })
  return { ks, offs, total }
})

function bounce(key: string) {
  if (prefersReducedMotion()) return
  const bob = document.querySelector(`[data-dock-id="${key}"] .bob`)
  if (bob) gsap.timeline().to(bob, { y: -24, duration: 0.18, ease: 'power2.out' }).to(bob, { y: 0, duration: 0.24, ease: 'bounce.out' })
    .to(bob, { y: -10, duration: 0.14, ease: 'power2.out' }).to(bob, { y: 0, duration: 0.2, ease: 'bounce.out' })
}
watch(running, (now, before) => { for (const k of now) if (!before.has(k)) bounce(k) })

function setRef(el: unknown, i: number) { if (el) slotEls.value[i] = el as HTMLElement }
const slotStyle = (i: number) => ({ transform: `translateX(${layout.value.offs[i]}px)`, '--k': String(layout.value.ks[i]) })
</script>

<template>
  <nav class="dock-wrap" aria-label="Dock">
    <div class="dock" :class="{ hot: mouseX !== null }" @mousemove="onMove" @mouseleave="onLeave">
      <div class="dock-bg lg" :style="{ width: `calc(100% + ${layout.total}px)` }" />
      <template v-for="(it, i) in items" :key="it.key">
        <div v-if="it.sep" :ref="el => setRef(el, i)" class="dock-sep" :style="slotStyle(i)" />
        <button v-else-if="it.app" :ref="el => setRef(el, i)" class="dock-item" :data-dock-id="it.key" :aria-label="it.label"
                :style="slotStyle(i)" @click="wm.activate(it.app, ($event.currentTarget as HTMLElement).getBoundingClientRect())">
          <span class="bob"><img :src="it.icon" alt=""></span>
          <span class="dock-tip lg lg-dense">{{ it.label }}</span>
          <span v-if="running.has(it.key)" class="dock-dot" />
        </button>
        <a v-else :ref="el => setRef(el, i)" class="dock-item" :href="it.href" :aria-label="it.label"
           :target="it.external ? '_blank' : undefined" :rel="it.external ? 'noopener' : undefined" :style="slotStyle(i)">
          <span class="bob"><img :src="it.icon" alt=""></span>
          <span class="dock-tip lg lg-dense">{{ it.label }}</span>
        </a>
      </template>
    </div>
  </nav>
</template>

<style scoped>
.dock-wrap { position: absolute; left: 0; right: 0; bottom: 8px; z-index: 8000; display: flex; justify-content: center; pointer-events: none; }
.dock { pointer-events: auto; position: relative; display: flex; align-items: flex-end; gap: 10px; padding: 7px 12px; }
.dock-bg {
  position: absolute; top: 0; bottom: 0; left: 50%; transform: translateX(-50%);
  border-radius: 26px; z-index: -1; transition: width .18s ease-out;
}
.dock-item {
  position: relative; flex: none; width: 54px; height: 54px; padding: 0; border: 0; background: none; cursor: default;
  display: block; color: inherit; transition: transform .18s ease-out;
}
.bob { position: absolute; inset: 0; display: block; }
.bob img {
  position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; pointer-events: none;
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, .22));
  transform: scale(var(--k, 1)); transform-origin: 50% 100%; transition: transform .18s ease-out;
}
.dock-tip {
  position: absolute; left: 50%; transform: translateX(-50%); bottom: calc(54px * var(--k, 1) + 12px);
  padding: 4px 10px; border-radius: 8px; white-space: nowrap; font-size: 13px; color: var(--text);
  opacity: 0; pointer-events: none; transition: opacity .1s;
}
.dock-item:hover .dock-tip { opacity: 1; }
/* Пока курсор над Dock — без CSS-переходов: иконки идут за курсором кадр в кадр, без «догоняния». */
.dock.hot .dock-item, .dock.hot .bob img, .dock.hot .dock-sep, .dock.hot .dock-bg { transition: none; }
.dock-item, .bob img { will-change: transform; }
.dock-item:active .bob img { filter: brightness(.6) drop-shadow(0 2px 3px rgba(0, 0, 0, .22)); }
.dock-dot { position: absolute; bottom: -6px; left: 50%; width: 4px; height: 4px; margin-left: -2px; border-radius: 50%; background: var(--text); opacity: .75; }
.dock-sep { flex: none; align-self: stretch; width: 1px; margin: 4px 2px; background: rgba(255, 255, 255, .45); transition: transform .12s ease-out; }
:root[data-theme="dark"] .dock-sep { background: rgba(255, 255, 255, .22); }
</style>
