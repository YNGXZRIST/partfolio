<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import MenuDropdown, { type MenuItem } from './MenuDropdown.vue'
import { projects } from '@/content/projects'
import { jobs } from '@/content/experience'
import { stack } from '@/content/stack'
import { enabledLinks } from '@/content/links'
import { profile } from '@/content/profile'
import { useWindows } from '@/stores/windows'
import { formatMenuClock } from '@/lib/date'
import { asset } from '@/lib/asset'

const emit = defineEmits<{ 'open-spotlight': [] }>()
const wm = useWindows()
const root = ref<HTMLElement | null>(null)
const open = ref<string | null>(null)
const now = ref(new Date())

type Menu = { id: string; label: string; bold?: boolean; items: MenuItem[] }
const menus = computed<Menu[]>(() => [
  { id: 'apple', label: '', items: [
    { label: 'Об этом разработчике', action: () => wm.activate('about') },
    { separator: true, label: '' },
    { label: 'Системные настройки…', hint: 'стек', action: () => wm.activate('settings') },
    { separator: true, label: '' },
    { label: 'GitHub', href: 'https://github.com/YNGXZRIST' },
  ] },
  { id: 'name', label: profile.name, bold: true, items: [
    { label: 'Об этом разработчике', action: () => wm.activate('about') },
    { label: 'Все проекты', action: () => wm.activate('finder') },
    { label: 'Связаться', action: () => wm.activate('contacts') },
  ] },
  { id: 'projects', label: 'Проекты', items: projects.map(p => ({ label: p.name, action: () => wm.activate(`project:${p.slug}`) })) },
  { id: 'exp', label: 'Опыт', items: jobs.map(j => ({ label: j.company, action: () => wm.activate('calendar') })) },
  { id: 'stack', label: 'Стек', items: stack.map(c => ({ label: c.title, action: () => wm.activate('settings') })) },
  { id: 'contacts', label: 'Контакты', items: [
    ...enabledLinks.map(l => ({ label: l.label, hint: l.value, href: l.href })),
    { separator: true, label: '' },
    { label: 'Карточка контакта', action: () => wm.activate('contacts') },
  ] },
])

function toggle(id: string) { open.value = open.value === id ? null : id }
function hover(id: string) { if (open.value && open.value !== id) open.value = id }
function onKey(e: KeyboardEvent) { if (e.key === 'Escape') open.value = null }
function onDown(e: Event) { if (open.value && root.value && !root.value.contains(e.target as Node)) open.value = null }

let timer = 0
onMounted(() => {
  document.addEventListener('keydown', onKey)
  document.addEventListener('pointerdown', onDown)
  timer = window.setInterval(() => (now.value = new Date()), 30_000)
})
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKey)
  document.removeEventListener('pointerdown', onDown)
  clearInterval(timer)
})
</script>

<template>
  <header ref="root" class="menubar">
    <nav class="left">
      <div v-for="m in menus" :key="m.id" class="mwrap">
        <button
          class="mitem" :class="{ bold: m.bold, on: open === m.id, apple: m.id === 'apple' }"
          :data-menu="m.id" @click="toggle(m.id)" @mouseenter="hover(m.id)"
        >
          <img v-if="m.id === 'apple'" class="apple-logo" :src="asset('apple.png')" alt="">
          <template v-else>{{ m.label }}</template>
        </button>
        <MenuDropdown v-if="open === m.id" :items="m.items" @done="open = null" />
      </div>
    </nav>
    <div class="right">
      <svg class="ico" viewBox="0 0 24 16" aria-hidden="true"><rect x="1" y="3" width="19" height="10" rx="3" fill="none" stroke="currentColor" stroke-width="1.2" /><rect x="3" y="5" width="13" height="6" rx="1.5" fill="currentColor" /><rect x="21" y="6" width="1.6" height="4" rx=".8" fill="currentColor" /></svg>
      <svg class="ico" viewBox="0 0 20 16" aria-hidden="true"><path d="M10 13.5l2-2.3a3 3 0 0 0-4 0z M5.2 8.5a6.9 6.9 0 0 1 9.6 0l-1.3 1.4a5 5 0 0 0-7 0z M2.4 5.6a11 11 0 0 1 15.2 0l-1.3 1.4a9 9 0 0 0-12.6 0z" fill="currentColor" /></svg>
      <button class="mitem ico-btn" data-test="spotlight-btn" aria-label="Spotlight" @click="emit('open-spotlight')">
        <svg class="ico" viewBox="0 0 16 16" aria-hidden="true"><circle cx="6.5" cy="6.5" r="4.6" fill="none" stroke="currentColor" stroke-width="1.6" /><path d="M10 10l4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /></svg>
      </button>
      <svg class="ico" viewBox="0 0 18 16" aria-hidden="true"><rect x="1" y="2" width="16" height="5" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.3" /><circle cx="13.5" cy="4.5" r="1.6" fill="currentColor" /><rect x="1" y="9" width="16" height="5" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.3" /><circle cx="4.5" cy="11.5" r="1.6" fill="currentColor" /></svg>
      <span class="clock">{{ formatMenuClock(now) }}</span>
    </div>
  </header>
</template>

<style scoped>
/* Tahoe: меню-бар прозрачный, без подложки. */
.menubar {
  position: absolute; top: 0; left: 0; right: 0; height: var(--menubar-h); z-index: 9000;
  display: flex; align-items: center; justify-content: space-between; padding: 0 8px;
  font-size: 13px; color: #1d1d1f; user-select: none;
}
@media (prefers-color-scheme: dark) { .menubar { color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,.35); } }
.left, .right { display: flex; align-items: center; height: 100%; gap: 2px; }
.right { gap: 6px; padding-right: 6px; }
.mwrap { position: relative; height: 100%; display: flex; align-items: center; }
.mitem {
  height: 22px; padding: 0 9px; border: 0; border-radius: 6px; background: none;
  font-size: 13px; color: inherit; cursor: default; display: flex; align-items: center;
}
.mitem.bold { font-weight: 700; }
.mitem.on { background: rgba(255, 255, 255, .35); box-shadow: inset 0 0 0 .5px rgba(255,255,255,.5); }
@media (prefers-color-scheme: dark) { .mitem.on { background: rgba(255, 255, 255, .18); } }
.apple-logo { height: 15px; filter: brightness(0); }
@media (prefers-color-scheme: dark) { .apple-logo { filter: brightness(0) invert(1); } }
.ico { width: 18px; height: 15px; opacity: .9; }
.ico-btn { padding: 0 4px; }
.clock { padding: 0 4px; font-variant-numeric: tabular-nums; }
</style>
