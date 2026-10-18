const SIZES = {
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-16 text-xl',
}

function initials(name) {
  const letters = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => [...part][0]?.toUpperCase() ?? '')
    .join('')
  return letters || '?'
}

/** Decorative: the person's name is always shown in text beside it. */
export function Avatar({ name, size = 'md' }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-full border border-line bg-subtle font-semibold text-ink ${SIZES[size]}`}
    >
      {initials(name)}
    </span>
  )
}
