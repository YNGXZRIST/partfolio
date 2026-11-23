import { gsap } from 'gsap'

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return true
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

const done = () => Promise.resolve()

export function animateOpen(el: HTMLElement): Promise<void> {
  if (prefersReducedMotion()) return done()
  return new Promise(res => {
    gsap.fromTo(el, { scale: 0.94, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.24, ease: 'power2.out', clearProps: 'transform,opacity', onComplete: res })
  })
}

/** Окно раскрывается из иконки, по которой нажали (как в macOS). */
export function animateOpenFrom(el: HTMLElement, from: DOMRect): Promise<void> {
  if (prefersReducedMotion()) return done()
  const to = el.getBoundingClientRect()
  if (!to.width || !to.height) return animateOpen(el)
  const dx = from.left + from.width / 2 - (to.left + to.width / 2)
  const dy = from.top + from.height / 2 - (to.top + to.height / 2)
  return new Promise(res => {
    gsap.fromTo(el,
      { x: dx, y: dy, scaleX: from.width / to.width, scaleY: from.height / to.height, opacity: 0.3, transformOrigin: '50% 50%' },
      { x: 0, y: 0, scaleX: 1, scaleY: 1, opacity: 1, duration: 0.38, ease: 'power3.out', clearProps: 'transform,opacity', onComplete: res })
  })
}

/** «Джинн»: окно стягивается к иконке в Dock, сужаясь снизу. */
export function animateMinimize(el: HTMLElement, to: DOMRect): Promise<void> {
  if (prefersReducedMotion()) return done()
  const from = el.getBoundingClientRect()
  const dx = to.left + to.width / 2 - (from.left + from.width / 2)
  const dy = to.top + to.height / 2 - (from.top + from.height / 2)
  return new Promise(res => {
    gsap.timeline({ onComplete: res })
      .to(el, { scaleX: 0.45, skewX: dx > 0 ? 6 : -6, transformOrigin: '50% 100%', duration: 0.18, ease: 'power1.in' })
      .to(el, { x: dx, y: dy, scaleX: 0.06, scaleY: 0.04, skewX: 0, opacity: 0.2, duration: 0.32, ease: 'power2.in' })
  })
}

export function animateRestore(el: HTMLElement, from: DOMRect): Promise<void> {
  if (prefersReducedMotion()) { gsap.set(el, { clearProps: 'all' }); return done() }
  const to = el.getBoundingClientRect()
  const dx = from.left + from.width / 2 - (to.left + to.width / 2)
  const dy = from.top + from.height / 2 - (to.top + to.height / 2)
  return new Promise(res => {
    gsap.fromTo(el,
      { x: dx, y: dy, scaleX: 0.06, scaleY: 0.04, opacity: 0.2, transformOrigin: '50% 100%' },
      { x: 0, y: 0, scaleX: 1, scaleY: 1, opacity: 1, duration: 0.4, ease: 'power3.out', clearProps: 'transform,opacity', onComplete: res })
  })
}

export function clearAnim(el: HTMLElement) {
  gsap.set(el, { clearProps: 'transform,opacity' })
}
