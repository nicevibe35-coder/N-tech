import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useBookmarks } from '../hooks/useBookmarks'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { toggleBookmark } from '../services/bookmarkService'
import { errorMessage } from '../services/errors'

import { useSignInHref } from '../hooks/useSignInHref'
import { buttonStyles } from './ui/button-styles'
import { Button } from './ui/Button'
import { InlineError } from './ui/States'

function BookmarkIcon({ filled }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 4h12v16l-6-4-6 4V4Z" />
    </svg>
  )
}

export function SaveButton({ kind, refId, title }) {
  const user = useCurrentUser()
  const signInHref = useSignInHref()
  const { bookmarks } = useBookmarks()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  const saved = bookmarks.some((bookmark) => bookmark.kind === kind && bookmark.ref === refId)

  async function toggle() {
    if (!user) return
    setBusy(true)
    setError(null)
    try {
      await toggleBookmark(user.id, kind, refId)
    } catch (failure) {
      setError(errorMessage(failure))
    } finally {
      setBusy(false)
    }
  }

  if (!user) {
    return (
      <Link to={signInHref} className={buttonStyles('secondary', 'sm')} aria-label={`Sign in to save ${title}`}>
        <BookmarkIcon filled={false} />
        Save
      </Link>
    )
  }

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <Button
        variant="secondary"
        size="sm"
        onClick={toggle}
        loading={busy}
        aria-pressed={saved}
        aria-label={saved ? `Remove ${title} from saved` : `Save ${title}`}
      >
        <BookmarkIcon filled={saved} />
        {saved ? 'Saved' : 'Save'}
      </Button>
      <InlineError message={error} />
    </div>
  )
}
