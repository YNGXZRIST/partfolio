<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { prefersReducedMotion } from '@/lib/motion'

const TEXT = 'welcome'
const el = ref<HTMLElement | null>(null)
const w = ref(760)
const h = ref(290)
const fs = ref(200)

function layout() {
  if (!el.value) return
  w.value = el.value.clientWidth || 760
  h.value = Math.round(w.value * 0.38)
  fs.value = Math.round(w.value * 0.25)
}

onMounted(async () => {
  layout()
  window.addEventListener('resize', layout)
  await (document as Document & { fonts?: FontFaceSet }).fonts?.ready
  layout()
  if (el.value && !prefersReducedMotion())
    gsap.fromTo(el.value, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 1.4, ease: 'power2.out', delay: 0.15 })
})
onBeforeUnmount(() => window.removeEventListener('resize', layout))
</script>

<template>
  <div ref="el" class="welcome" data-test="welcome" role="img" :aria-label="TEXT" :style="{ height: h + 'px' }">
    <!-- форма букв для обрезки стекла -->
    <svg class="defs" width="0" height="0" aria-hidden="true">
      <clipPath id="wl-clip" clipPathUnits="userSpaceOnUse">
        <text class="layer" :x="w / 2" :y="h * 0.7" :font-size="fs" text-anchor="middle">{{ TEXT }}</text>
      </clipPath>
    </svg>

    <!-- мягкая тень под стеклом -->
    <svg class="fx shadow" :viewBox="`0 0 ${w} ${h}`" aria-hidden="true">
      <text class="layer" :x="w / 2" :y="h * 0.7 + fs * 0.05" :font-size="fs" text-anchor="middle">{{ TEXT }}</text>
    </svg>

    <!-- само стекло: фон под буквами ярче, насыщеннее, слегка размыт -->
    <div class="glass" />

    <!-- кромка и блики -->
    <svg class="fx rims" :viewBox="`0 0 ${w} ${h}`" aria-hidden="true">
      <defs>
        <linearGradient id="wl-top" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#fff" /><stop offset=".55" stop-color="#fff" /><stop offset=".7" stop-color="#000" />
        </linearGradient>
        <linearGradient id="wl-bottom" x1="0" y1="0" x2="0" y2="1">
          <stop offset=".55" stop-color="#000" /><stop offset=".75" stop-color="#fff" />
        </linearGradient>
        <mask id="wl-mtop"><rect :width="w" :height="h" fill="url(#wl-top)" /></mask>
        <mask id="wl-mbot"><rect :width="w" :height="h" fill="url(#wl-bottom)" /></mask>
      </defs>
      <text class="layer edge" :x="w / 2" :y="h * 0.7" :font-size="fs" text-anchor="middle">{{ TEXT }}</text>
      <text class="layer hi" :x="w / 2 - fs * 0.006" :y="h * 0.7 - fs * 0.01" :font-size="fs" text-anchor="middle" mask="url(#wl-mtop)">{{ TEXT }}</text>
      <text class="layer glint" :x="w / 2 + fs * 0.005" :y="h * 0.7 + fs * 0.008" :font-size="fs" text-anchor="middle" mask="url(#wl-mbot)">{{ TEXT }}</text>
    </svg>
  </div>
</template>

<style scoped>
.welcome {
  position: absolute; left: 50%; top: 36%; transform: translate(-50%, -50%);
  width: min(54vw, 780px);
  z-index: 1; pointer-events: none;
}
.defs { position: absolute; }
.welcome text { font-family: var(--font-hand); }
.fx { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
.glass {
  position: absolute; inset: 0;
  clip-path: url(#wl-clip);
  background: linear-gradient(180deg, rgba(255, 255, 255, .34) 0%, rgba(255, 255, 255, .08) 55%, rgba(255, 255, 255, .2) 100%);
  backdrop-filter: blur(3px) saturate(230%) brightness(1.32);
  -webkit-backdrop-filter: blur(3px) saturate(230%) brightness(1.32);
}
.shadow text { fill: rgba(30, 10, 110, .28); filter: blur(9px); }
.edge { fill: none; stroke: rgba(40, 20, 150, .38); stroke-width: 1.6; }
.hi { fill: none; stroke: rgba(255, 255, 255, .95); stroke-width: 2.2; stroke-linejoin: round; }
.glint { fill: none; stroke: rgba(220, 230, 255, .7); stroke-width: 1.4; stroke-linejoin: round; }
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .glass { background: linear-gradient(180deg, rgba(255,255,255,.75), rgba(200,210,255,.5)); }
}
</style>
