<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, type Component } from 'vue'
import Wallpaper from './Wallpaper.vue'
import Welcome from './Welcome.vue'
import ProfileWidget from './ProfileWidget.vue'
import DesktopIcon from './DesktopIcon.vue'
import AboutDeveloper from '@/apps/AboutDeveloper.vue'
import Contacts from '@/apps/Contacts.vue'
import Finder from '@/apps/Finder.vue'
import ProjectPage from '@/apps/ProjectPage.vue'
import Settings from '@/apps/Settings.vue'
import CalendarApp from '@/apps/CalendarApp.vue'
import Dock from './Dock.vue'
import MenuBar from './MenuBar.vue'
import Spotlight from './Spotlight.vue'
import GlassDefs from './GlassDefs.vue'
import { projects } from '@/content/projects'
import type { AppId, WindowId } from '@/content/types'
import { useWindows } from '@/stores/windows'
import { asset } from '@/lib/asset'

const wm = useWindows()
const selected = ref<string | null>(null)
const spotlightOpen = ref(false)

// --- иконки на рабочем столе: перетаскиваются, позиции запоминаются ---
type Pos = { x: number; y: number }
const ICONS_KEY = 'desktop-icons'
const ICON_W = 96, ICON_H = 104, MENUBAR = 28, DOCK = 96
const positions = ref<Record<string, Pos>>({})

const vp = () => ({ w: window.innerWidth, h: window.innerHeight })
const defaultPos = (i: number): Pos => ({ x: vp().w - 16 - ICON_W, y: 200 + i * ICON_H })
const clampPos = (p: Pos): Pos => ({
  x: Math.min(Math.max(p.x, 0), vp().w - ICON_W),
  y: Math.min(Math.max(p.y, MENUBAR + 4), vp().h - DOCK - ICON_H),
})

function loadPositions() {
  let saved: Record<string, Pos> = {}
  try { saved = JSON.parse(localStorage.getItem(ICONS_KEY) || '{}') } catch { /* нет хранилища */ }
  const next: Record<string, Pos> = {}
  projects.forEach((p, i) => { next[p.slug] = clampPos(saved[p.slug] ?? defaultPos(i)) })
  positions.value = next
}
function savePositions() {
  try { localStorage.setItem(ICONS_KEY, JSON.stringify(positions.value)) } catch { /* не критично */ }
}
function moveIcon(slug: string, x: number, y: number) { positions.value = { ...positions.value, [slug]: clampPos({ x, y }) } }
function onResize() { for (const k in positions.value) positions.value[k] = clampPos(positions.value[k]) }

loadPositions()
onMounted(() => window.addEventListener('resize', onResize))
onBeforeUnmount(() => window.removeEventListener('resize', onResize))

const appComponents: Record<AppId, Component> = { about: AboutDeveloper, contacts: Contacts, finder: Finder, settings: Settings, calendar: CalendarApp }

function componentFor(id: WindowId): Component {
  if (id.startsWith('project:')) return ProjectPage
  return appComponents[id as AppId]
}
</script>

<template>
  <div class="desktop" @click="selected = null">
    <GlassDefs />
    <Wallpaper />
    <Welcome />
    <ProfileWidget />

    <DesktopIcon
      v-for="p in projects" :key="p.slug"
      :label="p.name" :icon="asset('folder-sys.png')"
      :x="positions[p.slug].x" :y="positions[p.slug].y"
      :selected="selected === p.slug"
      @select="selected = p.slug"
      @move="(x: number, y: number) => moveIcon(p.slug, x, y)"
      @drop="savePositions"
      @open="(o: DOMRect) => { selected = null; wm.activate(`project:${p.slug}`, o) }"
    />

    <component :is="componentFor(id)" v-for="id in wm.order.value" :id="id" :key="id" />

    <MenuBar @open-spotlight="spotlightOpen = true" />
    <Dock />
    <Spotlight v-model:open="spotlightOpen" />
    <slot />
  </div>
</template>

<style scoped>
.desktop { position: fixed; inset: 0; overflow: hidden; }
</style>
