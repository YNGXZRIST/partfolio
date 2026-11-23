import { beforeEach, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Spotlight from '@/system/Spotlight.vue'
import { useWindows, resetWindows } from '@/stores/windows'

beforeEach(() => resetWindows())
const mk = (open = false) => mount(Spotlight, { props: { open }, attachTo: document.body })

it('⌘/Ctrl+Пробел открывают и не уходят в браузер', async () => {
  const c = mk()
  const e = new KeyboardEvent('keydown', { key: ' ', code: 'Space', metaKey: true, cancelable: true })
  document.dispatchEvent(e)
  expect(e.defaultPrevented).toBe(true)
  expect(c.emitted('update:open')?.at(-1)).toEqual([true])
  const e2 = new KeyboardEvent('keydown', { key: ' ', code: 'Space', ctrlKey: true, cancelable: true })
  document.dispatchEvent(e2)
  expect(e2.defaultPrevented).toBe(true)
  c.unmount()
})

it('поиск, стрелки, Enter открывает и закрывает', async () => {
  const c = mk(true)
  await c.find('input').setValue('gophkeeper')
  expect(c.findAll('[data-test="result"]').length).toBeGreaterThan(0)
  await c.find('input').trigger('keydown', { key: 'ArrowDown' })
  await c.find('input').trigger('keydown', { key: 'ArrowUp' })
  await c.find('input').trigger('keydown', { key: 'Enter' })
  expect(useWindows().windows.value.has('project:gophkeeper')).toBe(true)
  expect(c.emitted('update:open')?.at(-1)).toEqual([false])
  c.unmount()
})

it('Esc и клик мимо закрывают', async () => {
  const c = mk(true)
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
  expect(c.emitted('update:open')?.at(-1)).toEqual([false])
  await c.setProps({ open: true }); await nextTick()
  await c.find('[data-test="spotlight-backdrop"]').trigger('pointerdown')
  expect(c.emitted('update:open')?.filter(x => x[0] === false).length).toBe(2)
  c.unmount()
})
