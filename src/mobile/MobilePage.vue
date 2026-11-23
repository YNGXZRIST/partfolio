<script setup lang="ts">
import { ref } from 'vue'
import { profile, education } from '@/content/profile'
import { projects } from '@/content/projects'
import { jobs } from '@/content/experience'
import { stack } from '@/content/stack'
import { enabledLinks } from '@/content/links'
import { asset } from '@/lib/asset'
import ArchDiagram from '@/apps/diagrams/ArchDiagram.vue'
import { diagramFor } from '@/apps/diagrams'

const openProject = ref<string | null>(null)
const openJob = ref<number | null>(0)
const monthFmt = new Intl.DateTimeFormat('ru-RU', { month: 'short', year: 'numeric' })
const fmt = (ym: string | null) => (ym ? monthFmt.format(new Date(Number(ym.slice(0, 4)), Number(ym.slice(5, 7)) - 1)).replace(' г.', '') : 'по наст. время')
const target = (href: string) => (href.startsWith('mailto:') ? undefined : '_blank')
</script>

<template>
  <div class="m">
    <div class="m-bg" aria-hidden="true" />

    <section class="hero" data-section="hero">
      <img class="ava" :src="asset(profile.avatar)" :alt="profile.name">
      <h1>{{ profile.name }}</h1>
      <div class="headline">{{ profile.headline }}</div>
      <div class="sub">{{ profile.focus }}</div>
      <div class="sub">{{ profile.experience }} · {{ profile.stackLine }}</div>
      <div class="status"><span class="dot" />{{ profile.status }}</div>
      <div class="actions">
        <a v-for="l in enabledLinks" :key="l.id" :href="l.href" :target="target(l.href)" rel="noopener" class="act lg">
          <img :src="asset(l.icon)" alt=""><span>{{ l.label }}</span>
        </a>
      </div>
    </section>

    <section data-section="projects">
      <h2>Проекты</h2>
      <article v-for="p in projects" :key="p.slug" class="card lg" data-test="m-project">
        <header class="ph" @click="openProject = openProject === p.slug ? null : p.slug">
          <img :src="asset(p.icon)" alt="">
          <div><h3>{{ p.name }}</h3><p>{{ p.plain }}</p></div>
        </header>
        <div class="tags"><span v-for="s in p.stack" :key="s" class="mac-tag">{{ s }}</span></div>
        <ul class="feat"><li v-for="f in p.features" :key="f">{{ f }}</li></ul>
        <div class="dscroll"><ArchDiagram :diagram="diagramFor(p.slug)" /></div>
        <template v-if="openProject === p.slug">
          <p class="desc">{{ p.description }}</p>
          <ul class="det"><li v-for="d in p.details" :key="d">{{ d }}</li></ul>
        </template>
        <div class="prow">
          <button class="more" @click="openProject = openProject === p.slug ? null : p.slug">{{ openProject === p.slug ? 'Свернуть' : 'Технические детали' }}</button>
          <a class="mac-pill" :href="p.github" target="_blank" rel="noopener">GitHub</a>
        </div>
      </article>
    </section>

    <section data-section="exp">
      <h2>Опыт</h2>
      <div class="group lg">
        <div v-for="(j, i) in jobs" :key="j.company" class="job" data-test="m-job" @click="openJob = openJob === i ? null : i">
          <div class="jh"><b>{{ j.company }}</b><span>{{ fmt(j.start) }} — {{ fmt(j.end) }}</span></div>
          <div class="jr">{{ j.role }}</div>
          <ul v-if="openJob === i"><li v-for="pt in j.points" :key="pt">{{ pt }}</li></ul>
        </div>
      </div>
      <h2 class="h2s">Образование</h2>
      <div class="group lg">
        <div v-for="e in education" :key="e.title" class="job"><div class="jh"><b>{{ e.title }}</b><span>{{ e.year }}</span></div><div class="jr">{{ e.place }}</div></div>
      </div>
    </section>

    <section data-section="stack">
      <h2>Стек</h2>
      <div class="group lg">
        <div v-for="c in stack" :key="c.id" class="cat">
          <div class="ct"><span class="sq" :style="{ background: c.color }" />{{ c.title }}</div>
          <div class="tags"><span v-for="it in c.items" :key="it.name" class="mac-tag">{{ it.name }}</span></div>
        </div>
      </div>
    </section>

    <section data-section="contacts">
      <h2>Контакты</h2>
      <div class="group lg">
        <a v-for="l in enabledLinks" :key="l.id" class="crow" :href="l.href" :target="target(l.href)" rel="noopener">
          <span class="cl">{{ l.label }}</span><span class="cv">{{ l.value }}</span>
        </a>
      </div>
      <p class="foot">Откройте сайт на компьютере — там он выглядит как рабочий стол macOS.</p>
    </section>
  </div>
