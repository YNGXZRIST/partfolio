<script setup lang="ts">
import { profile } from '@/content/profile'
import { asset } from '@/lib/asset'
</script>

<template>
  <div class="widget" data-test="widget">
    <img class="ava" :src="asset(profile.avatar)" alt="">
    <div class="lines">
      <div data-line class="name">{{ profile.name }}</div>
      <div data-line class="headline">{{ profile.headline }}</div>
      <div data-line class="sub">{{ profile.focus }}</div>
      <div data-line class="sub">{{ profile.experience }} · {{ profile.stackLine }}</div>
      <div data-line class="status"><span class="dot">●</span> {{ profile.status }}</div>
    </div>
  </div>
</template>

<style scoped>
.widget {
  position: absolute; top: 48px; left: 24px; z-index: 2;
  width: 340px; padding: 16px; border-radius: 22px;
  display: flex; gap: 14px; align-items: flex-start;
  background: rgba(255, 255, 255, .5);
  backdrop-filter: blur(30px) saturate(180%); -webkit-backdrop-filter: blur(30px) saturate(180%);
  box-shadow: inset 0 .5px 0 rgba(255, 255, 255, .6), 0 0 0 .5px rgba(255, 255, 255, .25), 0 10px 30px rgba(0, 0, 0, .15);
  color: #1d1d1f; user-select: none;
}
.ava { width: 56px; height: 56px; border-radius: 50%; object-fit: cover; flex: none; box-shadow: 0 0 0 2px rgba(255,255,255,.5); }
.lines { min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.name { font-size: 17px; font-weight: 700; letter-spacing: -.01em; }
.headline { font-size: 14px; font-weight: 600; }
.sub { font-size: 12px; color: rgba(29, 29, 31, .66); }
.status { margin-top: 6px; font-size: 12px; font-weight: 600; }
.dot { color: #28a745; }
@media (prefers-color-scheme: dark) {
  .widget { background: rgba(28, 30, 40, .42); color: #fff; box-shadow: inset 0 .5px 0 rgba(255,255,255,.22), 0 0 0 .5px rgba(255,255,255,.12), 0 10px 30px rgba(0,0,0,.3); }
  .sub { color: rgba(255, 255, 255, .7); }
  .dot { color: #30d158; }
}
@supports not (backdrop-filter: blur(1px)) { .widget { background: rgba(30, 50, 110, .82); } }
</style>
