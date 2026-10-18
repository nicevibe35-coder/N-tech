export function PageLoader() {
  return (
    <div role="status" aria-live="polite" className="flex items-center justify-center gap-3 py-24 text-sm text-muted">
      <span
        aria-hidden="true"
        className="size-4 animate-spin rounded-full border-2 border-line border-t-ink motion-reduce:animate-none"
      />
      <span>Loading…</span>
    </div>
  )
}