</template>

<style scoped>
.m { position: relative; min-height: 100vh; padding: 0 16px 40px; color: var(--text); overflow-x: hidden; }
.m-bg { position: fixed; inset: 0; z-index: -1; background: linear-gradient(160deg, #1a1660 0%, #2f3fd0 45%, #6a2bd8 100%); }
:root:not([data-theme="dark"]) .m-bg { background: linear-gradient(160deg, #c9d6ff 0%, #8f9cff 50%, #8a5bf0 100%); }
.hero { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 48px 0 12px; color: #fff; }
.ava { width: 104px; height: 104px; border-radius: 50%; object-fit: cover; box-shadow: 0 0 0 3px rgba(255,255,255,.4); }
h1 { margin: 14px 0 4px; font-size: 28px; font-weight: 800; letter-spacing: -.02em; }
.headline { font-size: 17px; font-weight: 600; }
.sub { font-size: 13px; opacity: .85; margin-top: 2px; }
.status { margin-top: 12px; display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; }
.dot { width: 8px; height: 8px; border-radius: 50%; background: #34ff6a; }
.actions { display: flex; gap: 10px; margin-top: 18px; flex-wrap: wrap; justify-content: center; }
.act { display: flex; align-items: center; gap: 8px; height: 40px; padding: 0 14px; border-radius: 20px; color: #fff; text-decoration: none; font-size: 14px; font-weight: 600; }
.act img { width: 22px; height: 22px; }
h2 { margin: 28px 4px 10px; font-size: 24px; font-weight: 800; color: #fff; letter-spacing: -.02em; }
.h2s { font-size: 20px; }
.card { border-radius: 22px; padding: 16px; margin-bottom: 14px; color: var(--text); }
:root[data-theme="dark"] .card, :root[data-theme="dark"] .group { color: #fff; }
.ph { display: flex; gap: 12px; align-items: flex-start; }
.ph img { width: 56px; height: 56px; border-radius: 13px; object-fit: cover; flex: none; }
h3 { margin: 0 0 2px; font-size: 18px; font-weight: 700; }
.ph p { margin: 0; font-size: 13.5px; line-height: 1.4; opacity: .85; }
.tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; }
.feat, .det { margin: 12px 0 0; padding-left: 18px; font-size: 13.5px; line-height: 1.5; }
.dscroll { overflow-x: auto; margin: 12px -4px 0; padding: 8px 4px; border-radius: 12px; background: var(--fill); }
.dscroll :deep(svg) { min-width: 560px; }
.desc { font-size: 13.5px; line-height: 1.5; margin: 12px 0 0; opacity: .9; }
.prow { display: flex; justify-content: space-between; align-items: center; margin-top: 14px; }
.more { border: 0; background: none; padding: 0; font-size: 14px; font-weight: 600; color: inherit; opacity: .8; }
.group { border-radius: 22px; overflow: hidden; }
.job, .cat, .crow { display: block; padding: 14px 16px; color: inherit; text-decoration: none; }
.job + .job, .cat + .cat, .crow + .crow { box-shadow: inset 0 .5px 0 var(--hairline); }
.jh { display: flex; justify-content: space-between; gap: 12px; font-size: 15px; }
.jh span { font-size: 12px; opacity: .7; white-space: nowrap; }
.jr { font-size: 13px; opacity: .8; margin-top: 2px; }
.job ul { margin: 10px 0 0; padding-left: 18px; font-size: 13px; line-height: 1.5; }
.ct { display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 15px; }
.sq { width: 14px; height: 14px; border-radius: 4px; }
.cat .tags { margin-top: 8px; }
.crow { display: flex; justify-content: space-between; font-size: 15px; }
.cl { opacity: .7; }
.foot { margin: 24px 8px 0; text-align: center; font-size: 12px; color: rgba(255,255,255,.75); }
</style>
