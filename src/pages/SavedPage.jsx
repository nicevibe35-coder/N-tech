import { Link } from 'react-router-dom'
import { SaveButton } from '../components/SaveButton'
import { SignInPrompt } from '../components/SignInPrompt'
import { PageHeader, PageShell } from '../components/ui/PageShell'
import { EmptyState, ErrorState, Loading } from '../components/ui/States'
import { getBlogPost } from '../content/blog'
import { getLesson, getTrack } from '../content/learn'
import { getMaterial } from '../content/materials'
import { useBookmarks } from '../hooks/useBookmarks'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { formatDate } from '../lib/time'

const SECTIONS = [
  { kind: 'blog', title: 'Blog posts' },
  { kind: 'lesson', title: 'Lessons' },
  { kind: 'material', title: 'Materials' },
]

function resolve(kind, ref) {
  if (kind === 'blog') {
    const post = getBlogPost(ref)
    return post
      ? { id: `blog:${ref}`, kind, ref, title: post.title, detail: formatDate(post.date), to: `/blog/${post.slug}` }
      : null
  }
  if (kind === 'lesson') {
    const [trackSlug = '', lessonSlug = ''] = ref.split('/')
    const track = getTrack(trackSlug)
    const lesson = getLesson(trackSlug, lessonSlug)
    return track && lesson
      ? {
          id: `lesson:${ref}`,
          kind,
          ref,
          title: lesson.title,
          detail: track.title,
          to: `/learn/${trackSlug}/${lessonSlug}`,
        }
      : null
  }
  const material = getMaterial(ref)
  return material
    ? { id: `material:${ref}`, kind, ref, title: material.title, detail: material.category, href: material.url }
    : null
}

export default function SavedPage() {
  useDocumentTitle('Saved')
  const user = useCurrentUser()
  const { bookmarks, loading, error } = useBookmarks()

  const items = bookmarks.flatMap((bookmark) => {
    const item = resolve(bookmark.kind, bookmark.ref)
    return item ? [item] : []
  })

  return (
    <PageShell width="narrow">
      <PageHeader title="Saved" description="Articles, lessons and materials you’ve saved to come back to." />

      {!user ? <SignInPrompt action="see what you’ve saved" /> : null}
      {user && loading ? <Loading label="Loading saved items…" /> : null}
      {user && error ? <ErrorState message="Your saved items could not be loaded." /> : null}

      {user && !loading && !error && items.length === 0 ? (
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
