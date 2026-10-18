import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { MissingContent } from '../components/MissingContent'
import { PostCard } from '../components/PostCard'
import { ProfileForm } from '../components/ProfileForm'
import { ProjectCard } from '../components/ProjectCard'
import { Avatar } from '../components/ui/Avatar'
import { Button } from '../components/ui/Button'
import { Dialog } from '../components/ui/Dialog'
import { PageShell } from '../components/ui/PageShell'
import { ProgressBar } from '../components/ui/ProgressBar'
import { EmptyState, ErrorState, Loading } from '../components/ui/States'
import { getLessons, getTracks, lessonRef } from '../content/learn'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useProgress } from '../hooks/useProgress'
import { useQuery } from '../hooks/useQuery'
import { formatDate } from '../lib/time'
import { signOut } from '../services/authService'
import { listPosts } from '../services/postService'
import { listProjects } from '../services/projectService'
import { getUserByUsername } from '../services/userService'

const POST_LIMIT = 20

function ProgressSection() {
  const { completed } = useProgress()
  const { data: tracks, loading } = useQuery('learn:tracks', () => getTracks())
  const { data: lessonsByTrack } = useQuery('learn:lessons', async () => {
    const list = await getTracks()
    const entries = await Promise.all(list.map(async (t) => [t.slug, await getLessons(t.slug)]))
    return Object.fromEntries(entries)
  })

  const list = tracks ?? []

  if (loading) return <Loading label="Loading progress…" />
  if (list.length === 0) return null

  return (
    <section aria-labelledby="progress-heading" className="mt-12">
      <h2 id="progress-heading" className="text-lg font-semibold tracking-tight text-ink">
        Learning progress
      </h2>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2">
        {list.map((track) => {
          const lessons = lessonsByTrack?.[track.slug] ?? []
          const done = lessons.filter((lesson) => completed.has(lessonRef(track.slug, lesson.slug))).length
          return (
            <li key={track.slug} className="rounded-lg border border-line p-4">
              <Link to={`/learn/${track.slug}`} className="text-sm font-medium text-ink hover:underline">
                {track.title}
              </Link>
              <div className="mt-3">
                <ProgressBar value={done} max={lessons.length} label={`${track.title} progress`} />
              </div>
              <p className="mt-2 text-xs text-muted">
                {done} of {lessons.length} lessons complete
              </p>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function ProjectsSection({ profile }) {
  const { data, error, loading, reload } = useQuery(`profile-projects:${profile.id}`, () =>
    listProjects({ involvingUserId: profile.id }),
  )

  return (
    <section aria-labelledby="projects-heading" className="mt-12">
      <h2 id="projects-heading" className="text-lg font-semibold tracking-tight text-ink">
        Projects
      </h2>
      <div className="mt-4">
        {loading ? <Loading label="Loading projects…" /> : null}
        {error ? <ErrorState message="Projects could not be loaded." onRetry={reload} /> : null}
        {data && data.length === 0 ? <EmptyState title="No projects yet" /> : null}
        {data && data.length > 0 ? (
          <ul className="grid gap-5 md:grid-cols-2">
            {data.map((project) => (
              <li key={project.id}>
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  )
}

function PostsSection({ profile }) {
  const { data, error, loading, reload } = useQuery(`profile-posts:${profile.id}`, () =>
    listPosts({ authorId: profile.id, limit: POST_LIMIT }),
  )

  return (
    <section aria-labelledby="posts-heading" className="mt-12">
      <h2 id="posts-heading" className="text-lg font-semibold tracking-tight text-ink">
        Updates
      </h2>
      <div className="mt-4">
        {loading ? <Loading label="Loading updates…" /> : null}
        {error ? <ErrorState message="Updates could not be loaded." onRetry={reload} /> : null}
        {data && data.items.length === 0 ? <EmptyState title="No updates yet" /> : null}
        {data && data.items.length > 0 ? (
          <>
            <ul className="space-y-5">
              {data.items.map((post) => (
                <li key={post.id}>
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
            {data.total > data.items.length ? (
              <p className="mt-4 text-sm text-muted">Showing the latest {data.items.length} updates.</p>
            ) : null}
          </>
        ) : null}
      </div>
    </section>
  )
}

function ProfileView({ profile }) {
  useDocumentTitle(`${profile.displayName} (@${profile.username})`)
  const viewer = useCurrentUser()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const isOwn = viewer?.id === profile.id

  async function leave() {
    await signOut()
    navigate('/')
  }

  return (
    <PageShell width="narrow">
      <header className="flex flex-wrap items-start justify-between gap-5">
        <div className="flex items-start gap-4">
          <Avatar name={profile.displayName} size="lg" />
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{profile.displayName}</h1>
            <p className="mt-1 text-sm text-muted">@{profile.username}</p>
            {profile.bio ? (
              <p className="mt-3 max-w-lg whitespace-pre-wrap break-words text-ink">{profile.bio}</p>
            ) : null}
            <p className="mt-3 text-sm text-muted">
              Joined {formatDate(profile.createdAt)}
              {profile.website ? (
                <>
                  {' · '}
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="break-all font-medium text-ink underline underline-offset-4"
                  >
                    {profile.website.replace(/^https?:\/\//, '')}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </>
              ) : null}
            </p>
          </div>
        </div>

        {isOwn ? (
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={() => setEditing(true)}>
              Edit profile
            </Button>
            <Link
              to="/saved"
              className="inline-flex h-11 items-center justify-center rounded-md border border-line px-5 text-sm font-medium text-ink transition-colors hover:bg-subtle"
            >
              Saved
            </Link>
            <Button variant="ghost" onClick={leave}>
              Sign out
            </Button>
          </div>
        ) : null}
      </header>

      {isOwn ? <ProgressSection /> : null}
      <PostsSection profile={profile} />
      <ProjectsSection profile={profile} />

      <Dialog open={editing && isOwn} onClose={() => setEditing(false)} title="Edit profile">
        <ProfileForm user={profile} onSaved={() => setEditing(false)} />
      </Dialog>
    </PageShell>
  )
}

export default function ProfilePage() {
  const { username = '' } = useParams()
  const { data, error, loading, reload } = useQuery(`user:${username.toLowerCase()}`, () =>
    getUserByUsername(username),
  )

  if (loading) {
    return (
      <PageShell width="narrow">
        <Loading label="Loading profile…" />
      </PageShell>
    )
  }

  if (error) {
    return (
      <PageShell width="narrow">
        <ErrorState message="This profile could not be loaded." onRetry={reload} />
      </PageShell>
    )
  }

  if (!data) {
    return (
      <MissingContent
        title="Profile not found"
        message="There is no member with that username."
        backTo="/"
        backLabel="Back to home"
      />
    )
  }

  return <ProfileView profile={data} />
}