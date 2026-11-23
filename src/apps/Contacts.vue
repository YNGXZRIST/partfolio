<script setup lang="ts">
import AppWindow from '@/system/AppWindow.vue'
import type { WindowId } from '@/content/types'
import { profile } from '@/content/profile'
import { enabledLinks } from '@/content/links'
import { asset } from '@/lib/asset'
defineProps<{ id: WindowId }>()

const actionLabel: Record<string, string> = { telegram: 'Telegram', email: 'Написать', github: 'GitHub' }
const target = (href: string) => (href.startsWith('mailto:') ? undefined : '_blank')
</script>

<template>
  <AppWindow :id="id" title="Контакты">
    <div class="mac-page contacts">
      <div class="card">
        <img class="ava" :src="asset(profile.avatar)" :alt="profile.name">
        <h2>{{ profile.name }}</h2>
        <div class="sub">{{ profile.headline }} · Калининград</div>
        <div class="actions">
          <a v-for="l in enabledLinks" :key="l.id" class="act" :href="l.href" :target="target(l.href)" rel="noopener">
            <span class="circle"><img :src="asset(l.icon)" alt=""></span>
            <span>{{ actionLabel[l.id] ?? l.label }}</span>
          </a>
        </div>
      </div>
      <div class="mac-group">
        <a v-for="l in enabledLinks" :key="l.id" class="mac-row link" :href="l.href" :target="target(l.href)" rel="noopener">
          <span class="k lbl">{{ l.label.toLowerCase() }}</span><span class="v val">{{ l.value }}</span>
        </a>
      </div>
      <h3 class="mac-h">Формат</h3>
      <div class="mac-group"><div class="mac-row"><span class="k">Работа</span><span class="v">Удалённо · командировки</span></div>
        <div class="mac-row"><span class="k">Статус</span><span class="v">{{ profile.status }}</span></div></div>
    </div>
  </AppWindow>
</template>

<style scoped>
.card { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 6px 0 20px; }
.ava { width: 96px; height: 96px; border-radius: 50%; object-fit: cover; box-shadow: 0 0 0 .5px var(--hairline); }
h2 { margin: 12px 0 2px; font-size: 22px; font-weight: 700; }
.sub { font-size: 13px; color: var(--text-2); }
.actions { display: flex; gap: 22px; margin-top: 16px; }
.act { display: flex; flex-direction: column; align-items: center; gap: 6px; font-size: 11px; color: var(--accent); text-decoration: none; }
.circle { width: 44px; height: 44px; border-radius: 50%; background: var(--fill-2); display: grid; place-items: center; box-shadow: inset 0 0 0 .5px var(--hairline); }
.circle img { width: 26px; height: 26px; object-fit: contain; }
.link { text-decoration: none; color: inherit; }
.lbl { color: var(--text-2); width: 90px; }
.val { color: var(--accent); }
</style>
