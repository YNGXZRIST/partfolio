<script setup lang="ts">
import { computed, ref } from 'vue'
import AppWindow from '@/system/AppWindow.vue'
import type { WindowId } from '@/content/types'
import { stack } from '@/content/stack'
import { profile } from '@/content/profile'
import { asset } from '@/lib/asset'
defineProps<{ id: WindowId }>()

const current = ref(stack[0].id)
const cat = computed(() => stack.find(s => s.id === current.value)!)
const glyphs: Record<string, string> = {
  code: 'M5.5 4L2 8l3.5 4M10.5 4L14 8l-3.5 4',
  arrows: 'M2 5.5h10M9 2.5l3 3-3 3M14 10.5H4M7 7.5l-3 3 3 3',
  db: 'M3 4c0-1.1 2.2-2 5-2s5 .9 5 2-2.2 2-5 2-5-.9-5-2zm0 0v8c0 1.1 2.2 2 5 2s5-.9 5-2V4M3 8c0 1.1 2.2 2 5 2s5-.9 5-2',
  queue: 'M2 4h12M2 8h12M2 12h8',
  box: 'M8 1.5l6 3v7l-6 3-6-3v-7zM2 4.5l6 3 6-3M8 7.5v7',
  spark: 'M8 1.5l1.6 4.9L14.5 8l-4.9 1.6L8 14.5l-1.6-4.9L1.5 8l4.9-1.6z',
  window: 'M2 3.5h12v9H2zM2 6h12',
}
</script>

<template>
  <AppWindow :id="id" :title="cat.title" sidebar :sidebar-width="230">
    <template #sidebar>
      <div class="search"><svg viewBox="0 0 16 16"><circle cx="7" cy="7" r="4.5" /><path d="M10.5 10.5L14 14" /></svg>Поиск</div>
      <div class="acct">
        <img :src="asset(profile.avatar)" alt="">
        <div><div class="an">{{ profile.name }}</div><div class="as">Технический стек</div></div>
      </div>
      <button v-for="s in stack" :key="s.id" class="mac-side-item" :class="{ on: s.id === current }" data-test="cat" @click="current = s.id">
        <span class="sq" :style="{ background: s.color }"><svg viewBox="0 0 16 16"><path :d="glyphs[s.glyph]" /></svg></span>{{ s.title }}
      </button>
    </template>
    <div class="mac-page" data-test="pane">
      <div class="phead">
        <span class="sq big" :style="{ background: cat.color }"><svg viewBox="0 0 16 16"><path :d="glyphs[cat.glyph]" /></svg></span>
        <div><h2>{{ cat.title }}</h2><div class="psub">{{ cat.items.length }} технологий</div></div>
      </div>
      <div class="mac-group">
        <div v-for="it in cat.items" :key="it.name" class="mac-row">
          <span class="k">{{ it.name }}</span><span v-if="it.note" class="v badge">{{ it.note }}</span>
        </div>
      </div>
    </div>
  </AppWindow>
</template>

<style scoped>
.search { display: flex; align-items: center; gap: 6px; height: 28px; margin: 0 2px 10px; padding: 0 8px; border-radius: 8px; background: var(--fill-2); color: var(--text-3); font-size: 13px; }
.search svg { width: 13px; height: 13px; fill: none; stroke: currentColor; stroke-width: 1.6; }
.acct { display: flex; align-items: center; gap: 10px; padding: 6px 8px 12px; }
.acct img { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; }
.an { font-size: 13px; font-weight: 600; }
.as { font-size: 11px; color: var(--text-2); }
.sq { width: 22px; height: 22px; border-radius: 6px; display: grid; place-items: center; flex: none; box-shadow: inset 0 .5px 0 rgba(255,255,255,.35); }
.sq svg { width: 14px; height: 14px; fill: none; stroke: #fff; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
.sq.big { width: 52px; height: 52px; border-radius: 13px; }
.sq.big svg { width: 30px; height: 30px; }
.phead { display: flex; align-items: center; gap: 14px; padding: 6px 0 18px; }
h2 { margin: 0; font-size: 22px; font-weight: 700; }
.psub { font-size: 12px; color: var(--text-2); }
.badge { padding: 2px 8px; border-radius: 10px; background: rgba(10,132,255,.14); color: var(--accent); font-size: 12px; font-weight: 600; }
</style>
