<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import Desktop from './system/Desktop.vue'
import MobilePage from './mobile/MobilePage.vue'

const QUERY = '(max-width: 768px)'
const mq = typeof window !== 'undefined' && typeof window.matchMedia === 'function' ? window.matchMedia(QUERY) : null
const narrow = ref(mq?.matches ?? false)
const onChange = (e: MediaQueryListEvent) => (narrow.value = e.matches)
onMounted(() => mq?.addEventListener('change', onChange))
onBeforeUnmount(() => mq?.removeEventListener('change', onChange))
</script>

<template>
  <MobilePage v-if="narrow" />
  <Desktop v-else />
</template>
