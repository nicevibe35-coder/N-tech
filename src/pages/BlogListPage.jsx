import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '../hooks/useQuery'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { formatDate } from '../lib/time'
import { Button } from '../components/ui/Button'
import { FilterChips } from '../components/ui/FilterChips'
import { PageHeader, PageShell } from '../components/ui/PageShell'
import { EmptyState, ErrorState, Loading } from '../components/ui/States'
import { Tag } from '../components/ui/Tag'
import { listBlogPosts } from '../content/blog'

export default function BlogListPage() {
  useDocumentTitle('Blog')
  const [params, setParams] = useSearchParams()
  const tag = params.get('tag') ?? 'all'

  const { data, error, loading, reload } = useQuery('blog:list', () => listBlogPosts())

  const posts = data ?? []
  const tags = [...new Set(posts.flatMap((p) => p.tags))].sort()
  const filtered = tag === 'all' ? posts : posts.filter((p) => p.tags.includes(tag))
  const options = [
    { value: 'all', label: 'All' },
    ...tags.map((item) => ({ value: item, label: item })),
  ]

  return (
    <PageShell>
      <PageHeader title="Blog" description="Articles on JavaScript, written to be read in one sitting." />

      {loading ? <Loading label="Loading posts…" /> : null}
      {error ? <ErrorState message="Posts could not be loaded." onRetry={reload} /> : null}

      {!loading && !error && tags.length > 0 ? (
        <div className="mb-8">
          <FilterChips
            label="Filter posts by topic"
            options={options}
            selected={tag}
            onSelect={(value) => setParams(value === 'all' ? {} : { tag: value })}
          />
        </div>
      ) : null}

      {!loading && !error && filtered.length === 0 ? (
        <EmptyState
          title={tag === 'all' ? 'No posts yet' : `No posts tagged “${tag}”`}
          action={
            tag === 'all' ? undefined : (
              <Button variant="secondary" onClick={() => setParams({})}>
                Show all posts
              </Button>
            )
          }
        >
          {tag === 'all' ? 'New articles will appear here.' : 'Try a different topic.'}
        </EmptyState>
      ) : null}

      {!loading && !error && filtered.length > 0 ? (
        <ul className="divide-y divide-line border-y border-line">
          {filtered.map((post) => (
            <li key={post.slug}>
              <article className="py-7">
                <p className="text-sm text-muted">
                  <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.minutes} min read
                </p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-ink">
                  <Link to={`/blog/${post.slug}`} className="hover:underline">
                    {post.title}
                  </Link>
                </h2>
                {post.summary ? <p className="mt-2 max-w-2xl text-muted">{post.summary}</p> : null}
                {post.tags.length > 0 ? (
                  <ul aria-label="Topics" className="mt-4 flex flex-wrap gap-2">
                    {post.tags.map((item) => (
                      <li key={item}>
                        <Tag>{item}</Tag>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            </li>
          ))}
        </ul>
      ) : null}
    </PageShell>
  )
}