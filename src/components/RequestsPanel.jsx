import { useState } from 'react'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { useQuery } from '../hooks/useQuery'
import { errorMessage } from '../services/errors'
import { decideRequest, listRequests } from '../services/projectService'
import { AuthorLine } from './AuthorLine'
import { Button } from './ui/Button'
import { ErrorState, InlineError, Loading } from './ui/States'
import { Tag } from './ui/Tag'

function RequestRow({ request, projectOpen, onError }) {
  const user = useCurrentUser()
  const [busy, setBusy] = useState(null)

  async function decide(decision) {
    if (!user) return
    setBusy(decision)
    onError(null)
    try {
      await decideRequest(user.id, request.id, decision)
    } catch (failure) {
      onError(errorMessage(failure))
    } finally {
      setBusy(null)
    }
  }

  return (
    <li className="rounded-lg border border-line p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <AuthorLine author={request.user} createdAt={request.createdAt} />
        {request.status === 'pending' ? (
          <div className="flex gap-2">
            <Button
              size="sm"
              loading={busy === 'accepted'}
              disabled={busy !== null || !projectOpen}
              onClick={() => void decide('accepted')}
            >
              Accept
            </Button>
            <Button
              variant="secondary"
              size="sm"
              loading={busy === 'declined'}
              disabled={busy !== null}
              onClick={() => void decide('declined')}
            >
              Decline
            </Button>
          </div>
        ) : (
          <Tag strong={request.status === 'accepted'}>{request.status === 'accepted' ? 'Accepted' : 'Declined'}</Tag>
        )}
      </div>
      {request.message ? (
        <p className="mt-3 whitespace-pre-wrap break-words text-sm text-ink">{request.message}</p>
      ) : null}
      {request.status === 'pending' && !projectOpen ? (
        <p className="mt-2 text-xs text-muted">Reopen the project to accept new members.</p>
      ) : null}
    </li>
  )
}

export function RequestsPanel({ projectId, projectOpen }) {
  const user = useCurrentUser()
  const [actionError, setActionError] = useState(null)
  const { data, error, loading, reload } = useQuery(`requests:${projectId}`, () =>
    user ? listRequests(user.id, projectId) : Promise.resolve([]),
  )

  return (
    <section aria-labelledby="requests-title">
      <h2 id="requests-title" className="text-lg font-semibold tracking-tight text-ink">
        Join requests
      </h2>
      <div className="mt-4 space-y-3">
        {loading ? <Loading label="Loading requests…" /> : null}
        {error ? <ErrorState message="Join requests could not be loaded." onRetry={reload} /> : null}
        <InlineError message={actionError} />
        {data && data.length === 0 ? <p className="text-sm text-muted">No one has asked to join yet.</p> : null}
        {data && data.length > 0 ? (
          <ul className="space-y-3">
            {data.map((request) => (
              <RequestRow key={request.id} request={request} projectOpen={projectOpen} onError={setActionError} />
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  )
}
