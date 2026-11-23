<script setup lang="ts">
import { computed, ref } from 'vue'
import { profile, education } from '@/content/profile'
import { projects } from '@/content/projects'
import { jobs } from '@/content/experience'
import { stack } from '@/content/stack'
import { enabledLinks } from '@/content/links'
import { asset } from '@/lib/asset'
import ArchDiagram from '@/apps/diagrams/ArchDiagram.vue'
import { diagramFor } from '@/apps/diagrams'
import CalendarIcon from '@/system/CalendarIcon.vue'

/* iPhone: домашний экран с иконками; приложение — полноэкранный стек экранов с «‹ Назад». */
type Route = { app: 'projects' | 'about' | 'stack' | 'exp' | 'contacts' } | { app: 'project'; slug: string }
const routes = ref<Route[]>([])
const top = computed(() => routes.value.at(-1) ?? null)
const dir = ref<'push' | 'pop'>('push')

const titles: Record<string, string> = { projects: 'Проекты', about: 'Обо мне', stack: 'Стек', exp: 'Опыт', contacts: 'Контакты' }
const titleOf = (r: Route) => (r.app === 'project' ? projects.find(p => p.slug === r.slug)!.name : titles[r.app])
const backLabel = computed(() => (routes.value.length > 1 ? titleOf(routes.value[routes.value.length - 2]) : 'Домой'))
const project = computed(() => (top.value?.app === 'project' ? projects.find(p => p.slug === (top.value as { slug: string }).slug)! : null))

function open(r: Route) { dir.value = 'push'; routes.value = [r] }
function push(r: Route) { dir.value = 'push'; routes.value = [...routes.value, r] }
function back() { dir.value = 'pop'; routes.value = routes.value.slice(0, -1) }
function home() { dir.value = 'pop'; routes.value = [] }

const appIcons = [
  { id: 'projects', label: 'Проекты', icon: 'finder.svg' },
  { id: 'about', label: 'Обо мне', icon: 'about.svg' },
  { id: 'stack', label: 'Стек', icon: 'gear.png' },
  { id: 'exp', label: 'Опыт', icon: '' },
] as const
const openJob = ref<number | null>(0)
const monthFmt = new Intl.DateTimeFormat('ru-RU', { month: 'short', year: 'numeric' })
const fmt = (ym: string | null) => (ym ? monthFmt.format(new Date(Number(ym.slice(0, 4)), Number(ym.slice(5, 7)) - 1)).replace(' г.', '') : 'по наст. время')
const target = (href: string) => (href.startsWith('mailto:') ? undefined : '_blank')
</script>

