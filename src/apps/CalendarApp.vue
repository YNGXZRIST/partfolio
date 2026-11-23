<script setup lang="ts">
import { computed, ref } from 'vue'
import AppWindow from '@/system/AppWindow.vue'
import type { Job, WindowId } from '@/content/types'
import { jobs } from '@/content/experience'
defineProps<{ id: WindowId }>()

const COLORS = ['#0a84ff', '#bf5af2', '#ff9f0a', '#30d158']
const now = new Date()
const toIdx = (ym: string | null) => {
  if (!ym) return now.getFullYear() * 12 + now.getMonth()
  const [y, m] = ym.split('-').map(Number)
  return y * 12 + (m - 1)
}
const startYear = Math.min(...jobs.map(j => Number(j.start.slice(0, 4))))
const endYear = now.getFullYear()
const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i)
const span = years.length * 12
const base = startYear * 12

// дорожки: пересекающиеся периоды идут на разные строки
const events = computed(() => {
  const lanes: number[] = []
  return jobs.map((j, i) => {
    const s = toIdx(j.start), e = toIdx(j.end) + 1
    let lane = lanes.findIndex(end => end <= s)
    if (lane < 0) { lane = lanes.length; lanes.push(e) } else lanes[lane] = e
    return { job: j, i, lane, left: ((s - base) / span) * 100, width: ((e - s) / span) * 100, color: COLORS[i % COLORS.length] }
  })
})
const laneCount = computed(() => Math.max(...events.value.map(e => e.lane)) + 1)

const monthFmt = new Intl.DateTimeFormat('ru-RU', { month: 'long', year: 'numeric' })
const fmt = (ym: string | null) => (ym ? monthFmt.format(new Date(Number(ym.slice(0, 4)), Number(ym.slice(5, 7)) - 1)).replace(' г.', '') : 'по наст. время')
function duration(j: Job) {
  const m = toIdx(j.end) - toIdx(j.start) + 1
  const y = Math.floor(m / 12), r = m % 12
  return [y ? `${y} г.` : '', r ? `${r} мес.` : ''].filter(Boolean).join(' ')
}
const selected = ref(0)
const sel = computed(() => events.value[selected.value])
</script>

<template>
  <AppWindow :id="id" title="Опыт">
    <template #toolbar>
      <div class="seg"><span>День</span><span>Неделя</span><span>Месяц</span><span class="on">Год</span></div>
    </template>
    <div class="cal">
      <div class="main">
        <div class="range">{{ startYear }} — {{ endYear }}</div>
        <div class="grid">
          <div class="years"><div v-for="y in years" :key="y" class="yr">{{ y }}</div></div>
          <div class="lanes" :style="{ height: laneCount * 62 + 'px' }">
            <div v-for="y in years" :key="y" class="col" :style="{ left: ((y - startYear) / years.length) * 100 + '%', width: 100 / years.length + '%' }" />
            <button v-for="e in events" :key="e.i" class="event" :class="{ on: e.i === selected }" data-test="event"
                    :style="{ left: e.left + '%', width: e.width + '%', top: e.lane * 62 + 10 + 'px', '--c': e.color }" @click="selected = e.i">
              <span class="en">{{ e.job.company }}</span>
              <span class="ep">{{ fmt(e.job.start) }} — {{ fmt(e.job.end) }}</span>
            </button>
          </div>
        </div>
        <p class="tip">Нажмите на событие, чтобы увидеть подробности</p>
      </div>
      <aside class="inspector" data-test="inspector">
        <div class="ibar" :style="{ background: sel.color }" />
        <h3>{{ sel.job.company }}</h3>
        <div class="role">{{ sel.job.role }}</div>
        <div class="meta">{{ fmt(sel.job.start) }} — {{ fmt(sel.job.end) }} · {{ duration(sel.job) }}<template v-if="sel.job.location"> · {{ sel.job.location }}</template></div>
        <div class="sum">{{ sel.job.summary }}</div>
        <ul><li v-for="p in sel.job.points" :key="p">{{ p }}</li></ul>
        <div class="tags"><span v-for="t in sel.job.tags" :key="t" class="mac-tag">{{ t }}</span></div>
      </aside>
    </div>
  </AppWindow>
</template>

<style scoped>
.seg { display: flex; padding: 2px; border-radius: 8px; background: var(--fill-2); font-size: 12px; }
.seg span { padding: 3px 10px; border-radius: 6px; color: var(--text-2); }
.seg .on { background: var(--glass-window-solid); color: var(--text); box-shadow: 0 1px 2px rgba(0,0,0,.15); }
.cal { display: flex; height: 100%; }
.main { flex: 1; min-width: 0; padding: 4px 20px 20px; overflow: auto; }
.range { font-size: 28px; font-weight: 700; letter-spacing: -.02em; margin-bottom: 14px; }
.grid { border-radius: 12px; background: var(--fill); box-shadow: inset 0 0 0 .5px var(--hairline); overflow: hidden; }
.years { display: grid; grid-auto-flow: column; grid-auto-columns: 1fr; border-bottom: .5px solid var(--hairline); }
.yr { padding: 8px 10px; font-size: 12px; font-weight: 600; color: var(--text-2); }
.yr + .yr { border-left: .5px solid var(--hairline); }
.lanes { position: relative; min-height: 80px; }
.col { position: absolute; top: 0; bottom: 0; border-left: .5px solid var(--hairline); }
.col:first-child { border-left: 0; }
.event {
  position: absolute; height: 46px; min-width: 150px; padding: 5px 8px; border: 0; border-radius: 8px; cursor: default; text-align: left;
  display: flex; flex-direction: column; justify-content: center; overflow: hidden;
  background: color-mix(in srgb, var(--c) 22%, transparent); border-left: 3px solid var(--c); color: var(--text);
}
.event.on { background: var(--c); color: #fff; }
.en { font-size: 12px; font-weight: 700; white-space: nowrap; }
.ep { font-size: 11px; opacity: .8; white-space: nowrap; }
.tip { font-size: 12px; color: var(--text-3); }
.inspector { width: 330px; flex: none; padding: 16px 20px 20px; border-left: .5px solid var(--hairline); overflow: auto; }
.ibar { width: 36px; height: 5px; border-radius: 3px; margin-bottom: 12px; }
h3 { margin: 0; font-size: 20px; font-weight: 700; }
.role { margin-top: 2px; font-size: 13px; font-weight: 600; }
.meta { margin-top: 6px; font-size: 12px; color: var(--text-2); }
.sum { margin-top: 12px; font-size: 13px; font-weight: 600; }
ul { margin: 8px 0 12px; padding-left: 18px; font-size: 12.5px; line-height: 1.55; color: var(--text); }
li + li { margin-top: 4px; }
.tags { display: flex; flex-wrap: wrap; gap: 6px; }
</style>
