const RELATIVE = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
const DATE = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: 'numeric' })
const DATE_TIME = new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' })

export function formatRelative(iso, now = Date.now()) {
  const time = Date.parse(iso)
  if (Number.isNaN(time)) return ''
  const seconds = Math.round((time - now) / 1000)
  const abs = Math.abs(seconds)
  if (abs < 60) return 'just now'
  if (abs < 3600) return RELATIVE.format(Math.round(seconds / 60), 'minute')
  if (abs < 86400) return RELATIVE.format(Math.round(seconds / 3600), 'hour')
  if (abs < 86400 * 7) return RELATIVE.format(Math.round(seconds / 86400), 'day')
  return DATE.format(time)
}

export function formatDate(iso) {
  const time = Date.parse(iso)
  return Number.isNaN(time) ? '' : DATE.format(time)
}

export function formatDateTime(iso) {
  const time = Date.parse(iso)
  return Number.isNaN(time) ? '' : DATE_TIME.format(time)
}
