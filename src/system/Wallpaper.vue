<template>
  <div class="wallpaper" aria-hidden="true">
    <svg class="wp wp-light" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="wl-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#c9d6ff" /><stop offset=".45" stop-color="#9aa8ff" /><stop offset="1" stop-color="#6a4fe0" />
        </linearGradient>
        <linearGradient id="wl-r1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#4f7bff" /><stop offset=".55" stop-color="#5b4dff" /><stop offset="1" stop-color="#8a3df0" />
        </linearGradient>
        <linearGradient id="wl-r2" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stop-color="#2f4fe0" /><stop offset="1" stop-color="#b06bff" />
        </linearGradient>
        <linearGradient id="wl-sheen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#fff" stop-opacity="0" /><stop offset=".5" stop-color="#fff" stop-opacity=".75" /><stop offset="1" stop-color="#fff" stop-opacity="0" />
        </linearGradient>
        <filter id="wl-b40"><feGaussianBlur stdDeviation="40" /></filter>
        <filter id="wl-b12"><feGaussianBlur stdDeviation="12" /></filter>
      </defs>
      <rect width="1600" height="1000" fill="url(#wl-bg)" />
      <ellipse cx="260" cy="180" rx="520" ry="300" fill="#e9e4ff" opacity=".7" filter="url(#wl-b40)" />
      <path d="M-100 1000C200 760 420 520 760 470S1300 380 1700 120V1000Z" fill="url(#wl-r1)" opacity=".85" filter="url(#wl-b12)" />
      <path d="M-100 1000C300 850 600 700 940 660S1400 600 1700 430V1000Z" fill="url(#wl-r2)" opacity=".9" />
      <path d="M-100 1000C200 760 420 520 760 470S1300 380 1700 120" fill="none" stroke="url(#wl-sheen)" stroke-width="3" />
      <path d="M-100 1060C320 880 640 760 980 720S1420 650 1700 520" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.5" />
    </svg>
    <svg class="wp wp-dark" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="wd-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#0b0f2e" /><stop offset=".5" stop-color="#1a1660" /><stop offset="1" stop-color="#2a0f55" />
        </linearGradient>
        <linearGradient id="wd-r1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#2f5cff" /><stop offset=".55" stop-color="#4b33d6" /><stop offset="1" stop-color="#7a2cd8" />
        </linearGradient>
        <linearGradient id="wd-r2" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stop-color="#14205e" /><stop offset="1" stop-color="#5a2aa8" />
        </linearGradient>
        <linearGradient id="wd-sheen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#9fb8ff" stop-opacity="0" /><stop offset=".5" stop-color="#c8b8ff" stop-opacity=".7" /><stop offset="1" stop-color="#9fb8ff" stop-opacity="0" />
        </linearGradient>
        <filter id="wd-b40"><feGaussianBlur stdDeviation="40" /></filter>
        <filter id="wd-b12"><feGaussianBlur stdDeviation="12" /></filter>
      </defs>
      <rect width="1600" height="1000" fill="url(#wd-bg)" />
      <ellipse cx="300" cy="200" rx="520" ry="300" fill="#3b4cff" opacity=".35" filter="url(#wd-b40)" />
      <path d="M-100 1000C200 760 420 520 760 470S1300 380 1700 120V1000Z" fill="url(#wd-r1)" opacity=".8" filter="url(#wd-b12)" />
      <path d="M-100 1000C300 850 600 700 940 660S1400 600 1700 430V1000Z" fill="url(#wd-r2)" opacity=".95" />
      <path d="M-100 1000C200 760 420 520 760 470S1300 380 1700 120" fill="none" stroke="url(#wd-sheen)" stroke-width="3" />
      <path d="M-100 1060C320 880 640 760 980 720S1420 650 1700 520" fill="none" stroke="#b9a8ff" stroke-opacity=".3" stroke-width="1.5" />
    </svg>
  </div>
</template>

<style scoped>
.wallpaper { position: absolute; inset: 0; z-index: 0; overflow: hidden; }
.wp { position: absolute; inset: 0; width: 100%; height: 100%; }
.wp-dark { display: none; }
@media (prefers-color-scheme: dark) { .wp-light { display: none; } .wp-dark { display: block; } }
</style>
