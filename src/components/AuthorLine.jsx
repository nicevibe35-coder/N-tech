import { Link } from 'react-router-dom'

import { Time } from './Time'
import { Avatar } from './ui/Avatar'

export function AuthorLine({ author, createdAt }) {
  if (!author) {
    return (
      <div className="flex items-center gap-3 text-sm text-muted">
        <Avatar name="?" />
        <p>
          Unknown member
          {createdAt ? (
            <>
              {' '}
              · <Time iso={createdAt} />
            </>
          ) : null}
        </p>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <Avatar name={author.displayName} />
      <div className="min-w-0 text-sm leading-tight">
        <Link to={`/u/${author.username}`} className="font-medium text-ink hover:underline">
          {author.displayName}
        </Link>
        <p className="mt-0.5 truncate text-muted">
          @{author.username}
          {createdAt ? (
            <>
              {' '}
              · <Time iso={createdAt} />
            </>
          ) : null}
        </p>
      </div>
    </div>
  )
}
