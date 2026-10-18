import { Link, NavLink } from 'react-router-dom'
import { NAV_ITEMS, SITE } from '../config/site'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { useSignInHref } from '../hooks/useSignInHref'
import { ThemeToggle } from './ThemeToggle'
import { Avatar } from './ui/Avatar'
import { buttonStyles } from './ui/button-styles'

export function Header() {
  const user = useCurrentUser()
  const signInHref = useSignInHref()

  return (
    <header className="border-b border-line">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
        <Link to="/" className="rounded-md text-lg font-semibold tracking-tight text-ink">
          {SITE.name}
        </Link>

        <div className="order-2 flex items-center gap-2 sm:order-3">
          {user ? (
            <Link
              to={`/u/${user.username}`}
              aria-label={`Your profile, ${user.displayName}`}
              className="inline-flex h-10 items-center gap-2 rounded-md border border-line pl-1.5 pr-3 text-sm font-medium text-ink transition-colors hover:bg-subtle"
            >
              <Avatar name={user.displayName} size="sm" />
              <span className="hidden max-w-28 truncate sm:inline">{user.displayName}</span>
            </Link>
          ) : (
            <Link to={signInHref} className={buttonStyles('primary', 'sm')}>
              Sign in
            </Link>
          )}
          <ThemeToggle />
        </div>

        <nav aria-label="Main" className="order-3 -mx-1 w-full overflow-x-auto sm:order-2 sm:mx-0 sm:w-auto sm:flex-1">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `inline-flex h-10 items-center whitespace-nowrap rounded-md px-3 text-sm font-medium transition-colors ${
                      isActive ? 'bg-ink text-canvas' : 'text-muted hover:bg-subtle hover:text-ink'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}