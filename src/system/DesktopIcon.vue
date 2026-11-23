<script setup lang="ts">
defineProps<{ label: string; icon: string; selected?: boolean }>()
defineEmits<{ select: []; open: [] }>()
</script>

<template>
  <div class="dicon" :class="{ selected }" data-test="desktop-icon" @click.stop="$emit('select')" @dblclick.stop="$emit('open')">
    <div class="glyph"><img :src="icon" alt=""></div>
    <div class="label">{{ label }}</div>
  </div>
</template>

<style scoped>
.dicon { width: 96px; display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: default; user-select: none; }
.glyph { width: 68px; height: 68px; padding: 4px; border-radius: 8px; display: grid; place-items: center; }
.glyph img { width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 2px 4px rgba(0,0,0,.25)); }
.label { max-width: 96px; padding: 1px 5px; border-radius: 4px; font-size: 12px; font-weight: 500; text-align: center; color: #fff; text-shadow: 0 1px 3px rgba(0,0,0,.6); overflow-wrap: anywhere; }
.selected .glyph { background: rgba(0, 0, 0, .22); box-shadow: inset 0 0 0 1px rgba(255,255,255,.25); }
.selected .label { background: var(--accent); text-shadow: none; }
</style>
