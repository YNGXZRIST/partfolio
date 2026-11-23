<script setup lang="ts">
import { computed } from 'vue'
import type { Diagram, DNode } from './index'

const props = defineProps<{ diagram: Diagram }>()
const byId = computed(() => new Map(props.diagram.nodes.map(n => [n.id, n])))

const overlap = (a0: number, a1: number, b0: number, b1: number) => Math.min(a1, b1) - Math.max(a0, b0) > 0

function path(a: DNode, b: DNode): { d: string; lx: number; ly: number } {
  if (overlap(a.y, a.y + a.h, b.y, b.y + b.h)) {
    const y = (Math.max(a.y, b.y) + Math.min(a.y + a.h, b.y + b.h)) / 2
    const [x1, x2] = a.x < b.x ? [a.x + a.w, b.x] : [a.x, b.x + b.w]
    return { d: `M${x1} ${y}H${x2}`, lx: (x1 + x2) / 2, ly: y - 8 }
  }
  const x = (Math.max(a.x, b.x) + Math.min(a.x + a.w, b.x + b.w)) / 2
  const [y1, y2] = a.y < b.y ? [a.y + a.h, b.y] : [a.y, b.y + b.h]
  return { d: `M${x} ${y1}V${y2}`, lx: x + 8, ly: (y1 + y2) / 2 + 4 }
}

const edges = computed(() => props.diagram.edges.map(e => ({ ...e, ...path(byId.value.get(e.from)!, byId.value.get(e.to)!) })))
</script>

<template>
  <svg class="arch" :viewBox="`0 0 ${diagram.w} ${diagram.h}`" role="img" aria-label="Схема архитектуры">
    <defs>
      <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0L10 5L0 10z" class="arrow" />
      </marker>
    </defs>
    <g v-for="(e, i) in edges" :key="i">
      <path :d="e.d" class="edge" marker-end="url(#arr)" :marker-start="e.both ? 'url(#arr)' : undefined" />
      <text v-if="e.label" :x="e.lx" :y="e.ly" class="elabel" :text-anchor="e.d.includes('H') ? 'middle' : 'start'">{{ e.label }}</text>
    </g>
    <g v-for="n in diagram.nodes" :key="n.id">
      <rect :x="n.x" :y="n.y" :width="n.w" :height="n.h" rx="12" class="node" :class="{ accent: n.accent }" />
      <text :x="n.x + n.w / 2" :y="n.y + (n.sub ? n.h / 2 - 3 : n.h / 2 + 5)" text-anchor="middle" class="nlabel">{{ n.label }}</text>
      <text v-if="n.sub" :x="n.x + n.w / 2" :y="n.y + n.h / 2 + 14" text-anchor="middle" class="nsub">{{ n.sub }}</text>
    </g>
  </svg>
</template>

<style scoped>
.arch { width: 100%; height: auto; display: block; font-family: var(--font); }
.node { fill: var(--glass-window-solid); stroke: var(--hairline); stroke-width: 1; }
.node.accent { fill: rgba(10, 132, 255, .12); stroke: rgba(10, 132, 255, .45); }
.nlabel { font-size: 14px; font-weight: 600; fill: var(--text); }
.nsub { font-size: 11px; fill: var(--text-2); }
.edge { fill: none; stroke: var(--text-3); stroke-width: 1.5; }
.arrow { fill: var(--text-3); }
.elabel { font-size: 11px; font-weight: 600; fill: var(--accent); }
</style>
