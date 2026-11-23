<script setup lang="ts">
import AppWindow from './AppWindow.vue'
import type { AppId, WindowId } from '@/content/types'
import { appById } from '@/content/apps'
import { projects } from '@/content/projects'

const props = defineProps<{ id: WindowId }>()
const title = props.id.startsWith('project:')
  ? projects.find(p => `project:${p.slug}` === props.id)?.name ?? props.id
  : appById(props.id as AppId).title
</script>

<template>
  <AppWindow :id="id" :title="title"><p style="padding: 20px">Скоро</p></AppWindow>
</template>
