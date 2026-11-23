<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { prefersReducedMotion } from '@/lib/motion'

const el = ref<HTMLElement | null>(null)
onMounted(() => {
  if (el.value && !prefersReducedMotion())
    gsap.fromTo(el.value, { opacity: 0, y: 12, filter: 'blur(6px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, ease: 'power2.out', delay: 0.2 })
})
</script>

<template>
  <h1 ref="el" class="welcome" data-test="welcome">добро пожаловать</h1>
</template>

<style scoped>
.welcome {
  position: absolute; left: 50%; top: 42%; transform: translate(-50%, -50%);
  margin: 0; z-index: 1; pointer-events: none; white-space: nowrap;
  font-family: var(--font-hand); font-weight: 400;
  font-size: clamp(56px, 9vw, 132px); line-height: 1;
  color: rgba(255, 255, 255, .96);
  text-shadow: 0 2px 24px rgba(10, 40, 120, .35);
}
</style>
