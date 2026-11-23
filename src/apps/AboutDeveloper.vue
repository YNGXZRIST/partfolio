<script setup lang="ts">
import AppWindow from '@/system/AppWindow.vue'
import type { WindowId } from '@/content/types'
import { profile, education } from '@/content/profile'
import { asset } from '@/lib/asset'
defineProps<{ id: WindowId }>()
</script>

<template>
  <AppWindow :id="id" title="Об этом разработчике">
    <div class="mac-page about">
      <div class="hero">
        <img class="ava" :src="asset(profile.avatar)" :alt="profile.name">
        <h2>{{ profile.name }}</h2>
        <div class="headline">{{ profile.headline }}</div>
        <div class="focus">{{ profile.focus }}</div>
        <div class="status"><span class="dot" />{{ profile.status }}</div>
      </div>

      <div class="mac-group">
        <div v-for="f in profile.facts" :key="f.label" class="mac-row"><span class="k">{{ f.label }}</span><span class="v">{{ f.value }}</span></div>
      </div>

      <h3 class="mac-h">Образование и курсы</h3>
      <div class="mac-group">
        <div v-for="e in education" :key="e.title" class="mac-row edu">
          <div><div class="k">{{ e.title }}</div><div class="sub">{{ e.place }} · {{ e.detail }}</div></div>
          <span class="v">{{ e.year }}</span>
        </div>
      </div>

      <template v-for="a in profile.about" :key="a.title">
        <h3 class="mac-h">{{ a.title }}</h3>
        <div class="mac-group"><p class="mac-text">{{ a.text }}</p></div>
      </template>
    </div>
  </AppWindow>
</template>

<style scoped>
.hero { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 8px 0 22px; }
.ava { width: 128px; height: 128px; border-radius: 50%; object-fit: cover; box-shadow: 0 8px 24px rgba(0,0,0,.2), 0 0 0 .5px var(--hairline); }
h2 { margin: 16px 0 2px; font-size: 26px; font-weight: 700; letter-spacing: -.02em; }
.headline { font-size: 15px; font-weight: 600; color: var(--text); }
.focus { margin-top: 2px; font-size: 13px; color: var(--text-2); }
.status { margin-top: 10px; display: inline-flex; align-items: center; gap: 6px; height: 24px; padding: 0 10px; border-radius: 12px; background: rgba(40, 200, 64, .14); color: #1f9d3a; font-size: 12px; font-weight: 600; }
.dot { width: 7px; height: 7px; border-radius: 50%; background: #28c840; }
.edu { align-items: flex-start; }
.sub { margin-top: 2px; font-size: 12px; color: var(--text-2); }
@media (prefers-color-scheme: dark) { .status { color: #4ade80; } }
</style>
