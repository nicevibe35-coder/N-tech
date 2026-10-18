import { formatDateTime, formatRelative } from '../lib/time'

export function Time({ iso }) {
  return (
    <time dateTime={iso} title={formatDateTime(iso)}>
      {formatRelative(iso)}
    </time>
  )
}
