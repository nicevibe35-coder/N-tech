import { Link, useParams } from 'react-router-dom'
import { MissingContent } from '../components/MissingContent'
import { PageShell } from '../components/ui/PageShell'
import { ProgressBar } from '../components/ui/ProgressBar'
import { EmptyState, ErrorState, Loading } from '../components/ui/States'
import { Tag } from '../components/ui/Tag'
import { getLessons, getTrack, lessonRef } from '../content/learn'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useProgress } from '../hooks/useProgress'
import { useQuery } from '../hooks/useQuery'

function TrackView({ track, lessons }) {
  useDocumentTitle(track.title)
  const user = useCurrentUser()
  const { completed } = useProgress()
  const done = lessons.filter((lesson) => completed.has(lessonRef(track.slug, lesson.slug))).length
  const next = lessons.find((lesson) => !completed.has(lessonRef(track.slug, lesson.slug)))

  return (
    <PageShell width="narrow">
      <Link to="/learn" className="text-sm font-medium text-muted underline-offset-4 hover:text-ink hover:underline">
        ← All tracks
      </Link>

      <header className="mt-6">
        <Tag>{track.level}</Tag>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{track.title}</h1>
        <p className="mt-3 text-muted">{track.summary}</p>
        {user && lessons.length > 0 ? (
          <div className="mt-6">
            <ProgressBar value={done} max={lessons.length} label={`${track.title} progress`} />
            <p className="mt-2 text-sm text-muted">
              {done} of {lessons.length} lessons complete
              {next && done > 0 ? (
                <>
                  {' · '}
                  <Link
                    to={`/learn/${track.slug}/${next.slug}`}
                    className="font-medium text-ink underline underline-offset-4"
                  >
                    Continue with “{next.title}”
                  </Link>
                </>
              ) : null}
            </p>
          </div>
        ) : null}
      </header>

      <div className="mt-10">
        {lessons.length === 0 ? (
          <EmptyState title="No lessons yet">Lessons for this track are on the way.</EmptyState>
        ) : (
          <ol className="divide-y divide-line border-y border-line">
            {lessons.map((lesson, index) => {
              const isDone = completed.has(lessonRef(track.slug, lesson.slug))
              return (
                <li key={lesson.slug} className="flex items-start gap-4 py-5">
                  <span
                    aria-hidden="true"
                    className={`mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${
                      isDone ? 'border-ink bg-ink text-canvas' : 'border-line text-muted'
                    }`}
                  >
                    {isDone ? '✓' : index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-base font-semibold text-ink">
                      <Link to={`/learn/${track.slug}/${lesson.slug}`} className="hover:underline">
                        {lesson.title}
                      </Link>
                      {isDone ? <span className="sr-only"> (completed)</span> : null}
                    </h2>
                    <p className="mt-1 text-sm text-muted">{lesson.summary}</p>
                  </div>
                  <p className="shrink-0 text-sm text-muted">{lesson.minutes} min</p>
                </li>
              )
            })}
          </ol>
        )}
      </div>
    </PageShell>
  )
}

export default function TrackPage() {
  const { trackSlug = '' } = useParams()
  const { data, error, loading, reload } = useQuery(`track:${trackSlug}`, async () => {
    const track = await getTrack(trackSlug)
    if (!track) return null
    const lessons = await getLessons(trackSlug)
    return { track, lessons }
  })

  if (loading) {
    return (
      <PageShell width="narrow">
        <Loading label="Loading track…" />
      </PageShell>
    )
  }

  if (error) {
    return (
      <PageShell width="narrow">
        <ErrorState message="This track could not be loaded." onRetry={reload} />
      </PageShell>
    )
  }

  if (!data) {
    return (
      <MissingContent
        title="Track not found"
        message="This learning track does not exist."
        backTo="/learn"
        backLabel="Back to Learn"
      />
    )
  }

  return <TrackView track={data.track} lessons={data.lessons} />
}