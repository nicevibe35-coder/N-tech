import { useState } from 'react'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { LIMITS } from '../lib/validation'
import { errorMessage } from '../services/errors'
import { cancelMembership, requestToJoin } from '../services/projectService'
import { SignInPrompt } from './SignInPrompt'
import { Button } from './ui/Button'
import { TextArea } from './ui/Field'
import { InlineError } from './ui/States'

export function JoinPanel({ project }) {
  const user = useCurrentUser()
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const request = project.viewerRequest

  async function run(action) {
    setBusy(true)
    setError(null)
    try {
      await action()
      setMessage('')
    } catch (failure) {
      setError(errorMessage(failure))
    } finally {
      setBusy(false)
    }
  }

  function submit(event) {
    event.preventDefault()
    if (!user) return
    if (message.trim().length > LIMITS.joinMessage.max) {
      setError(`Message must be ${LIMITS.joinMessage.max} characters or fewer.`)
      return
    }
    void run(() => requestToJoin(user.id, project.id, message))
  }

  if (!user) return <SignInPrompt action="ask to join this project" />

  if (request?.status === 'accepted') {
    return (
      <section aria-labelledby="join-title" className="rounded-lg border border-ink p-5">
        <h2 id="join-title" className="text-base font-semibold text-ink">
          You’re on this team
        </h2>
        <p className="mt-1 text-sm text-muted">
          Use the discussion below to coordinate with the owner and other members.
        </p>
        <div className="mt-4 space-y-2">
          <InlineError message={error} />
          <Button
            variant="secondary"
            size="sm"
            loading={busy}
            onClick={() => void run(() => cancelMembership(user.id, request.id))}
          >
            Leave project
          </Button>
        </div>
      </section>
    )
  }

  if (request?.status === 'pending') {
    return (
      <section aria-labelledby="join-title" className="rounded-lg border border-line p-5">
        <h2 id="join-title" className="text-base font-semibold text-ink">
          Request sent
        </h2>
        <p className="mt-1 text-sm text-muted">
          The owner has been asked to review your request. You can withdraw it at any time.
        </p>
        <div className="mt-4 space-y-2">
          <InlineError message={error} />
          <Button
            variant="secondary"
            size="sm"
            loading={busy}
            onClick={() => void run(() => cancelMembership(user.id, request.id))}
          >
            Withdraw request
          </Button>
        </div>
      </section>
    )
  }

  if (request?.status === 'declined') {
    return (
      <section aria-labelledby="join-title" className="rounded-lg border border-line p-5">
        <h2 id="join-title" className="text-base font-semibold text-ink">
          Request declined
        </h2>
        <p className="mt-1 text-sm text-muted">
          The owner decided not to add you to this project. You can still follow the discussion.
        </p>
      </section>
    )
  }

  if (project.status !== 'open') {
    return (
      <section aria-labelledby="join-title" className="rounded-lg border border-line p-5">
        <h2 id="join-title" className="text-base font-semibold text-ink">
          Not taking new members
        </h2>
        <p className="mt-1 text-sm text-muted">The owner has closed this project to new requests.</p>
      </section>
    )
  }

  return (
    <section aria-labelledby="join-title" className="rounded-lg border border-line p-5">
      <h2 id="join-title" className="text-base font-semibold text-ink">
        Ask to join
      </h2>
      <form onSubmit={submit} noValidate className="mt-4 space-y-3">
        <TextArea
          label="Message to the owner (optional)"
          hint="Share what you can contribute."
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          maxLength={LIMITS.joinMessage.max}
          rows={3}
        />
        <InlineError message={error} />
        <Button type="submit" loading={busy}>
          Request to join
        </Button>
      </form>
    </section>
  )
}
