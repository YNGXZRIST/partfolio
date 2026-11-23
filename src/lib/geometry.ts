export interface Rect { x: number; y: number; w: number; h: number }

export const MIN_W = 420
export const MIN_H = 300
const VISIBLE_X = 120
/** Под Dock (≈92px) плюс высота заголовка окна (52px): заголовок всегда остаётся над Dock. */
export const DOCK_RESERVE = 92
const TITLEBAR_H = 52
const BOTTOM_GRIP = DOCK_RESERVE + TITLEBAR_H

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), Math.max(lo, hi))

/** Держит окно достижимым: заголовок не уходит под меню-бар и за края экрана. */
export function clampRect(r: Rect, vp: { w: number; h: number }, menuBarH = 28): Rect {
  const w = clamp(r.w, MIN_W, vp.w)
  const h = clamp(r.h, MIN_H, vp.h - menuBarH)
  const x = clamp(r.x, VISIBLE_X - w, vp.w - VISIBLE_X)
  const y = clamp(r.y, menuBarH, vp.h - BOTTOM_GRIP)
  return { x, y, w, h }
}
