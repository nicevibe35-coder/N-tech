import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ProjectCard } from '../components/ProjectCard'
import { ProjectForm } from '../components/ProjectForm'
import { useSignInHref } from '../hooks/useSignInHref'
import { Button } from '../components/ui/Button'
import { buttonStyles } from '../components/ui/button-styles'
import { Dialog } from '../components/ui/Dialog'
import { FilterChips } from '../components/ui/FilterChips'
import { PageHeader, PageShell } from '../components/ui/PageShell'
import { EmptyState, ErrorState, Loading } from '../components/ui/States'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useQuery } from '../hooks/useQuery'
import { listProjects } from '../services/projectService'

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'closed', label: 'Closed' },
]

function parseStatus(value) {
  return value === 'open' || value === 'closed' ? value : 'all'
}

export default function ProjectsPage() {
  useDocumentTitle('Projects')
  const user = useCurrentUser()
  const signInHref = useSignInHref()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const [creating, setCreating] = useState(false)

  const status = parseStatus(params.get('status'))
  const mine = Boolean(user) && params.get('mine') === '1'

  const { data, error, loading, reload } = useQuery(`projects:${status}:${mine ? user?.id : 'everyone'}`, () =>
    listProjects({ status, involvingUserId: mine ? user?.id : undefined }),
  )

  function update(nextStatus, nextMine) {
    const next = new URLSearchParams()
    if (nextStatus !== 'all') next.set('status', nextStatus)
    if (nextMine) next.set('mine', '1')
    setParams(next)
  }

  return (
    <PageShell>
      <PageHeader
        title="Projects"
        description="Post an invitation for something you’re building, or ask to join a project that interests you."
        actions={
          user ? (
            <Button onClick={() => setCreating(true)}>Post a project</Button>
          ) : (
            <Link to={signInHref} className={buttonStyles('primary')}>
              Sign in to post a project
            </Link>
          )
        }
      />

      <div className="mb-8 flex flex-wrap items-center gap-3">
        <FilterChips
          label="Filter projects by status"
          options={STATUS_OPTIONS}
          selected={status}
          onSelect={(value) => update(value, mine)}
        />
        {user ? (
          <button
            type="button"
            aria-pressed={mine}
            onClick={() => update(status, !mine)}
            className={`inline-flex h-9 items-center rounded-full border px-4 text-sm font-medium transition-colors ${
              mine ? 'border-ink bg-ink text-canvas' : 'border-line text-muted hover:bg-subtle hover:text-ink'
            }`}
          >
            My projects
          </button>
        ) : null}
      </div>

      {loading ? <Loading label="Loading projects…" /> : null}
      {error ? <ErrorState message="Projects could not be loaded." onRetry={reload} /> : null}

      {data && data.length === 0 ? (
        <EmptyState
          title={mine ? 'You have no projects yet' : 'No projects found'}
          action={user ? <Button onClick={() => setCreating(true)}>Post a project</Button> : undefined}
        >
          {mine
            ? 'Post one, or ask to join a project from the list.'
            : status === 'all'
              ? 'Be the first to invite others to build something.'
              : 'Try a different filter.'}
        </EmptyState>
      ) : null}

      {data && data.length > 0 ? (
        <ul className="grid gap-5 md:grid-cols-2">
          {data.map((project) => (
            <li key={project.id}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      ) : null}

      <Dialog open={creating && user !== null} onClose={() => setCreating(false)} title="Post a project">
        {user ? (
          <ProjectForm
            user={user}
            onCreated={(project) => {
              setCreating(false)
              navigate(`/projects/${project.id}`)
            }}
          />
        ) : null}
      </Dialog>
    </PageShell>
  )
}
