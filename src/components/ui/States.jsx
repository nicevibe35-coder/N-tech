import { Button } from './Button'

export function Loading({ label = 'Loading…' }) {
  return (
    <div role="status" aria-live="polite" className="flex items-center justify-center gap-3 py-16 text-sm text-muted">
      <span
        aria-hidden="true"
        className="size-4 animate-spin rounded-full border-2 border-line border-t-ink motion-reduce:animate-none"
      />
      <span>{label}</span>
    </div>
  )
}

export function EmptyState({ title, children, action }) {
  return (
    <div className="rounded-lg border border-dashed border-line px-6 py-12 text-center">
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      {children ? <p className="mx-auto mt-2 max-w-md text-sm text-muted">{children}</p> : null}
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  )
}

export function ErrorState({ message, onRetry }) {
  return (
    <div role="alert" className="rounded-lg border border-danger px-6 py-8 text-center">
      <p className="text-sm text-danger">{message}</p>
      {onRetry ? (
        <div className="mt-4 flex justify-center">
          <Button variant="secondary" size="sm" onClick={onRetry}>
            Try again
          </Button>
        </div>
      ) : null}
    </div>
  )
}

export function InlineError({ message }) {
  return message ? (
    <p role="alert" className="text-sm text-danger">
      {message}
    </p>
  ) : null
}
