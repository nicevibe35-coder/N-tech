import { useState } from 'react'
import { PostCard } from '../components/PostCard'
import { PostComposer } from '../components/PostComposer'
import { SignInPrompt } from '../components/SignInPrompt'
import { Button } from '../components/ui/Button'
import { PageHeader, PageShell } from '../components/ui/PageShell'
import { EmptyState, ErrorState, Loading } from '../components/ui/States'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useQuery } from '../hooks/useQuery'
import { listPosts } from '../services/postService'

const PAGE_SIZE = 10

export default function FeedPage() {
  useDocumentTitle('Feed')
  const user = useCurrentUser()
  const [limit, setLimit] = useState(PAGE_SIZE)
  const { data, error, loading, stale, reload } = useQuery(`feed:${limit}`, () => listPosts({ limit }), {
    keepPrevious: true,
  })

  return (
    <PageShell width="narrow">
      <PageHeader
        title="Feed"
        description="Share what you’re building or learning, and see what others are working on."
      />

      <div className="mb-8">{user ? <PostComposer user={user} /> : <SignInPrompt action="share an update" />}</div>

      {loading ? <Loading label="Loading updates…" /> : null}
      {error ? <ErrorState message="The feed could not be loaded." onRetry={reload} /> : null}

      {data && data.items.length === 0 ? (
        <EmptyState title="No updates yet">
          {user ? 'Be the first to share what you’re working on.' : 'Sign in to share the first update.'}
        </EmptyState>
      ) : null}

      {data && data.items.length > 0 ? (
        <>
          <ul className="space-y-5" aria-label="Updates">
            {data.items.map((post) => (
              <li key={post.id}>
                <PostCard post={post} />
              </li>
            ))}
          </ul>
          {data.items.length < data.total ? (
            <div className="mt-8 flex justify-center">
              <Button variant="secondary" loading={stale} onClick={() => setLimit((current) => current + PAGE_SIZE)}>
                Load more
              </Button>
            </div>
          ) : null}
        </>
      ) : null}
    </PageShell>
  )
}
