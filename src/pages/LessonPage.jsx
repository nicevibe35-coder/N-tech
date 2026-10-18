import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { EngagementBar } from '../components/EngagementBar'
import { Markdown } from '../components/Markdown'
import { MissingContent } from '../components/MissingContent'
import { SaveButton } from '../components/SaveButton'
import { SignInPrompt } from '../components/SignInPrompt'
import { Button } from '../components/ui/Button'
import { PageShell } from '../components/ui/PageShell'
import { ErrorState, InlineError, Loading } from '../components/ui/States'
import { getLesson, getLessons, getTrack, lessonRef } from '../content/learn'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useProgress } from '../hooks/useProgress'
import { useQuery } from '../hooks/useQuery'
import { errorMessage } from '../services/errors'
import { setLessonComplete } from '../services/progressService'

function LessonView({ track, lesson, lessons }) {
  useDocumentTitle(`${lesson.title} · ${track.title}`)
  const user = useCurrentUser()
  const { completed } = useProgress()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  const ref = lessonRef(track.slug, lesson.slug)
  const done = completed.has(ref)
  const index = lessons.findIndex((item) => item.slug === lesson.slug)
  const previous = index > 0 ? lessons[index - 1] : undefined
  const next = index >= 0 && index < lessons.length - 1 ? lessons[index + 1] : undefined

  async function toggleComplete() {
    if (!user) return
    setBusy(true)
    setError(null)
    try {
      await setLessonComplete(user.id, track.slug, lesson.slug, !done)
    } catch (failure) {
      setError(errorMessage(failure))
    } finally {
      setBusy(false)
    }
  }

  return (
    <PageShell width="narrow">
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <Link to="/learn" className="underline-offset-4 hover:text-ink hover:underline">
          Learn
        </Link>
        <span aria-hidden="true"> / </span>
        <Link to={`/learn/${track.slug}`} className="underline-offset-4 hover:text-ink hover:underline">
          {track.title}
        </Link>
      </nav>

      <article className="mt-6">
        {lesson.coverUrl ? (
          <img
            src={lesson.coverUrl}
            alt=""
            className="mb-8 aspect-[16/9] w-full rounded-2xl border border-line object-cover"
          />
        ) : null}

        <header>
          <p className="text-sm text-muted">
            Lesson {index + 1} of {lessons.length} · {lesson.minutes} min
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{lesson.title}</h1>
          {lesson.summary ? <p className="mt-3 text-lg text-muted">{lesson.summary}</p> : null}
          <div className="mt-5">
            <SaveButton kind="lesson" refId={ref} title={lesson.title} />
          </div>
        </header>

        {lesson.mediaUrl && lesson.mediaKind === 'video' ? (
          <video
            src={lesson.mediaUrl}
            controls
            preload="metadata"
            className="mt-8 w-full rounded-2xl border border-line bg-black"
          />
        ) : null}

        {lesson.mediaUrl && lesson.mediaKind === 'audio' ? (
          <div className="mt-8 rounded-2xl border border-line p-4">
            <p className="mb-2 text-sm font-medium text-ink">Listen to this lesson</p>
            <audio src={lesson.mediaUrl} controls className="w-full" />
          </div>
        ) : null}

        <div className="mt-10">
          <Markdown source={lesson.body} />
        </div>
      </article>

      <section aria-labelledby="progress-title" className="mt-12 rounded-lg border border-line p-5">
        <h2 id="progress-title" className="text-base font-semibold text-ink">
          Track your progress
        </h2>
        {user ? (
          <div className="mt-3 space-y-3">
            <p className="text-sm text-muted">
              {done ? 'You completed this lesson.' : 'Finished reading and trying the exercises? Mark it complete.'}
            </p>
            <InlineError message={error} />
            <Button
              variant={done ? 'secondary' : 'primary'}
              loading={busy}
              onClick={toggleComplete}
              aria-pressed={done}
            >
              {done ? 'Completed. Undo' : 'Mark as complete'}
            </Button>
          </div>
        ) : (
          <div className="mt-3">
            <SignInPrompt action="save your progress through this track" />
          </div>
        )}
      </section>

      <nav aria-label="Lesson navigation" className="mt-8 grid gap-3 sm:grid-cols-2">
        {previous ? (
          <Link
            to={`/learn/${track.slug}/${previous.slug}`}
            className="rounded-lg border border-line p-4 transition-colors hover:bg-subtle"
          >
            <span className="text-xs text-muted">Previous</span>
            <span className="mt-1 block text-sm font-medium text-ink">{previous.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            to={`/learn/${track.slug}/${next.slug}`}
            className="rounded-lg border border-line p-4 text-right transition-colors hover:bg-subtle"
          >
            <span className="text-xs text-muted">Next</span>
            <span className="mt-1 block text-sm font-medium text-ink">{next.title}</span>
          </Link>
        ) : (
          <Link
            to={`/learn/${track.slug}`}
            className="rounded-lg border border-line p-4 text-right transition-colors hover:bg-subtle"
          >
            <span className="text-xs text-muted">You reached the end</span>
            <span className="mt-1 block text-sm font-medium text-ink">Back to {track.title}</span>
          </Link>
        )}
      </nav>

      <section aria-labelledby="lesson-discussion" className="mt-14 border-t border-line pt-8">
        <h2 id="lesson-discussion" className="mb-4 text-lg font-semibold tracking-tight text-ink">
          Questions about this lesson
        </h2>
        <EngagementBar target={{ kind: 'lesson', id: ref }} />
      </section>
    </PageShell>
  )
}

export default function LessonPage() {
  const { trackSlug = '', lessonSlug = '' } = useParams()
  const { data, error, loading, reload } = useQuery(
    `lesson:${trackSlug}:${lessonSlug}`,
    async () => {
      const track = await getTrack(trackSlug)
      if (!track) return null
      const lesson = await getLesson(trackSlug, lessonSlug)
      if (!lesson) return { track, lesson: null, lessons: [] }
      const lessons = await getLessons(trackSlug)
      return { track, lesson, lessons }
    },
  )

  if (loading) {
    return (
      <PageShell width="narrow">
        <Loading label="Loading lesson…" />
      </PageShell>
    )
  }

  if (error) {
    return (
      <PageShell width="narrow">
        <ErrorState message="This lesson could not be loaded." onRetry={reload} />
      </PageShell>
    )
  }

  if (!data || !data.lesson) {
    return (
      <MissingContent
        title="Lesson not found"
        message="This lesson does not exist or has moved."
        backTo={data?.track ? `/learn/${data.track.slug}` : '/learn'}
        backLabel={data?.track ? `Back to ${data.track.title}` : 'Back to Learn'}
      />
    )
  }

  return <LessonView track={data.track} lesson={data.lesson} lessons={data.lessons} />
}