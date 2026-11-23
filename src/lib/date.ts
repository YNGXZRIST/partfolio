const weekday = new Intl.DateTimeFormat('ru-RU', { weekday: 'short' })
const dayMonth = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short' })

/** «Пн 23 нояб. 09:41» — как часы в меню-баре macOS с русской локалью. */
export function formatMenuClock(d: Date): string {
  const wd = weekday.format(d).replace('.', '')
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${wd.charAt(0).toUpperCase()}${wd.slice(1)} ${dayMonth.format(d)} ${hh}:${mm}`
}
