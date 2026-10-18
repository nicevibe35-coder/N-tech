import { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { useQuery } from '../hooks/useQuery'
import { plural } from '../lib/format'
import { getEngagement, toggleLike } from '../services/engagementService'
import { errorMessage } from '../services/errors'

import { CommentSection } from './CommentSection'
import { useSignInHref } from '../hooks/useSignInHref'
import { InlineError } from './ui/States'

const ACTION =
  'inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium text-muted transition-colors hover:bg-subtle hover:text-ink'

function HeartIcon({ filled }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 20.5s-7.5-4.6-9.2-9.4C1.6 7.700 3.700 4.500 7 4.500c2 0 3.600 1.100 5 3 1.400-1.900 3-3 5-3 3.300 0 5.400 3.200 4.200 6.600-1.700 4.800-9.200 9.400-9.200 9.400Z" />
    </svg>
  )
}

export function EngagementBar({ target, defaultOpen = false, extra }) {
  const user = useCurrentUser()
  const signInHref = useSignInHref()
  const commentsId = useId()
  const [open, setOpen] = useState(defaultOpen)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const { data } = useQuery(`engagement:${target.kind}:${target.id}:${user?.id ?? 'anon'}`, () =>
    getEngagement(target, user?.id ?? null),
  )

  const likeCount = data?.likeCount ?? 0
  const liked = data?.liked ?? false
  const commentCount = data?.commentCount ?? 0

  async function like() {
    if (!user || busy) return
    setBusy(true)
    setError(null)
    try {
      await toggleLike(user.id, target)
    } catch (failure) {
      setError(errorMessage(failure))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <div className="-ml-3 flex flex-wrap items-center gap-1">
        {user ? (
          <button
            type="button"
            onClick={like}
            aria-pressed={liked}
            aria-label="Like"
            className={`${ACTION} ${liked ? 'text-ink' : ''}`}
          >
            <HeartIcon filled={liked} />
            <span aria-label={plural(likeCount, 'like')}>{likeCount}</span>
          </button>
        ) : (
          <Link to={signInHref} aria-label={`${plural(likeCount, 'like')}. Sign in to like`} className={ACTION}>
            <HeartIcon filled={false} />
            <span aria-hidden="true">{likeCount}</span>
          </Link>
        )}

        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          aria-controls={commentsId}
          className={ACTION}
        >
          <svg
            viewBox="0 0 24 24"
            className="size-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M4 5.500A1.500 1.500 0 0 1 5.500 4h13A1.500 1.500 0 0 1 20 5.500v9a1.500 1.500 0 0 1-1.500 1.500H10l-4.500 4v-4h0A1.500 1.500 0 0 1 4 14.500v-9Z" />
          </svg>
          {plural(commentCount, 'comment')}
        </button>

        {extra}
      </div>

      <div className="mt-1">
        <InlineError message={error} />
      </div>

      <div id={commentsId} hidden={!open}>
        {open ? <CommentSection target={target} /> : null}
      </div>
    </div>
  )
}