<template>
  <div class="ios">
    <div class="ios-bg" aria-hidden="true" />

    <!-- Домашний экран -->
    <main class="home">
      <section class="widget lg" data-test="ios-widget" @click="open({ app: 'about' })">
        <img class="w-ava" :src="asset(profile.avatar)" :alt="profile.name">
        <div class="w-lines">
          <div class="w-name">{{ profile.name }}</div>
          <div class="w-head">{{ profile.headline }}</div>
          <div class="w-sub">{{ profile.focus }}</div>
          <div class="w-sub">{{ profile.experience }} · {{ profile.stackLine }}</div>
          <div class="w-status"><span class="dot" />{{ profile.status }}</div>
        </div>
      </section>

      <div class="grid">
        <button v-for="a in appIcons" :key="a.id" class="icon" data-test="ios-icon" :data-app="a.id" @click="open({ app: a.id })">
          <span class="ico"><CalendarIcon v-if="a.id === 'exp'" /><img v-else :src="asset(a.icon)" alt=""></span>
          <span class="lbl">{{ a.label }}</span>
        </button>
        <button v-for="p in projects" :key="p.slug" class="icon" data-test="ios-icon" :data-app="`project:${p.slug}`" @click="open({ app: 'project', slug: p.slug })">
          <span class="ico"><img :src="asset(p.icon)" alt="" class="round"></span>
          <span class="lbl">{{ p.name }}</span>
        </button>
      </div>

      <nav class="dock lg" data-test="ios-dock">
        <button class="icon" data-test="ios-icon" data-app="contacts" @click="open({ app: 'contacts' })">
          <span class="ico"><img :src="asset('vcard.png')" alt=""></span><span class="sr">Контакты</span>
        </button>
        <a v-for="l in enabledLinks" :key="l.id" class="icon" :href="l.href" :target="target(l.href)" rel="noopener">
          <span class="ico"><img :src="asset(l.icon)" alt=""></span><span class="sr">{{ l.label }}</span>
        </a>
      </nav>
    </main>

    <!-- Открытое приложение -->
    <Transition name="ios-open">
      <section v-if="top" class="app" data-test="ios-app">
        <header class="nav">
          <button class="back" data-test="ios-back" @click="back"><svg viewBox="0 0 12 20"><path d="M10 2L2 10l8 8" /></svg>{{ backLabel }}</button>
        </header>
        <Transition :name="dir === 'push' ? 'ios-push' : 'ios-pop'" mode="out-in">
          <div :key="routes.length + ':' + titleOf(top)" class="screen">
            <h1>{{ titleOf(top) }}</h1>

            <!-- Проекты: список -->
            <template v-if="top.app === 'projects'">
              <div class="group">
                <button v-for="p in projects" :key="p.slug" class="row link" data-test="m-project" @click="push({ app: 'project', slug: p.slug })">
                  <img :src="asset(p.icon)" alt="" class="row-ico">
                  <span class="row-t"><b>{{ p.name }}</b><small>{{ p.plain }}</small></span>
                  <svg class="chev" viewBox="0 0 8 14"><path d="M1 1l6 6-6 6" /></svg>
                </button>
              </div>
            </template>

            <!-- Страница проекта -->
            <template v-else-if="project">
              <div class="p-head">
                <img :src="asset(project.icon)" alt="">
                <div><p>{{ project.plain }}</p><a class="ios-pill" :href="project.github" target="_blank" rel="noopener">Открыть на GitHub</a></div>
              </div>
              <div class="info">
                <div v-for="f in project.info" :key="f.label"><small>{{ f.label }}</small><b>{{ f.value }}</b></div>
              </div>
              <h2>Что умеет</h2>
              <div class="group"><div v-for="f in project.features" :key="f" class="row"><span class="check">✓</span><span>{{ f }}</span></div></div>
              <h2>Как устроено</h2>
              <div class="group pad"><div class="dscroll"><ArchDiagram :diagram="diagramFor(project.slug)" /></div><p class="note">{{ project.archNote }}</p></div>
              <h2>Технические детали</h2>
              <div class="group pad"><p class="note">{{ project.description }}</p><ul><li v-for="d in project.details" :key="d">{{ d }}</li></ul></div>
              <div class="tags"><span v-for="s in project.stack" :key="s" class="tag">{{ s }}</span></div>
            </template>

            <!-- Обо мне -->
            <template v-else-if="top.app === 'about'">
              <div class="hero"><img :src="asset(profile.avatar)" alt=""><b>{{ profile.headline }}</b><span>{{ profile.focus }}</span><span class="pill-ok"><span class="dot" />{{ profile.status }}</span></div>
              <div class="group"><div v-for="f in profile.facts" :key="f.label" class="row kv"><span>{{ f.label }}</span><span class="v">{{ f.value }}</span></div></div>
              <h2>Образование</h2>
              <div class="group"><div v-for="e in education" :key="e.title" class="row kv"><span class="row-t"><b>{{ e.title }}</b><small>{{ e.place }}</small></span><span class="v">{{ e.year }}</span></div></div>
              <template v-for="a in profile.about" :key="a.title"><h2>{{ a.title }}</h2><div class="group pad"><p class="note">{{ a.text }}</p></div></template>
            </template>

            <!-- Стек -->
            <template v-else-if="top.app === 'stack'">
              <template v-for="c in stack" :key="c.id">
                <h2 class="cat"><span class="sq" :style="{ background: c.color }" />{{ c.title }}</h2>
                <div class="group"><div v-for="it in c.items" :key="it.name" class="row kv"><span>{{ it.name }}</span><span v-if="it.note" class="v">{{ it.note }}</span></div></div>
              </template>
            </template>

            <!-- Опыт -->
            <template v-else-if="top.app === 'exp'">
              <div class="group">
                <div v-for="(j, i) in jobs" :key="j.company" class="row job" data-test="m-job" @click="openJob = openJob === i ? null : i">
                  <div class="kv"><b>{{ j.company }}</b><span class="v">{{ fmt(j.start) }} — {{ fmt(j.end) }}</span></div>
                  <small>{{ j.role }}</small>
                  <ul v-if="openJob === i"><li v-for="pt in j.points" :key="pt">{{ pt }}</li></ul>
                </div>
              </div>
            </template>

            <!-- Контакты -->
            <template v-else-if="top.app === 'contacts'">
              <div class="hero"><img :src="asset(profile.avatar)" alt=""><b>{{ profile.name }}</b><span>{{ profile.headline }} · Калининград</span></div>
              <div class="acts"><a v-for="l in enabledLinks" :key="l.id" :href="l.href" :target="target(l.href)" rel="noopener" class="act"><img :src="asset(l.icon)" alt=""><span>{{ l.label }}</span></a></div>
              <div class="group"><a v-for="l in enabledLinks" :key="l.id" class="row kv link" :href="l.href" :target="target(l.href)" rel="noopener"><span>{{ l.label }}</span><span class="v">{{ l.value }}</span></a></div>
            </template>
          </div>
        </Transition>
        <button class="home-ind" data-test="ios-home" aria-label="Домой" @click="home"><span /></button>
      </section>
    </Transition>
  </div>
