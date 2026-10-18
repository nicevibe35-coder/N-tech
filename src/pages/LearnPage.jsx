import { Link } from 'react-router-dom'
import { useQuery } from '../hooks/useQuery'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useProgress } from '../hooks/useProgress'
import { plural } from '../lib/format'
import { PageHeader, PageShell } from '../components/ui/PageShell'
import { ProgressBar } from '../components/ui/ProgressBar'
import { EmptyState, ErrorState, Loading } from '../components/ui/States'
import { Tag } from '../components/ui/Tag'
import { getLessons, getTracks, lessonRef } from '../content/learn'

export default function LearnPage() {
  useDocumentTitle('Learn')
  const user = useCurrentUser()
  const { completed } = useProgress()

  const { data: tracks, error, loading, reload } = useQuery('learn:tracks', () => getTracks())
  const { data: lessonsByTrack } = useQuery('learn:lessons', async () => {
    const list = await getTracks()
    const entries = await Promise.all(
      list.map(async (t) => [t.slug, await getLessons(t.slug)]),
    )
    return Object.fromEntries(entries)
  })

  const list = tracks ?? []

  return (
    <PageShell>
      <PageHeader
        title="Learn"
        description="Short lessons in a clear order. Mark each one complete and your progress is saved."
      />

      {loading ? <Loading label="Loading tracks…" /> : null}
      {error ? <ErrorState message="Tracks could not be loaded." onRetry={reload} /> : null}

      {!loading && !error && list.length === 0 ? (
        <EmptyState title="No tracks yet">Lessons will appear here soon.</EmptyState>
      ) : null}

      {!loading && !error && list.length > 0 ? (
        <ul className="grid gap-5 sm:grid-cols-2">
          {list.map((track) => {
            const lessons = lessonsByTrack?.[track.slug] ?? []
            const done = lessons.filter((lesson) => completed.has(lessonRef(track.slug, lesson.slug))).length
            const minutes = lessons.reduce((total, lesson) => total + lesson.minutes, 0)

            return (
              <li key={track.slug}>
                <article className="flex h-full flex-col rounded-lg border border-line p-6 transition-colors hover:bg-subtle">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-xl font-semibold tracking-tight text-ink">
                      <Link to={`/learn/${track.slug}`} className="hover:underline">
                        {track.title}
                      </Link>
                    </h2>
                    <Tag>{track.level}</Tag>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{track.summary}</p>
                  <p className="mt-4 text-sm text-muted">
                    {plural(lessons.length, 'lesson')} · about {minutes} min
                  </p>
                  {user ? (
                    <div className="mt-5">
                      <ProgressBar value={done} max={lessons.length} label={`${track.title} progress`} />
                      <p className="mt-2 text-xs text-muted">
                        {done} of {lessons.length} complete
                      </p>
                    </div>
                  ) : null}
                </article>
              </li>
            )
          })}
        </ul>
      ) : null}
    </PageShell>
  )
}