<script setup lang="ts">
// Иконка Календаря как в macOS: день недели сверху, сегодняшнее число крупно.
const now = new Date()
const weekday = new Intl.DateTimeFormat('ru-RU', { weekday: 'short' }).format(now).replace('.', '').toUpperCase()
const day = now.getDate()
</script>

<template>
  <svg viewBox="0 0 1024 1024" class="cal-ico" aria-hidden="true">
    <defs>
      <linearGradient id="cal-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" /><stop offset="1" stop-color="#ececf0" /></linearGradient>
    </defs>
    <rect x="80" y="80" width="864" height="864" rx="200" fill="url(#cal-bg)" />
    <rect x="80.5" y="80.5" width="863" height="863" rx="199.5" fill="none" stroke="rgba(0,0,0,.12)" />
    <text x="512" y="300" text-anchor="middle" font-family="-apple-system, 'SF Pro Text', Inter, Helvetica, Arial, sans-serif" font-size="150" font-weight="600" fill="#ff3b30" letter-spacing="4">{{ weekday }}</text>
    <text x="512" y="760" text-anchor="middle" font-family="-apple-system, 'SF Pro Display', Inter, Helvetica, Arial, sans-serif" font-size="470" font-weight="300" fill="#1d1d1f" letter-spacing="-10">{{ day }}</text>
  </svg>
</template>

<style scoped>
.cal-ico { width: 100%; height: 100%; display: block; }
</style>
