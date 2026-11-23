<script setup lang="ts">
import { ref } from 'vue'
import AppWindow from '@/system/AppWindow.vue'
import type { AppId, WindowId } from '@/content/types'
import { projects } from '@/content/projects'
import { useWindows } from '@/stores/windows'
import { asset } from '@/lib/asset'
defineProps<{ id: WindowId }>()

const wm = useWindows()
const selected = ref<string | null>(null)
const side: { label: string; app: AppId; icon: string }[] = [
  { label: 'Проекты', app: 'finder', icon: 'M2 4.5A1.5 1.5 0 0 1 3.5 3h3l1.5 1.5h4.5A1.5 1.5 0 0 1 14 6v5.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 11.5z' },
  { label: 'Обо мне', app: 'about', icon: 'M8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2zm0 2.6a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8zM7.2 7.4h1.6v4.2H7.2z' },
  { label: 'Стек', app: 'settings', icon: 'M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM7 1.5h2l.4 1.8 1.6.7 1.6-1 1.4 1.4-1 1.6.7 1.6 1.8.4v2l-1.8.4-.7 1.6 1 1.6-1.4 1.4-1.6-1-1.6.7L9 14.5H7l-.4-1.8-1.6-.7-1.6 1-1.4-1.4 1-1.6-.7-1.6L.5 9V7l1.8-.4.7-1.6-1-1.6 1.4-1.4 1.6 1 1.6-.7z' },
  { label: 'Опыт', app: 'calendar', icon: 'M3 3.5h10A1.5 1.5 0 0 1 14.5 5v7.5A1.5 1.5 0 0 1 13 14H3a1.5 1.5 0 0 1-1.5-1.5V5A1.5 1.5 0 0 1 3 3.5zM1.5 6.5h13M5 2v3M11 2v3' },
  { label: 'Контакты', app: 'contacts', icon: 'M8 8.2a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2zM3 14c.5-2.6 2.6-4 5-4s4.5 1.4 5 4z' },
]
</script>

<template>
  <AppWindow :id="id" title="Проекты" sidebar :sidebar-width="210">
    <template #sidebar>
      <div class="mac-side-h">Избранное</div>
      <button v-for="s in side" :key="s.app" class="mac-side-item" :class="{ on: s.app === 'finder' }" data-test="side" @click="wm.activate(s.app, ($event.currentTarget as HTMLElement).getBoundingClientRect())">
        <svg viewBox="0 0 16 16" class="sico"><path :d="s.icon" /></svg>{{ s.label }}
      </button>
    </template>
    <template #toolbar>
      <span class="count">{{ projects.length }} объекта</span>
    </template>
    <div class="grid" @click="selected = null">
      <div v-for="p in projects" :key="p.slug" class="folder" :class="{ sel: selected === p.slug }" data-test="folder"
           @click.stop="selected = p.slug" @dblclick.stop="wm.activate(`project:${p.slug}`, ($event.currentTarget as HTMLElement).querySelector('.ficon')!.getBoundingClientRect())">
        <div class="ficon"><img :src="asset(p.icon)" alt=""></div>
        <div class="fname">{{ p.name }}</div>
      </div>
    </div>
    <div class="hint">Дважды нажмите на проект, чтобы открыть его</div>
  </AppWindow>
</template>

<style scoped>
.sico { width: 16px; height: 16px; fill: none; stroke: var(--accent); stroke-width: 1.3; flex: none; }
.count { font-size: 12px; color: var(--text-2); }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 18px 8px; padding: 18px 20px; }
.folder { display: flex; flex-direction: column; align-items: center; gap: 6px; cursor: default; }
.ficon { position: relative; width: 84px; height: 84px; padding: 4px; border-radius: 10px; }
.ficon img:first-child { width: 100%; height: 100%; object-fit: cover; border-radius: 17px; filter: drop-shadow(0 2px 4px rgba(0,0,0,.2)); }
.fname { padding: 1px 6px; border-radius: 5px; font-size: 12px; text-align: center; }
.ficon img:first-child { transition: transform .12s ease, filter .12s ease; }
.folder:active .ficon img:first-child { filter: brightness(.65); }
.folder:active .ficon { transform: scale(.94); }
.ficon { transition: transform .12s ease; }
.sel .ficon { background: var(--fill-2); }
.sel .fname { background: var(--accent); color: #fff; }
.hint { padding: 0 20px 16px; font-size: 12px; color: var(--text-3); }
</style>
