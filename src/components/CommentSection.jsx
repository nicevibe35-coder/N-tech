import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { useQuery } from '../hooks/useQuery'
import { LIMITS, validateText } from '../lib/validation'
import { addComment, deleteComment, listComments } from '../services/engagementService'
import { errorMessage } from '../services/errors'
import { ReportButton } from './ReportButton'

import { Time } from './Time'
import { SignInPrompt } from './SignInPrompt'
import { Avatar } from './ui/Avatar'
import { Button } from './ui/Button'
import { TextArea } from './ui/Field'
import { ErrorState, InlineError, Loading } from './ui/States'

export function CommentSection({ target }) {
  const user = useCurrentUser()
  const { data, error, loading, reload } = useQuery(`comments:${target.kind}:${target.id}`, () => listComments(target))
  const [body, setBody] = useState('')
  const [fieldError, setFieldError] = useState(null)
  const [actionError, setActionError] = useState(null)
  const [busy, setBusy] = useState(false)

  async function submit(event) {
    event.preventDefault()
    if (!user) return
    const problem = validateText(body, { label: 'Comment', max: LIMITS.comment.max })
    setFieldError(problem)
    if (problem) return

    setBusy(true)
    setActionError(null)
    try {
      await addComment(user.id, target, body)
      setBody('')
    } catch (failure) {
      setActionError(errorMessage(failure))
    } finally {
      setBusy(false)
    }
  }

  async function remove(commentId) {
    if (!user) return
    setActionError(null)
    try {
      await deleteComment(user.id, commentId)
    } catch (failure) {
      setActionError(errorMessage(failure))
    }
  }

  return (
    <div className="mt-5 border-t border-line pt-5">
      {loading ? <Loading label="Loading comments…" /> : null}
      {error ? <ErrorState message="Comments could not be loaded." onRetry={reload} /> : null}

      {data && data.length === 0 ? (
        <p className="text-sm text-muted">No comments yet. Start the conversation.</p>
      ) : null}

      {data && data.length > 0 ? (
        <ul className="space-y-5">
          {data.map((comment) => (
            <li key={comment.id} className="flex gap-3">
              <Avatar name={comment.author?.displayName ?? '?'} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="text-sm">
                  {comment.author ? (
                    <Link to={`/u/${comment.author.username}`} className="font-medium text-ink hover:underline">
                      {comment.author.displayName}
                    </Link>
                  ) : (
                    <span className="font-medium text-muted">Unknown member</span>
                  )}{' '}
                  <span className="text-muted">
                    · <Time iso={comment.createdAt} />
                  </span>
                </p>
                <p className="mt-1 whitespace-pre-wrap break-words text-sm text-ink">{comment.body}</p>
               <div className="mt-1 flex items-center gap-3">
                  {user && comment.authorId === user.id ? (
                    <button
                      type="button"
                      onClick={() => remove(comment.id)}
                      aria-label={`Delete your comment: ${comment.body.slice(0, 40)}`}
                      className="rounded text-xs font-medium text-muted underline underline-offset-4 hover:text-danger"
                    >
                      Delete
                    </button>
                  ) : null}
                  {user && comment.authorId !== user.id ? (
                    <span className="text-xs">
                      <ReportButton kind="comment" targetId={comment.id} label="Report" />
                    </span>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-6">
        {user ? (
          <form onSubmit={submit} noValidate className="space-y-3">
            <TextArea
              label="Add a comment"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              maxLength={LIMITS.comment.max}
              error={fieldError}
              className="min-h-20"
              rows={3}
            />
            <InlineError message={actionError} />
            <Button type="submit" size="sm" loading={busy}>
              Post comment
            </Button>
          </form>
        ) : (
          <SignInPrompt action="join the conversation" />
        )}
      </div>
    </div>
  )
}
