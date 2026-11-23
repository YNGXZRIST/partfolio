import { gsap } from 'gsap'

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return true
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

const done = () => Promise.resolve()

export function animateOpen(el: HTMLElement): Promise<void> {
  if (prefersReducedMotion()) return done()
  return new Promise(res => {
    gsap.fromTo(el, { scale: 0.92, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.26, ease: 'power3.out', clearProps: 'transform,opacity', onComplete: res })
  })
}

/** Окно появляется со стороны иконки: равномерный зум без искажений, лёгкий сдвиг от точки нажатия. */
export function animateOpenFrom(el: HTMLElement, from: DOMRect): Promise<void> {
  if (prefersReducedMotion()) return done()
  const to = el.getBoundingClientRect()
  if (!to.width || !to.height) return animateOpen(el)
  const dx = (from.left + from.width / 2 - (to.left + to.width / 2)) * 0.25
  const dy = (from.top + from.height / 2 - (to.top + to.height / 2)) * 0.25
  return new Promise(res => {
    gsap.fromTo(el,
      { x: dx, y: dy, scale: 0.86, opacity: 0 },
      { x: 0, y: 0, scale: 1, opacity: 1, duration: 0.3, ease: 'power3.out', clearProps: 'transform,opacity', onComplete: res })
  })
}

/**
 * «Джинн» как в macOS: низ окна воронкой сужается к иконке Dock, бока изгибаются S-кривой,
 * верх догоняет с запаздыванием, содержимое «стекает» вниз. Силуэт — clip-path polygon по кадрам.
 */
function genieFrame(el: HTMLElement, w: DOMRect, to: DOMRect, p: number) {
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t
  const smooth = (t: number) => t * t * (3 - 2 * t)
  const clamp01 = (t: number) => Math.min(1, Math.max(0, t))
  const pb = smooth(clamp01(p / 0.6))          // низ уходит первым
  const pt = smooth(clamp01((p - 0.25) / 0.75)) // верх догоняет
  const tl = to.left + to.width / 2 - to.width * 0.35
  const tr = to.left + to.width / 2 + to.width * 0.35
  const ty = to.top + to.height * 0.25
  const topY = lerp(w.top, ty, pt)
  const botY = lerp(w.bottom, to.top + to.height * 0.6, pb)
  const topL = lerp(w.left, tl, pt), topR = lerp(w.right, tr, pt)
  const botL = lerp(w.left, tl, pb), botR = lerp(w.right, tr, pb)
  const dy = topY - w.top
  const N = 18
  const left: string[] = [], right: string[] = []
  for (let k = 0; k <= N; k++) {
    const f = k / N
    const y = lerp(topY, botY, f) - w.top - dy
    const t = smooth(f)
    left.push(`${lerp(topL, botL, t) - w.left}px ${y}px`)
    right.push(`${lerp(topR, botR, t) - w.left}px ${y}px`)
  }
  el.style.transform = `translateY(${dy}px)`
  el.style.clipPath = `polygon(${[...left, ...right.reverse()].join(',')})`
  el.style.opacity = String(1 - Math.max(0, p - 0.85) / 0.15 * 0.6)
}

function runGenie(el: HTMLElement, to: DOMRect, from: number, target: number, duration: number): Promise<void> {
  const w = el.getBoundingClientRect()
  const state = { p: from }
  genieFrame(el, w, to, from)
  return new Promise(res => {
    gsap.to(state, {
      p: target, duration, ease: 'power1.inOut',
      onUpdate: () => genieFrame(el, w, to, state.p),
      onComplete: () => { el.style.clipPath = ''; el.style.transform = ''; el.style.opacity = ''; res() },
    })
  })
}

export function animateMinimize(el: HTMLElement, to: DOMRect): Promise<void> {
  if (prefersReducedMotion()) return done()
  return runGenie(el, to, 0, 1, 0.6)
}

export function animateRestore(el: HTMLElement, from: DOMRect): Promise<void> {
  if (prefersReducedMotion()) { clearAnim(el); return done() }
  return runGenie(el, from, 1, 0, 0.5)
}

export function clearAnim(el: HTMLElement) {
  gsap.set(el, { clearProps: 'transform,opacity' })
  el.style.clipPath = ''
}
