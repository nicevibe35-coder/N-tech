export function Tag({ children, strong = false }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
        strong ? 'border-ink bg-ink text-canvas' : 'border-line text-muted'
      }`}
    >
      {children}
    </span>
  )
}
