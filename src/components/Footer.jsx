import { Link } from 'react-router-dom'
import { SITE } from '../config/site'

const YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          © {YEAR} {SITE.name}. Built by developers, for developers.
        </p>
        <nav aria-label="Legal">
          <ul className="flex items-center gap-5">
            <li>
              <Link to="/terms" className="rounded underline-offset-4 hover:text-ink hover:underline">
                Terms
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="rounded underline-offset-4 hover:text-ink hover:underline">
                Privacy
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  )
}
