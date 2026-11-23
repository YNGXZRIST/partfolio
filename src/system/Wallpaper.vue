<template>
  <div class="wallpaper" aria-hidden="true">
    <svg class="wp wp-light" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="wl-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#cfe3ff"/><stop offset=".55" stop-color="#8fb8f5"/><stop offset="1" stop-color="#4f7fe0"/></linearGradient>
        <linearGradient id="wl-a" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity=".85"/><stop offset="1" stop-color="#a9c9ff" stop-opacity=".2"/></linearGradient>
        <linearGradient id="wl-b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5d8df0"/><stop offset="1" stop-color="#2a55c9"/></linearGradient>
        <linearGradient id="wl-c" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3b6be0"/><stop offset="1" stop-color="#1c3fa8"/></linearGradient>
        <filter id="wl-blur"><feGaussianBlur stdDeviation="18"/></filter>
      </defs>
      <rect width="1600" height="1000" fill="url(#wl-bg)"/>
      <path d="M0 420C260 300 520 520 820 430S1360 220 1600 300V1000H0Z" fill="url(#wl-a)" filter="url(#wl-blur)"/>
      <path d="M0 560C300 470 560 680 900 590S1380 420 1600 500V1000H0Z" fill="url(#wl-b)" opacity=".75"/>
      <path d="M0 720C340 640 640 820 980 740S1420 620 1600 690V1000H0Z" fill="url(#wl-c)"/>
      <path d="M0 560C300 470 560 680 900 590S1380 420 1600 500" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="2"/>
    </svg>
    <svg class="wp wp-dark" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="wd-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0a1230"/><stop offset=".6" stop-color="#0d1f5c"/><stop offset="1" stop-color="#061032"/></linearGradient>
        <linearGradient id="wd-a" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5ea2ff" stop-opacity=".9"/><stop offset="1" stop-color="#2b4fd8" stop-opacity=".25"/></linearGradient>
        <linearGradient id="wd-b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2346c9"/><stop offset="1" stop-color="#101f70"/></linearGradient>
        <linearGradient id="wd-c" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#14287f"/><stop offset="1" stop-color="#070f3d"/></linearGradient>
        <filter id="wd-blur"><feGaussianBlur stdDeviation="22"/></filter>
      </defs>
      <rect width="1600" height="1000" fill="url(#wd-bg)"/>
      <path d="M0 420C260 300 520 520 820 430S1360 220 1600 300V1000H0Z" fill="url(#wd-a)" filter="url(#wd-blur)"/>
      <path d="M0 560C300 470 560 680 900 590S1380 420 1600 500V1000H0Z" fill="url(#wd-b)" opacity=".85"/>
      <path d="M0 720C340 640 640 820 980 740S1420 620 1600 690V1000H0Z" fill="url(#wd-c)"/>
      <path d="M0 560C300 470 560 680 900 590S1380 420 1600 500" fill="none" stroke="#8fc0ff" stroke-opacity=".5" stroke-width="2"/>
    </svg>
  </div>
</template>

<style scoped>
.wallpaper { position: absolute; inset: 0; z-index: 0; overflow: hidden; }
.wp { position: absolute; inset: 0; width: 100%; height: 100%; }
.wp-dark { display: none; }
@media (prefers-color-scheme: dark) { .wp-light { display: none; } .wp-dark { display: block; } }
</style>
