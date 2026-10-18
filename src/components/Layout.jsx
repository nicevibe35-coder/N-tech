import { Suspense, useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { isPersistent } from '../services/storage'
import { ErrorBoundary } from './ErrorBoundary'
import { Footer } from './Footer'
import { Header } from './Header'
import { PageLoader } from './PageLoader'

export function Layout() {
  const { pathname } = useLocation()
  const mainRef = useRef(null)
  const isFirstRender = useRef(true)

  // After client-side navigation, reset scroll and move focus to the content
  // so keyboard and screen-reader users start at the top of the new page.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    window.scrollTo(0, 0)
    mainRef.current?.focus({ preventScroll: true })
  }, [pathname])

  return (
    <div className="flex min-h-dvh flex-col bg-canvas text-ink">
      <a
        href="#main"
        className="sr-only rounded-md bg-ink px-4 py-2 text-sm font-medium text-canvas focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50"
      >
        Skip to content
      </a>
      <Header />
      {isPersistent ? null : (
        <p role="status" className="border-b border-line bg-subtle px-4 py-2 text-center text-sm text-muted">
          Your browser is blocking storage, so nothing you do here will be saved after you close this tab.
        </p>
      )}
      <main id="main" ref={mainRef} tabIndex={-1} className="flex-1 focus:outline-none">
        <ErrorBoundary key={pathname}>
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  )
}
