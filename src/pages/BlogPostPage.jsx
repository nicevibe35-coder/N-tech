import { Link, useParams } from 'react-router-dom'
import { EngagementBar } from '../components/EngagementBar'
import { Markdown } from '../components/Markdown'
import { MissingContent } from '../components/MissingContent'
import { SaveButton } from '../components/SaveButton'
import { PageShell } from '../components/ui/PageShell'
import { ErrorState, Loading } from '../components/ui/States'
import { Tag } from '../components/ui/Tag'
import { getBlogPost } from '../content/blog'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useQuery } from '../hooks/useQuery'
import { formatDate } from '../lib/time'

function PostView({ post }) {
  useDocumentTitle(post.title)

  return (
    <PageShell width="narrow">
      <Link to="/blog" className="text-sm font-medium text-muted underline-offset-4 hover:text-ink hover:underline">
        ← All posts
      </Link>

      <article className="mt-6">
        <header>
          <p className="text-sm text-muted">
            <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.minutes} min read
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{post.title}</h1>
          {post.summary ? <p className="mt-4 text-lg text-muted">{post.summary}</p> : null}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <ul aria-label="Topics" className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <li key={tag}>
                  <Tag>{tag}</Tag>
                </li>
              ))}
            </ul>
            <SaveButton kind="blog" refId={post.slug} title={post.title} />
          </div>
        </header>

        <div className="mt-10">
          <Markdown source={post.body} />
        </div>
      </article>

      <section aria-labelledby="discussion-title" className="mt-14 border-t border-line pt-8">
        <h2 id="discussion-title" className="mb-4 text-lg font-semibold tracking-tight text-ink">
          Discussion
        </h2>
        <EngagementBar target={{ kind: 'blog', id: post.slug }} defaultOpen />
      </section>
    </PageShell>
  )
}

export default function BlogPostPage() {
  const { slug = '' } = useParams()
  const { data, error, loading, reload } = useQuery(`blog:${slug}`, () => getBlogPost(slug))

  if (loading) {
    return (
      <PageShell width="narrow">
        <Loading label="Loading post…" />
      </PageShell>
    )
  }

  if (error) {
    return (
      <PageShell width="narrow">
        <ErrorState message="This post could not be loaded." onRetry={reload} />
      </PageShell>
    )
  }

  if (!data) {
    return (
      <MissingContent
        title="Post not found"
        message="This article does not exist or has been moved."
        backTo="/blog"
        backLabel="Back to the blog"
      />
    )
  }

  return <PostView post={data} />
}