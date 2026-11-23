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
const wm = useWindows()
const mouseX = ref<number | null>(null)
const itemEls = ref<HTMLElement[]>([])
const centers = ref<number[]>([])

const running = computed(() => {
  const set = new Set<string>()
  for (const id of wm.windows.value.keys()) set.add(id.startsWith('project:') ? 'finder' : id)
  return set
})

type Item = { key: string; label: string; icon: string; app?: AppId; href?: string; external?: boolean }
const appItems: Item[] = apps.map(a => ({ key: a.id, label: a.title, icon: asset(a.icon), app: a.id }))
const linkItems: Item[] = enabledLinks.map(l => ({ key: l.id, label: l.id === 'email' ? l.value : l.label, icon: asset(l.icon), href: l.href, external: !l.href.startsWith('mailto:') }))

let raf = 0
function onMove(e: MouseEvent) {
  if (!centers.value.length) measure()
  mouseX.value = e.clientX
}
function onLeave() { mouseX.value = null; centers.value = [] }
function measure() {
  centers.value = itemEls.value.map(el => { const r = el.getBoundingClientRect(); return r.left + r.width / 2 })
}
function sizeOf(i: number) {
  if (mouseX.value === null || centers.value[i] === undefined) return BASE
  return Math.round(BASE * dockScale(Math.abs(mouseX.value - centers.value[i])))
}
void raf

function bounce(key: string) {
  if (prefersReducedMotion()) return
  const img = document.querySelector(`[data-dock-id="${key}"] img`)
  if (img) gsap.timeline().to(img, { y: -22, duration: 0.18, ease: 'power2.out' }).to(img, { y: 0, duration: 0.22, ease: 'bounce.out' })
    .to(img, { y: -10, duration: 0.14, ease: 'power2.out' }).to(img, { y: 0, duration: 0.18, ease: 'bounce.out' })
}

watch(running, (now, before) => { for (const k of now) if (!before.has(k)) bounce(k) })

function setRef(el: unknown, i: number) { if (el) itemEls.value[i] = el as HTMLElement }
</script>

<template>
  <nav class="dock-wrap" aria-label="Dock">
    <div class="dock glass-bar" @mousemove="onMove" @mouseleave="onLeave">
      <button
        v-for="(it, i) in appItems" :key="it.key" :ref="el => setRef(el, i)"
        class="dock-item" :data-dock-id="it.key" :aria-label="it.label"
        :style="{ width: sizeOf(i) + 'px', height: sizeOf(i) + 'px' }"
        @click="wm.activate(it.app!)"
      >
        <img :src="it.icon" alt="">
        <span class="dock-tip">{{ it.label }}</span>
        <span v-if="running.has(it.key)" class="dock-dot" />
      </button>
      <div class="dock-sep" />
      <a
        v-for="(it, j) in linkItems" :key="it.key" :ref="el => setRef(el, appItems.length + j)"
        class="dock-item" :href="it.href" :aria-label="it.label"
        :target="it.external ? '_blank' : undefined" :rel="it.external ? 'noopener' : undefined"
        :style="{ width: sizeOf(appItems.length + j) + 'px', height: sizeOf(appItems.length + j) + 'px' }"
      >
        <img :src="it.icon" alt="">
        <span class="dock-tip">{{ it.label }}</span>
      </a>
    </div>
  </nav>
</template>

<style scoped>
.dock-wrap { position: absolute; left: 0; right: 0; bottom: 6px; z-index: 8000; display: flex; justify-content: center; pointer-events: none; }
.dock {
  pointer-events: auto;
  display: flex; align-items: flex-end; gap: 6px;
  padding: 6px 8px; border-radius: 24px;
  background: rgba(255, 255, 255, .26);
  box-shadow: inset 0 .5px 0 rgba(255,255,255,.65), inset 0 0 0 .5px rgba(255,255,255,.3), 0 10px 30px rgba(0,0,0,.18);
}
@media (prefers-color-scheme: dark) {
  .dock { background: rgba(40, 42, 54, .32); box-shadow: inset 0 .5px 0 rgba(255,255,255,.25), inset 0 0 0 .5px rgba(255,255,255,.12), 0 10px 30px rgba(0,0,0,.35); }
}
.dock-item {
  position: relative; flex: none; padding: 0; border: 0; background: none; cursor: default;
  display: flex; align-items: flex-end; justify-content: center;
  transition: width .12s ease-out, height .12s ease-out;
}
.dock-item img { width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 2px 3px rgba(0,0,0,.22)); }
.dock-tip {
  position: absolute; bottom: calc(100% + 12px); left: 50%; transform: translateX(-50%);
  padding: 4px 10px; border-radius: 8px; white-space: nowrap;
  font-size: 13px; color: var(--text);
  background: var(--glass-menu); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
  box-shadow: var(--shadow-menu); opacity: 0; pointer-events: none; transition: opacity .1s;
}
.dock-item:hover .dock-tip { opacity: 1; }
.dock-dot { position: absolute; bottom: -5px; left: 50%; width: 4px; height: 4px; margin-left: -2px; border-radius: 50%; background: var(--text); opacity: .75; }
.dock-sep { align-self: stretch; width: 1px; margin: 6px 4px; background: var(--hairline); }
@supports not (backdrop-filter: blur(1px)) { .dock { background: var(--glass-bar-solid); } }
</style>
