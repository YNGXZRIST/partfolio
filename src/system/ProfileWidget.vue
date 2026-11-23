<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { profile } from '@/content/profile'
import { asset } from '@/lib/asset'
import { useWindows } from '@/stores/windows'
import { prefersReducedMotion } from '@/lib/motion'

const wm = useWindows()
const el = ref<HTMLElement | null>(null)

// Появляется как баннер уведомления macOS: опускается сверху с лёгкой пружиной.
onMounted(() => {
  if (!el.value || prefersReducedMotion()) return
  gsap.fromTo(el.value, { y: -140, scale: 0.94, opacity: 0, transformOrigin: '50% 0%' }, { y: 0, scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.3)', delay: 1, clearProps: 'transform,opacity' })
})
</script>

<template>
  <div ref="el" class="widget lg" data-test="widget" role="button" tabindex="0" aria-label="Открыть «Обо мне»"
       @click="wm.activate('about')" @keydown.enter="wm.activate('about')">
    <div class="n-head"><span class="n-app"><img :src="asset('about.svg')" alt="">ПОРТФОЛИО</span><span class="n-time">сейчас</span></div>
    <div class="n-body">
    <img class="ava" :src="asset(profile.avatar)" alt="">
    <div class="lines">
      <div data-line class="name">{{ profile.name }}</div>
      <div data-line class="headline">{{ profile.headline }}</div>
      <div data-line class="sub">{{ profile.focus }}</div>
      <div data-line class="sub">{{ profile.experience }} · {{ profile.stackLine }}</div>
      <div data-line class="status"><span class="dot">●</span> {{ profile.status }}</div>
    </div>
    </div>
  </div>
</template>

<style scoped>
.widget {
  position: absolute; top: 40px; right: 14px; z-index: 2;
  width: 340px; padding: 16px; border-radius: 22px;
  display: flex; flex-direction: column; gap: 8px; cursor: default;
  color: #1d1d1f; user-select: none;
}
.n-head { display: flex; justify-content: space-between; align-items: center; font-size: 11px; font-weight: 600; letter-spacing: .03em; opacity: .7; }
.n-app { display: flex; align-items: center; gap: 6px; }
.n-app img { width: 16px; height: 16px; border-radius: 4px; }
.n-time { font-weight: 500; letter-spacing: 0; }
.n-body { display: flex; gap: 14px; align-items: flex-start; }
.widget:active { transform: scale(.98); }
.ava { width: 56px; height: 56px; border-radius: 50%; object-fit: cover; flex: none; box-shadow: 0 0 0 2px rgba(255,255,255,.5); }
.lines { min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.name { font-size: 17px; font-weight: 700; letter-spacing: -.01em; }
.headline { font-size: 14px; font-weight: 600; }
.sub { font-size: 12px; color: rgba(29, 29, 31, .66); }
.status { margin-top: 6px; font-size: 12px; font-weight: 600; }
.dot { color: #1fbf4a; }
:root[data-theme="dark"] .widget { color: #fff; text-shadow: 0 1px 3px rgba(0, 0, 0, .35); }
  :root[data-theme="dark"] .sub { color: rgba(255, 255, 255, .78); }
  :root[data-theme="dark"] .dot { color: #34ff6a; }
</style>