</template>

<style scoped>
.ios { position: relative; isolation: isolate; min-height: 100vh; color: #fff; overflow-x: hidden; -webkit-tap-highlight-color: transparent; }
.ios-bg { position: fixed; inset: 0; z-index: -1; background: radial-gradient(120% 70% at 20% 0%, #4b6bff 0%, transparent 60%), linear-gradient(165deg, #1a1660 0%, #3a2fd0 50%, #7a2bd8 100%); }
:root:not([data-theme="dark"]) .ios-bg { background: radial-gradient(120% 70% at 20% 0%, #dfe6ff 0%, transparent 60%), linear-gradient(165deg, #b9c6ff 0%, #8a8cff 50%, #9a5bf0 100%); }
button { font: inherit; color: inherit; background: none; border: 0; padding: 0; }
.sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }

/* домашний экран */
.home { padding: calc(env(safe-area-inset-top) + 18px) 18px 130px; }
.widget { display: flex; gap: 14px; padding: 16px; border-radius: 24px; text-align: left; }
.w-ava { width: 64px; height: 64px; border-radius: 50%; object-fit: cover; flex: none; box-shadow: 0 0 0 2px rgba(255,255,255,.45); }
.w-name { font-size: 18px; font-weight: 700; }
.w-head { font-size: 14px; font-weight: 600; }
.w-sub { font-size: 12px; opacity: .85; }
.w-status { margin-top: 6px; display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; }
.dot { width: 7px; height: 7px; border-radius: 50%; background: #34ff6a; display: inline-block; }
:root:not([data-theme="dark"]) .widget { color: #1d1d1f; }
:root:not([data-theme="dark"]) .widget .dot { background: #1fbf4a; }
.grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 22px 8px; margin-top: 26px; }
.icon { display: flex; flex-direction: column; align-items: center; gap: 6px; text-decoration: none; color: #fff; }
.ico { width: 62px; height: 62px; display: block; transition: transform .15s; }
.icon:active .ico { transform: scale(.9); filter: brightness(.8); }
.ico img, .ico :deep(svg) { width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 3px 6px rgba(0,0,0,.25)); }
.ico img.round { border-radius: 15px; object-fit: cover; }
.lbl { font-size: 11.5px; font-weight: 500; text-align: center; max-width: 76px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-shadow: 0 1px 3px rgba(0,0,0,.4); }
.dock { position: fixed; left: 12px; right: 12px; bottom: calc(env(safe-area-inset-bottom) + 12px); display: flex; justify-content: space-around; padding: 14px 10px; border-radius: 32px; }

/* приложение */
.app { position: fixed; inset: 0; z-index: 10; overflow-y: auto; background: var(--ios-bg); color: var(--text); --ios-bg: #f2f2f7; --cell: #fff; }
:root[data-theme="dark"] .app { --ios-bg: #000; --cell: #1c1c1e; }
.nav { position: sticky; top: 0; z-index: 2; height: calc(env(safe-area-inset-top) + 44px); padding: env(safe-area-inset-top) 8px 0; display: flex; align-items: center;
  background: color-mix(in srgb, var(--ios-bg) 80%, transparent); backdrop-filter: blur(20px) saturate(180%); -webkit-backdrop-filter: blur(20px) saturate(180%); }
.back { display: flex; align-items: center; gap: 4px; color: #0a84ff; font-size: 17px; }
.back svg { width: 12px; height: 20px; fill: none; stroke: currentColor; stroke-width: 2.6; stroke-linecap: round; stroke-linejoin: round; }
.screen { padding: 0 16px 90px; }
h1 { margin: 4px 4px 14px; font-size: 34px; font-weight: 800; letter-spacing: -.02em; }
h2 { margin: 24px 16px 8px; font-size: 13px; font-weight: 500; text-transform: uppercase; color: var(--text-2); }
h2.cat { display: flex; align-items: center; gap: 8px; }
.sq { width: 12px; height: 12px; border-radius: 3px; }
.group { background: var(--cell); border-radius: 12px; overflow: hidden; }
.group.pad { padding: 12px 16px; }
.row { display: flex; align-items: center; gap: 12px; width: 100%; min-height: 44px; padding: 10px 16px; text-align: left; font-size: 16px; color: inherit; text-decoration: none; }
.row + .row { box-shadow: inset 16px .5px 0 var(--cell), inset 0 .5px 0 var(--hairline); }
.kv { display: flex; justify-content: space-between; gap: 12px; width: 100%; }
.v { color: var(--text-2); text-align: right; }
.row-ico { width: 44px; height: 44px; border-radius: 10px; object-fit: cover; flex: none; }
.row-t { display: flex; flex-direction: column; min-width: 0; flex: 1; }
.row-t small, .job small { font-size: 13px; color: var(--text-2); }
.chev { width: 8px; height: 14px; flex: none; fill: none; stroke: var(--text-3); stroke-width: 2; }
.job { flex-direction: column; align-items: stretch; gap: 2px; }
.job ul, .group ul { margin: 8px 0 0; padding-left: 18px; font-size: 14px; line-height: 1.5; }
.note { margin: 0; font-size: 15px; line-height: 1.5; }
.check { color: #0a84ff; font-weight: 700; }
.p-head { display: flex; gap: 14px; align-items: flex-start; margin-bottom: 16px; }
.p-head img { width: 84px; height: 84px; border-radius: 19px; object-fit: cover; flex: none; }
.p-head p { margin: 0 0 10px; font-size: 15px; line-height: 1.4; color: var(--text-2); }
.ios-pill { display: inline-flex; height: 30px; align-items: center; padding: 0 16px; border-radius: 15px; background: #0a84ff; color: #fff; font-size: 15px; font-weight: 600; text-decoration: none; }
.info { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; border-radius: 12px; overflow: hidden; background: var(--hairline); }
.info div { background: var(--cell); padding: 10px 14px; display: flex; flex-direction: column; }
.info small { font-size: 11px; font-weight: 600; text-transform: uppercase; color: var(--text-3); }
.info b { font-size: 15px; }
.dscroll { overflow-x: auto; margin: 0 -8px 10px; padding: 4px 8px; }
.dscroll :deep(svg) { min-width: 560px; }
.tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 16px; }
.tag { padding: 4px 10px; border-radius: 12px; background: var(--cell); font-size: 13px; }
.hero { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 4px; margin-bottom: 20px; }
.hero img { width: 110px; height: 110px; border-radius: 50%; object-fit: cover; margin-bottom: 8px; }
.hero b { font-size: 18px; }
.hero span { font-size: 14px; color: var(--text-2); }
.pill-ok { margin-top: 8px; display: inline-flex !important; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 14px; background: rgba(40,200,64,.15); color: #1f9d3a !important; font-weight: 600; font-size: 13px !important; }
.acts { display: flex; justify-content: center; gap: 12px; margin-bottom: 20px; }
.act { flex: 1; max-width: 110px; display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 10px 0; border-radius: 12px; background: var(--cell); color: var(--text); text-decoration: none; font-size: 12px; }
.act img { width: 28px; height: 28px; }
.home-ind { position: fixed; left: 0; right: 0; bottom: 0; z-index: 3; height: calc(env(safe-area-inset-bottom) + 26px); display: flex; justify-content: center; align-items: center; }
.home-ind span { width: 134px; height: 5px; border-radius: 3px; background: var(--text); opacity: .85; }

/* анимации как в iOS */
.ios-open-enter-active, .ios-open-leave-active { transition: transform .38s cubic-bezier(.2, .9, .3, 1), opacity .3s, border-radius .38s; }
.ios-open-enter-from, .ios-open-leave-to { transform: scale(.86); opacity: 0; border-radius: 40px; }
.ios-push-enter-active, .ios-push-leave-active, .ios-pop-enter-active, .ios-pop-leave-active { transition: transform .28s cubic-bezier(.2, .9, .3, 1), opacity .2s; }
.ios-push-enter-from { transform: translateX(40%); opacity: 0; }
.ios-push-leave-to { transform: translateX(-20%); opacity: 0; }
.ios-pop-enter-from { transform: translateX(-20%); opacity: 0; }
.ios-pop-leave-to { transform: translateX(40%); opacity: 0; }
</style>
