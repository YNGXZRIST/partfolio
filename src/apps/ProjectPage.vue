<script setup lang="ts">
import { computed, ref } from 'vue'
import AppWindow from '@/system/AppWindow.vue'
import ArchDiagram from './diagrams/ArchDiagram.vue'
import { diagramFor } from './diagrams'
import type { WindowId } from '@/content/types'
import { projects } from '@/content/projects'
import { asset } from '@/lib/asset'

const props = defineProps<{ id: WindowId }>()
const p = computed(() => projects.find(x => `project:${x.slug}` === props.id)!)
const more = ref(false)
</script>

<template>
  <AppWindow :id="id" :title="p.name">
    <div class="mac-page store">
      <section class="head" data-block="header">
        <img class="icon" :src="asset(p.icon)" alt="">
        <div class="htext">
          <h2>{{ p.name }}</h2>
          <p class="plain">{{ p.plain }}</p>
          <div class="hrow">
            <a class="mac-pill" :href="p.github" target="_blank" rel="noopener">Открыть на GitHub</a>
            <span class="tags"><span v-for="s in p.stack" :key="s" class="mac-tag">{{ s }}</span></span>
          </div>
        </div>
      </section>

      <section class="info" data-block="info">
        <div v-for="f in p.info" :key="f.label" class="cell"><div class="il">{{ f.label }}</div><div class="iv">{{ f.value }}</div></div>
      </section>

      <section data-block="features">
        <h3 class="mac-h">Что умеет</h3>
        <div class="mac-group">
          <div v-for="f in p.features" :key="f" class="mac-row feat">
            <svg viewBox="0 0 16 16" class="check"><path d="M3.5 8.5l3 3 6-7" /></svg><span>{{ f }}</span>
          </div>
        </div>
      </section>

      <section data-block="arch">
        <h3 class="mac-h">Как устроено</h3>
        <div class="mac-group diagram">
          <div class="dscroll"><ArchDiagram :diagram="diagramFor(p.slug)" /></div>
          <p class="mac-text note">{{ p.archNote }}</p>
        </div>
      </section>

      <section data-block="details">
        <h3 class="mac-h">Технические детали</h3>
        <div class="mac-group">
          <p class="mac-text">{{ p.description }}</p>
          <ul v-if="more" class="dlist"><li v-for="d in p.details" :key="d">{{ d }}</li></ul>
          <button v-else class="more" data-test="more" @click="more = true">ещё</button>
        </div>
      </section>
    </div>
  </AppWindow>
</template>

<style scoped>
.head { display: flex; gap: 20px; align-items: flex-start; padding: 8px 0 18px; }
.icon { width: 104px; height: 104px; border-radius: 23px; object-fit: cover; flex: none; box-shadow: 0 6px 18px rgba(0,0,0,.18), 0 0 0 .5px var(--hairline); }
h2 { margin: 2px 0 4px; font-size: 26px; font-weight: 700; letter-spacing: -.02em; }
.plain { margin: 0 0 12px; font-size: 14px; line-height: 1.45; color: var(--text-2); }
.hrow { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.tags { display: flex; gap: 6px; flex-wrap: wrap; }
.info { display: grid; grid-template-columns: repeat(4, 1fr); padding: 12px 0; border-top: .5px solid var(--hairline); border-bottom: .5px solid var(--hairline); }
.cell { text-align: center; padding: 0 8px; }
.cell + .cell { border-left: .5px solid var(--hairline); }
.il { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .04em; color: var(--text-3); }
.iv { margin-top: 4px; font-size: 14px; font-weight: 600; color: var(--text-2); }
.feat { justify-content: flex-start; }
.check { width: 16px; height: 16px; flex: none; fill: none; stroke: var(--accent); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.diagram { padding-top: 10px; }
.dscroll { overflow-x: auto; padding: 4px 12px; }
.dscroll :deep(svg) { min-width: 620px; }
.note { color: var(--text-2); font-size: 12.5px; }
.dlist { margin: 0; padding: 0 14px 14px 32px; font-size: 13px; line-height: 1.6; }
.more { margin: 0 14px 12px; padding: 0; border: 0; background: none; color: var(--accent); font-size: 13px; cursor: default; }
</style>
