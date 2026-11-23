<script setup lang="ts">
export interface MenuItem { label: string; action?: () => void; href?: string; separator?: boolean; hint?: string }
defineProps<{ items: MenuItem[] }>()
const emit = defineEmits<{ done: [] }>()
function run(it: MenuItem) { it.action?.(); emit('done') }
</script>

<template>
  <div class="dropdown lg lg-dense" data-test="dropdown" role="menu">
    <template v-for="(it, i) in items" :key="i">
      <div v-if="it.separator" class="sep" />
      <a v-else-if="it.href" class="item" data-test="menu-item" role="menuitem" :href="it.href"
         :target="it.href.startsWith('mailto:') ? undefined : '_blank'" rel="noopener" @click="emit('done')">
        <span>{{ it.label }}</span><span v-if="it.hint" class="hint">{{ it.hint }}</span>
      </a>
      <button v-else class="item" data-test="menu-item" role="menuitem" @click="run(it)">
        <span>{{ it.label }}</span><span v-if="it.hint" class="hint">{{ it.hint }}</span>
      </button>
    </template>
  </div>
</template>

<style scoped>
.dropdown {
  position: absolute; top: calc(100% + 4px); left: -6px; min-width: 240px;
  padding: 5px; border-radius: 12px; z-index: 9500;
  display: flex; flex-direction: column; color: var(--text); text-shadow: none;
}
.item {
  display: flex; align-items: center; justify-content: space-between; gap: 24px;
  height: 24px; padding: 0 10px; border: 0; border-radius: 6px; background: none;
  font-size: 13px; font-weight: 400; text-align: left; color: inherit; text-decoration: none; cursor: default; white-space: nowrap;
}
.item:hover { background: var(--accent); color: #fff; }
.item:hover .hint { color: rgba(255,255,255,.8); }
.hint { color: var(--text-3); font-size: 12px; }
.sep { height: 1px; margin: 4px 10px; background: var(--hairline); }
</style>
