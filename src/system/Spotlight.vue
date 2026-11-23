<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { search, type SearchItem } from '@/lib/search'
import { searchIndex } from '@/content/searchIndex'
import { useWindows } from '@/stores/windows'
import { asset } from '@/lib/asset'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ 'update:open': [boolean] }>()
const wm = useWindows()
const q = ref('')
const sel = ref(0)
const input = ref<HTMLInputElement | null>(null)
const results = computed(() => search(q.value, searchIndex))

watch(results, () => (sel.value = 0))
watch(() => props.open, async o => { if (o) { q.value = ''; await nextTick(); input.value?.focus() } })

function close() { emit('update:open', false) }
function choose(r: SearchItem | undefined) { if (!r) return; wm.activate(r.target); close() }

const typing = (t: EventTarget | null) => t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))

/**
 * ⌘+Пробел на macOS забирает система — до страницы не доходит. Поэтому, как принято в вебе:
 * ⌘K / Ctrl+K и «/» (если не печатаем в поле); ⌘/Ctrl+Пробел оставлен для Windows/Linux.
 */
function onGlobalKey(e: KeyboardEvent) {
  if (e.repeat) return
  const mod = e.metaKey || e.ctrlKey
  if (mod && (e.code === 'Space' || e.key === ' ' || e.code === 'KeyK' || e.key.toLowerCase() === 'k')) {
    e.preventDefault(); emit('update:open', !props.open); return
  }
  if (e.key === '/' && !mod && !props.open && !typing(e.target)) { e.preventDefault(); emit('update:open', true); return }
  if (e.key === 'Escape' && props.open) close()
}
function onInputKey(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') { e.preventDefault(); sel.value = Math.min(sel.value + 1, results.value.length - 1) }
  else if (e.key === 'ArrowUp') { e.preventDefault(); sel.value = Math.max(sel.value - 1, 0) }
  else if (e.key === 'Enter') choose(results.value[sel.value])
}
onMounted(() => document.addEventListener('keydown', onGlobalKey))
onBeforeUnmount(() => document.removeEventListener('keydown', onGlobalKey))
</script>

<template>
  <div v-if="open" class="sp-backdrop" data-test="spotlight-backdrop" @pointerdown.self="close">
    <div class="sp lg lg-dense" role="dialog" aria-label="Spotlight">
      <div class="sp-field">
        <svg viewBox="0 0 15 15" class="sp-ico"><circle cx="6.2" cy="6.2" r="4.9" /><path d="M9.9 9.9l3.6 3.6" /></svg>
        <input ref="input" v-model="q" placeholder="Поиск: Go, RabbitMQ, проекты, опыт…  (⌘K)" spellcheck="false" @keydown="onInputKey">
      </div>
      <ul v-if="results.length" class="sp-list">
        <li v-for="(r, i) in results" :key="r.id" class="sp-item" :class="{ on: i === sel }" data-test="result" @mouseenter="sel = i" @click="choose(r)">
          <img :src="asset(r.icon)" alt="">
          <div class="sp-t"><div class="sp-title">{{ r.title }}</div><div class="sp-sub">{{ r.subtitle }}</div></div>
          <span class="sp-group">{{ r.group }}</span>
        </li>
      </ul>
      <div v-else-if="q.trim()" class="sp-empty">Ничего не найдено</div>
    </div>
  </div>
</template>

<style scoped>
.sp-backdrop { position: absolute; inset: 0; z-index: 9800; }
.sp { position: absolute; top: 18%; left: 50%; transform: translateX(-50%); width: min(640px, calc(100vw - 32px)); border-radius: 26px; overflow: hidden; color: var(--text); }
.sp-field { display: flex; align-items: center; gap: 12px; height: 58px; padding: 0 20px; }
.sp-ico { width: 20px; height: 20px; flex: none; fill: none; stroke: var(--text-2); stroke-width: 1.7; stroke-linecap: round; }
input { flex: 1; min-width: 0; border: 0; outline: 0; background: none; font: inherit; font-size: 22px; color: var(--text); }
input::placeholder { color: var(--text-3); }
.sp-list { list-style: none; margin: 0; padding: 6px 8px 8px; border-top: .5px solid var(--hairline); max-height: 420px; overflow: auto; }
.sp-item { display: flex; align-items: center; gap: 12px; padding: 7px 10px; border-radius: 10px; cursor: default; }
.sp-item.on { background: var(--accent); color: #fff; }
.sp-item img { width: 32px; height: 32px; border-radius: 7px; object-fit: contain; flex: none; }
.sp-t { min-width: 0; flex: 1; }
.sp-title { font-size: 14px; font-weight: 600; }
.sp-sub { font-size: 12px; color: var(--text-2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sp-item.on .sp-sub, .sp-item.on .sp-group { color: rgba(255,255,255,.8); }
.sp-group { font-size: 11px; color: var(--text-3); flex: none; }
.sp-empty { padding: 14px 20px 18px; border-top: .5px solid var(--hairline); color: var(--text-2); }
</style>
