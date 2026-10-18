import { Link, useLocation } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function NotFoundPage() {
  useDocumentTitle('Page not found')
  const { pathname } = useLocation()

  return (
    <section aria-labelledby="not-found-title" className="mx-auto max-w-xl px-4 py-24 sm:px-6 sm:py-32">
      <p className="font-mono text-sm text-muted">404</p>
      <h1 id="not-found-title" className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-4 text-muted">
        There is nothing at{' '}
        <code className="break-all rounded bg-subtle px-1.5 py-0.5 font-mono text-sm text-ink">{pathname}</code>. The
        link may be broken, or the page may have moved.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          to="/"
          className="inline-flex h-11 items-center rounded-md bg-ink px-5 text-sm font-medium text-canvas transition-opacity hover:opacity-90"
        >
          Back to home
        </Link>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="inline-flex h-11 items-center rounded-md border border-line px-5 text-sm font-medium text-ink transition-colors hover:bg-subtle"
        >
          Go back
        </button>
      </div>
    </section>
  )
}
