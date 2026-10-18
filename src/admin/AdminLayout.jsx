import { NavLink, Outlet } from 'react-router-dom'
import { PageShell } from '../components/ui/PageShell'

const TABS = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/moderation', label: 'Moderation' },
  { to: '/admin/members', label: 'Members' },
  { to: '/admin/content', label: 'Content' },
]

export function AdminLayout() {
  return (
    <PageShell>
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Admin</h1>
        <p className="mt-2 text-muted">Manage the community.</p>
      </header>

      <nav
        aria-label="Admin sections"
        className="mb-8 flex flex-wrap gap-2 border-b border-line pb-3"
      >
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              `inline-flex h-9 items-center rounded-full border px-4 text-sm font-medium transition-colors ${
                isActive
                  ? 'border-ink bg-ink text-canvas'
                  : 'border-line text-muted hover:bg-subtle hover:text-ink'
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>

      <Outlet />
    </PageShell>
  )
}