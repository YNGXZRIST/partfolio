<script setup lang="ts">
import { ref, type Component } from 'vue'
import Wallpaper from './Wallpaper.vue'
import Welcome from './Welcome.vue'
import ProfileWidget from './ProfileWidget.vue'
import DesktopIcon from './DesktopIcon.vue'
import AppPlaceholder from './AppPlaceholder.vue'
import AboutDeveloper from '@/apps/AboutDeveloper.vue'
import Contacts from '@/apps/Contacts.vue'
import Dock from './Dock.vue'
import MenuBar from './MenuBar.vue'
import GlassDefs from './GlassDefs.vue'
import { projects } from '@/content/projects'
import type { AppId, WindowId } from '@/content/types'
import { useWindows } from '@/stores/windows'
import { asset } from '@/lib/asset'

const wm = useWindows()
const selected = ref<string | null>(null)
const spotlightOpen = ref(false)

const appComponents: Partial<Record<AppId, Component>> = { about: AboutDeveloper, contacts: Contacts }
const projectComponent: Component | null = null

function componentFor(id: WindowId): Component {
  if (id.startsWith('project:')) return projectComponent ?? AppPlaceholder
  return appComponents[id as AppId] ?? AppPlaceholder
}
</script>

<template>
  <div class="desktop" @click="selected = null">
    <GlassDefs />
    <Wallpaper />
    <Welcome />
    <ProfileWidget />

    <div class="icons">
      <DesktopIcon
        v-for="p in projects" :key="p.slug"
        :label="p.name" :icon="asset('folder-sys.png')"
        :selected="selected === p.slug"
        @select="selected = p.slug"
        @open="selected = null; wm.activate(`project:${p.slug}`)"
      />
    </div>

    <component :is="componentFor(id)" v-for="id in wm.order.value" :id="id" :key="id" />

    <MenuBar @open-spotlight="spotlightOpen = true" />
    <Dock />
    <slot />
  </div>
</template>

<style scoped>
.desktop { position: fixed; inset: 0; overflow: hidden; }
.icons { position: absolute; top: 44px; right: 16px; z-index: 2; display: flex; flex-direction: column; gap: 14px; align-items: center; }
</style>
