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
import { useTheme } from '@/stores/theme'

const emit = defineEmits<{ 'open-spotlight': [] }>()
const wm = useWindows()
const root = ref<HTMLElement | null>(null)
const open = ref<string | null>(null)
const now = ref(new Date())
const { theme, setTheme } = useTheme()

type Menu = { id: string; label: string; bold?: boolean; items: MenuItem[] }
const menus = computed<Menu[]>(() => [
  { id: 'apple', label: '', items: [
    { label: 'Обо мне', action: () => wm.activate('about') },
    { separator: true, label: '' },
    { label: theme.value === 'dark' ? 'Светлое оформление' : 'Тёмное оформление', action: () => setTheme(theme.value === 'dark' ? 'light' : 'dark') },
    { separator: true, label: '' },
    { label: 'Системные настройки…', hint: 'стек', action: () => wm.activate('settings') },
    { separator: true, label: '' },
    { label: 'GitHub', href: 'https://github.com/YNGXZRIST' },
  ] },
  { id: 'name', label: profile.name, bold: true, items: [
    { label: 'Обо мне', action: () => wm.activate('about') },
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
      <svg class="ico bat" viewBox="0 0 27 13" aria-hidden="true"><rect x=".75" y=".75" width="22.5" height="11.5" rx="3.4" fill="none" stroke="currentColor" stroke-opacity=".5" stroke-width="1.2" /><rect x="2.6" y="2.6" width="18.8" height="7.8" rx="1.9" fill="currentColor" /><path d="M24.8 4.4v4.2c.8-.3 1.4-1.1 1.4-2.1s-.6-1.8-1.4-2.1z" fill="currentColor" fill-opacity=".5" /></svg>
      <svg class="ico" viewBox="0 0 18 13" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"><path d="M1.6 4.6a10.4 10.4 0 0 1 14.8 0" /><path d="M4.3 7.4a6.6 6.6 0 0 1 9.4 0" /></g><path d="M9 12.2l2.2-2.4a3.1 3.1 0 0 0-4.4 0z" fill="currentColor" /></svg>
      <button class="mitem ico-btn" data-test="spotlight-btn" aria-label="Spotlight" @click="emit('open-spotlight')">
        <svg class="ico" viewBox="0 0 15 15" aria-hidden="true"><circle cx="6.2" cy="6.2" r="4.9" fill="none" stroke="currentColor" stroke-width="1.7" /><path d="M9.9 9.9l3.6 3.6" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" /></svg>
      </button>
      <div class="mwrap">
        <button class="mitem ico-btn" :class="{ on: open === 'cc' }" data-test="cc-btn" aria-label="Пункт управления" @click="toggle('cc')">
          <svg class="ico" viewBox="0 0 17 15" aria-hidden="true"><defs><mask id="cc-cut"><rect width="17" height="15" fill="#fff" /><circle cx="12.6" cy="11.1" r="2.15" fill="#000" /></mask></defs><rect x="1.05" y="1.05" width="14.9" height="5.6" rx="2.8" fill="none" stroke="currentColor" stroke-width="1.3" /><circle cx="4.15" cy="3.85" r="2.15" fill="currentColor" /><rect x=".4" y="7.8" width="16.2" height="6.6" rx="3.3" fill="currentColor" mask="url(#cc-cut)" /></svg>
        </button>
        <div v-if="open === 'cc'" class="cc lg lg-dense" data-test="control-center">
          <div class="cc-tile">
            <div class="cc-title">Оформление</div>
            <div class="seg">
              <button :class="{ on: theme === 'dark' }" data-theme-option="dark" @click="setTheme('dark')">
                <svg viewBox="0 0 16 16"><path d="M13 9.5A5.5 5.5 0 0 1 6.5 3a5.5 5.5 0 1 0 6.5 6.5z" /></svg>Тёмное
              </button>
              <button :class="{ on: theme === 'light' }" data-theme-option="light" @click="setTheme('light')">
                <svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="3" /><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.4 1.4M11.6 11.6L13 13M3 13l1.4-1.4M11.6 4.4L13 3" /></svg>Светлое
              </button>
            </div>
          </div>
        </div>
      </div>
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
:root[data-theme="dark"] .menubar { color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,.35); }
.left, .right { display: flex; align-items: center; height: 100%; gap: 2px; }
.right { gap: 6px; padding-right: 6px; }
.mwrap { position: relative; height: 100%; display: flex; align-items: center; }
.mitem {
  height: 22px; padding: 0 9px; border: 0; border-radius: 6px; background: none;
  font-size: 13px; color: inherit; cursor: default; display: flex; align-items: center;
}
.mitem.bold { font-weight: 700; }
.mitem.on { background: rgba(255, 255, 255, .35); box-shadow: inset 0 0 0 .5px rgba(255,255,255,.5); }
:root[data-theme="dark"] .mitem.on { background: rgba(255, 255, 255, .18); }
.apple-logo { height: 15px; filter: brightness(0); }
:root[data-theme="dark"] .apple-logo { filter: brightness(0) invert(1); }
.ico { width: 17px; height: 14px; }
.ico.bat { width: 26px; height: 12px; }
.ico-btn { padding: 0 4px; }
.clock { padding: 0 4px; font-variant-numeric: tabular-nums; }
.cc { position: absolute; top: calc(100% + 4px); right: -40px; width: 300px; padding: 10px; border-radius: 22px; z-index: 9500; color: var(--text); text-shadow: none; }
.cc-tile { padding: 12px; border-radius: 16px; background: var(--fill); box-shadow: inset 0 0 0 .5px var(--hairline); }
.cc-title { font-size: 13px; font-weight: 600; margin-bottom: 10px; }
.seg { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
.seg button { display: flex; align-items: center; justify-content: center; gap: 6px; height: 34px; border: 0; border-radius: 10px; background: var(--fill-2); color: var(--text); font-size: 13px; cursor: default; }
.seg button.on { background: var(--accent); color: #fff; }
.seg svg { width: 15px; height: 15px; fill: none; stroke: currentColor; stroke-width: 1.5; }
.seg button:first-child svg { fill: currentColor; stroke: none; }
</style>
