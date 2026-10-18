import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AuthorLine } from '../components/AuthorLine'
import { EngagementBar } from '../components/EngagementBar'
import { JoinPanel } from '../components/JoinPanel'
import { MissingContent } from '../components/MissingContent'
import { RequestsPanel } from '../components/RequestsPanel'
import { Button } from '../components/ui/Button'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { PageShell } from '../components/ui/PageShell'
import { ErrorState, InlineError, Loading } from '../components/ui/States'
import { Tag } from '../components/ui/Tag'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useQuery } from '../hooks/useQuery'
import { plural } from '../lib/format'
import { errorMessage, isNotFound } from '../services/errors'
import { deleteProject, getProject, setProjectStatus } from '../services/projectService'

function OwnerActions({ project }) {
  const user = useCurrentUser()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState(null)
  const open = project.status === 'open'

  async function toggleStatus() {
    if (!user) return
    setBusy(true)
    setError(null)
    try {
      await setProjectStatus(user.id, project.id, open ? 'closed' : 'open')
    } catch (failure) {
      setError(errorMessage(failure))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-3">
        <Button variant="secondary" size="sm" loading={busy} onClick={toggleStatus}>
          {open ? 'Close to new members' : 'Reopen project'}
        </Button>
        <Button variant="danger" size="sm" onClick={() => setConfirming(true)}>
          Delete project
        </Button>
      </div>
      <InlineError message={error} />
      <ConfirmDialog
        open={confirming}
        title="Delete this project?"
        message="This removes the project, its join requests and its discussion. It cannot be undone."
        confirmLabel="Delete project"
        onConfirm={async () => {
          if (!user) return
          await deleteProject(user.id, project.id)
          navigate('/projects')
        }}
        onClose={() => setConfirming(false)}
      />
    </div>
  )
}

function ProjectView_({ project }) {
  useDocumentTitle(project.title)
  const user = useCurrentUser()
  const isOwner = user?.id === project.ownerId

  return (
    <PageShell width="narrow">
      <Link to="/projects" className="text-sm font-medium text-muted underline-offset-4 hover:text-ink hover:underline">
        ← All projects
      </Link>

      {/* Main card */}
      <article className="mt-6 overflow-hidden rounded-2xl border border-line bg-canvas">
        <header className="border-b border-line p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <Tag strong={project.status === 'open'}>{project.status === 'open' ? 'Open' : 'Closed'}</Tag>
            <p className="text-sm text-muted">{plural(project.members.length + 1, 'member')}</p>
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{project.title}</h1>
          <div className="mt-5">
            <AuthorLine author={project.owner} createdAt={project.createdAt} />
          </div>
        </header>

        <div className="p-6 sm:p-8">
          <p className="whitespace-pre-wrap break-words leading-relaxed text-ink">{project.summary}</p>

          <dl className="mt-8 space-y-6">
            <div>
              <dt className="text-sm font-medium text-ink">Technologies</dt>
              <dd className="mt-2">
                <ul className="flex flex-wrap gap-2">
                  {project.stack.map((item) => (
                    <li key={item}>
                      <Tag>{item}</Tag>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
            {project.roles.length > 0 ? (
              <div>
                <dt className="text-sm font-medium text-ink">Looking for</dt>
                <dd className="mt-2">
                  <ul className="flex flex-wrap gap-2">
                    {project.roles.map((item) => (
                      <li key={item}>
                        <Tag>{item}</Tag>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ) : null}
          </dl>

          {isOwner ? (
            <div className="mt-8 border-t border-line pt-6">
              <OwnerActions project={project} />
            </div>
          ) : null}
        </div>
      </article>

      {/* Team card */}
      <section aria-labelledby="team-title" className="mt-6 overflow-hidden rounded-2xl border border-line bg-canvas">
        <header className="border-b border-line px-6 py-4 sm:px-8">
          <h2 id="team-title" className="text-lg font-semibold tracking-tight text-ink">
            Team
          </h2>
        </header>
        <ul className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8">
          <li>
            <AuthorLine author={project.owner} />
            <p className="mt-1 pl-[3.25rem] text-xs text-muted">Owner</p>
          </li>
          {project.members.map((member) => (
            <li key={member.id}>
              <AuthorLine author={member} />
            </li>
          ))}
        </ul>
      </section>

      {/* Join / Requests card */}
      <section className="mt-6 overflow-hidden rounded-2xl border border-line bg-canvas">
        <div className="p-6 sm:p-8">
          {isOwner ? (
            <RequestsPanel projectId={project.id} projectOpen={project.status === 'open'} />
          ) : (
            <JoinPanel project={project} />
          )}
        </div>
      </section>

      {/* Discussion card */}
      <section
        aria-labelledby="project-discussion"
        className="mt-6 overflow-hidden rounded-2xl border border-line bg-canvas"
      >
        <header className="border-b border-line px-6 py-4 sm:px-8">
          <h2 id="project-discussion" className="text-lg font-semibold tracking-tight text-ink">
            Discussion
          </h2>
        </header>
        <div className="p-6 sm:p-8">
          <EngagementBar target={{ kind: 'project', id: project.id }} defaultOpen />
        </div>
      </section>
    </PageShell>
  )
}

export default function ProjectDetailPage() {
  const { id = '' } = useParams()
  const user = useCurrentUser()
  const { data, error, loading, reload } = useQuery(`project:${id}:${user?.id ?? 'anon'}`, () =>
    getProject(id, user?.id ?? null),
  )

  if (loading) {
    return (
      <PageShell width="narrow">
        <Loading label="Loading project…" />
      </PageShell>
    )
  }

  if (error) {
    return isNotFound(error) ? (
      <MissingContent
        title="Project not found"
        message="This project does not exist or was removed by its owner."
        backTo="/projects"
        backLabel="Back to projects"
      />
    ) : (
      <PageShell width="narrow">
        <ErrorState message="This project could not be loaded." onRetry={reload} />
      </PageShell>
    )
  }

  return data ? <ProjectView_ project={data} /> : null
}