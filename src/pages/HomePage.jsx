import { Link } from 'react-router-dom'
import { SaveButton } from '../components/SaveButton'
import { SignInPrompt } from '../components/SignInPrompt'
import { PageHeader, PageShell } from '../components/ui/PageShell'
import { EmptyState, ErrorState, Loading } from '../components/ui/States'
import { useBookmarks } from '../hooks/useBookmarks'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useQuery } from '../hooks/useQuery'
import { formatDate } from '../lib/time'
import { supabase } from '../lib/supabase'

const SECTIONS = [
  { kind: 'blog', title: 'Blog posts' },
  { kind: 'lesson', title: 'Lessons' },
  { kind: 'material', title: 'Materials' },
]

async function resolveBookmarks(bookmarks) {
  const blogSlugs = bookmarks.filter((b) => b.kind === 'blog').map((b) => b.ref)
  const lessonRefs = bookmarks.filter((b) => b.kind === 'lesson').map((b) => b.ref)
  const materialIds = bookmarks.filter((b) => b.kind === 'material').map((b) => b.ref)

  const [blogs, lessons, materials] = await Promise.all([
    blogSlugs.length
      ? supabase.from('blog_posts').select('slug, title, published_at').in('slug', blogSlugs)
      : Promise.resolve({ data: [] }),
    lessonRefs.length
      ? supabase.from('lessons').select('slug, title, track:tracks(slug, title)')
      : Promise.resolve({ data: [] }),
    materialIds.length
      ? supabase.from('materials').select('id, title, category, url').in('id', materialIds)
      : Promise.resolve({ data: [] }),
  ])

  const byLesson = new Map(
    (lessons.data ?? []).map((row) => [`${row.track?.slug}/${row.slug}`, row]),
  )

  const items = []

  for (const bookmark of bookmarks) {
    if (bookmark.kind === 'blog') {
      const post = (blogs.data ?? []).find((p) => p.slug === bookmark.ref)
      if (post) {
        items.push({
          id: `blog:${post.slug}`,
          kind: 'blog',
          ref: post.slug,
          title: post.title,
          detail: formatDate(post.published_at),
          to: `/blog/${post.slug}`,
        })
      }
    } else if (bookmark.kind === 'lesson') {
      const row = byLesson.get(bookmark.ref)
      if (row) {
        items.push({
          id: `lesson:${bookmark.ref}`,
          kind: 'lesson',
          ref: bookmark.ref,
          title: row.title,
          detail: row.track?.title ?? '',
          to: `/learn/${row.track?.slug}/${row.slug}`,
        })
      }
    } else {
      const m = (materials.data ?? []).find((x) => x.id === bookmark.ref)
      if (m) {
        items.push({
          id: `material:${m.id}`,
          kind: 'material',
          ref: m.id,
          title: m.title,
          detail: m.category,
          href: m.url,
        })
      }
    }
  }

  return items
}

export default function SavedPage() {
  useDocumentTitle('Saved')
  const user = useCurrentUser()
  const { bookmarks, loading: bookmarksLoading, error: bookmarksError } = useBookmarks()

  const { data, error, loading } = useQuery(
    `saved:${user?.id ?? 'anon'}:${bookmarks.length}`,
    () => resolveBookmarks(bookmarks),
  )

  const items = data ?? []

  return (
    <PageShell width="narrow">
      <PageHeader title="Saved" description="Articles, lessons and materials you’ve saved to come back to." />

      {!user ? <SignInPrompt action="see what you’ve saved" /> : null}
      {user && (bookmarksLoading || loading) ? <Loading label="Loading saved items…" /> : null}
      {user && (bookmarksError || error) ? <ErrorState message="Your saved items could not be loaded." /> : null}

      {user && !bookmarksLoading && !loading && items.length === 0 ? (
        <EmptyState title="Nothing saved yet">
          Use the Save button on a blog post, lesson or material and it will show up here.
        </EmptyState>
      ) : null}

      {user && items.length > 0 ? (
        <div className="space-y-10">
          {SECTIONS.map((section) => {
            const group = items.filter((item) => item.kind === section.kind)
            if (group.length === 0) return null
            return (
              <section key={section.kind} aria-label={section.title}>
                <h2 className="text-lg font-semibold tracking-tight text-ink">{section.title}</h2>
                <ul className="mt-4 divide-y divide-line border-y border-line">
                  {group.map((item) => (
                    <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                      <div className="min-w-0">
                        {item.to ? (
                          <Link to={item.to} className="font-medium text-ink hover:underline">
                            {item.title}
                          </Link>
                        ) : (
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-ink hover:underline"
                          >
                            {item.title}
                            <span className="sr-only"> (opens in a new tab)</span>
                            <span aria-hidden="true"> ↗</span>
                          </a>
                        )}
                        <p className="mt-0.5 text-sm text-muted">{item.detail}</p>
                      </div>
                      <SaveButton kind={item.kind} refId={item.ref} title={item.title} />
                    </li>
                  ))}
                </ul>
              </section>
            )
          })}
        </div>
      ) : null}
    </PageShell>
  )
}