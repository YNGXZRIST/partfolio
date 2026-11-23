<script setup lang="ts">
import { onMounted } from 'vue'

/*
  Карта смещения для линзы: красный канал — горизонталь, зелёный — вертикаль.
  В середине нейтраль (128), у краёв — рампа, поэтому фон «загибается» только по кромке.
*/
const map = `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' preserveAspectRatio='none'>
<defs>
<linearGradient id='r' x1='0' x2='1' y1='0' y2='0'><stop offset='0' stop-color='rgb(0,0,0)'/><stop offset='.14' stop-color='rgb(128,0,0)'/><stop offset='.86' stop-color='rgb(128,0,0)'/><stop offset='1' stop-color='rgb(255,0,0)'/></linearGradient>
<linearGradient id='g' x1='0' x2='0' y1='0' y2='1'><stop offset='0' stop-color='rgb(0,0,0)'/><stop offset='.2' stop-color='rgb(0,128,0)'/><stop offset='.8' stop-color='rgb(0,128,0)'/><stop offset='1' stop-color='rgb(0,255,0)'/></linearGradient>
</defs>
<rect width='100' height='100' fill='url(#r)'/>
<rect width='100' height='100' fill='url(#g)' style='mix-blend-mode:screen'/>
</svg>`)}`

onMounted(() => {
  const brands = (navigator as Navigator & { userAgentData?: { brands: { brand: string }[] } }).userAgentData?.brands ?? []
  if (brands.some(b => /Chromium/i.test(b.brand))) document.documentElement.classList.add('lg-refract')
})
</script>

<template>
  <svg width="0" height="0" style="position: absolute" aria-hidden="true">
    <filter id="lg-lens" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
      <feImage :href="map" x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map" />
      <feDisplacementMap in="SourceGraphic" in2="map" scale="38" xChannelSelector="R" yChannelSelector="G" />
    </filter>
  </svg>
</template>
