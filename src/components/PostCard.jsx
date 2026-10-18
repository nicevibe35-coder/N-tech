import { useState } from 'react'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { deletePost } from '../services/postService'
import { AuthorLine } from './AuthorLine'
import { CodeBlock } from './CodeBlock'
import { EngagementBar } from './EngagementBar'
import { ConfirmDialog } from './ui/ConfirmDialog'
import { ReportButton } from './ReportButton'

export function PostCard({ post }) {
  const user = useCurrentUser()
  const [confirming, setConfirming] = useState(false)
  const isOwner = user?.id === post.authorId

  return (
    <article className="rounded-lg border border-line p-5">
      <AuthorLine author={post.author} createdAt={post.createdAt} />
      <p className="mt-4 whitespace-pre-wrap break-words leading-relaxed text-ink">{post.body}</p>
      {post.code ? (
        <div className="mt-4">
          <CodeBlock value={post.code} />
        </div>
      ) : null}

      <div className="mt-4 border-t border-line pt-3">
        <EngagementBar
          target={{ kind: 'post', id: post.id }}
          extra={
            <div className="ml-auto flex items-center gap-1">
              <ReportButton kind="post" targetId={post.id} />
              {isOwner ? (
                <button
                  type="button"
                  onClick={() => setConfirming(true)}
                  aria-label="Delete this post"
                  className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-muted transition-colors hover:bg-subtle hover:text-danger"
                >
                  Delete
                </button>
              ) : null}
            </div>
          }
        />
      </div>

      <ConfirmDialog
        open={confirming}
        title="Delete this post?"
        message="This removes the post along with its likes and comments. It cannot be undone."
        confirmLabel="Delete post"
        onConfirm={() => deletePost(post.authorId, post.id)}
        onClose={() => setConfirming(false)}
      />
    </article>
  )
}
