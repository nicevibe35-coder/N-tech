import { Component } from 'react'

/**
 * Catches render errors and failed lazy-chunk loads (common right after a new
 * deploy on a static host, when old chunk files no longer exist).
 */
export class ErrorBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    if (!this.state.failed) {
      return this.props.children
    }

    return (
      <div role="alert" className="mx-auto flex max-w-xl flex-col items-start gap-4 px-4 py-24 sm:px-6">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Something went wrong</h1>
        <p className="text-muted">
          This page failed to load. Reloading usually fixes it. If it keeps happening, try again in a few minutes.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex h-10 items-center rounded-md bg-ink px-4 text-sm font-medium text-canvas transition-opacity hover:opacity-90"
          >
            Reload page
          </button>
          <a
            href={import.meta.env.BASE_URL}
            className="inline-flex h-10 items-center rounded-md border border-line px-4 text-sm font-medium text-ink transition-colors hover:bg-subtle"
          >
            Go to home
          </a>
        </div>
      </div>
    )
  }
}
