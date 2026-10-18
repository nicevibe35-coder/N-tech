import { Link } from 'react-router-dom'
import { buttonStyles } from '../components/ui/button-styles'
import { Tag } from '../components/ui/Tag'
import { SITE } from '../config/site'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

const FEATURES = [
  {
    title: 'Learning tracks',
    body: 'Short lessons in a clear order, from variables to async code. Mark lessons done and pick up where you stopped.',
    to: '/learn',
    icon: 'M4 5.5A1.5 1.5 0 0 1 5.5 4H20v14H5.5A1.5 1.5 0 0 0 4 19.5v-14ZM4 19.5A1.5 1.5 0 0 0 5.5 21H20',
  },
  {
    title: 'The blog',
    body: 'Plain-spoken articles on the parts of JavaScript that trip people up, written to be read in a few minutes.',
    to: '/blog',
    icon: 'M5 4h14v16H5V4Zm3 4h8M8 12h8M8 16h5',
  },
  {
    title: 'Updates feed',
    body: 'Share what you shipped or what you are stuck on, with an optional code snippet. Likes and comments, nothing else.',
    to: '/feed',
    icon: 'M4 6h16M4 12h16M4 18h10',
  },
  {
    title: 'Project cards',
    body: 'Post an idea with the stack and the roles you need. Others ask to join, and you decide who comes aboard.',
    to: '/projects',
    icon: 'M4 5h16v6H4V5Zm0 8h7v6H4v-6Zm9 0h7v6h-7v-6Z',
  },
  {
    title: 'Materials library',
    body: 'A short, hand-picked list of books, docs and tools worth your time. No endless link dumps.',
    to: '/materials',
    icon: 'M12 3l9 5-9 5-9-5 9-5Zm-7 9v4l7 4 7-4v-4',
  },
  {
    title: 'Saved items and profile',
    body: 'Keep articles and lessons for later, and show your projects and updates on a profile that is yours.',
    to: '/saved',
    icon: 'M6 4h12v17l-6-4-6 4V4Z',
  },
]

const STEPS = [
  { title: 'Create a free account', body: 'Use your email or your GitHub account. It takes less than a minute.' },
  { title: 'Share and grow', body: 'Post what you are building, ask questions in public, and document your journey.' },
  { title: 'Build with others', body: 'Start a project card or join one, and ship something real with people who care.' },
]

const PRINCIPLES = [
  { title: 'No direct messages', body: 'Everything happens in the open, where others can learn from it too.' },
  { title: 'Moderated', body: 'Reports are reviewed by real people, and rate limits keep spam out.' },
  { title: 'Free to join', body: 'Learning and posting are free. No ads, no tracking of what you read.' },
]

function Icon({ path }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  )
}

function ProductPreview() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-md select-none lg:mx-0">
      <div className="rounded-xl border border-line bg-canvas p-5 shadow-sm">
        <div className="flex items-center justify-between text-xs text-muted">
          <span>Async JavaScript · Lesson 3 of 4</span>
          <span>75%</span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line">
          <div className="h-full w-3/4 rounded-full bg-ink" />
        </div>
        <pre className="mt-4 overflow-hidden rounded-lg border border-line bg-subtle p-4 font-mono text-[13px] leading-6 text-ink">
          <code>
            {`async function load(id) {
  const res = await fetch(url + id)
  if (!res.ok) throw new Error(res.status)
  return res.json()
}`}
          </code>
        </pre>
      </div>

      <div className="mt-4 ml-6 rounded-xl border border-line bg-canvas p-5 shadow-sm sm:ml-12">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-semibold text-ink">Build a CLI for release notes</p>
          <Tag strong>Open</Tag>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          A small Node tool that turns commit history into readable release notes. Looking for a designer and a tester.
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Tag>node</Tag>
          <Tag>javascript</Tag>
          <Tag>cli</Tag>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-xs text-muted">
          <span>Example project card</span>
          <span className="rounded-md bg-ink px-2.5 py-1 font-medium text-canvas">Ask to join</span>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  useDocumentTitle()
  const user = useCurrentUser()

  return (
    <>
      <section aria-labelledby="home-title" className="border-b border-line">
        <div className="mx-auto grid max-w-5xl grid-cols-[minmax(0,1fr)] items-center gap-12 px-4 pb-16 pt-16 sm:px-6 sm:pb-24 sm:pt-24 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div>
            <p className="inline-flex items-center rounded-full border border-line px-3 py-1 text-xs font-medium text-muted">
              {SITE.tagline}
            </p>
            <h1
              id="home-title"
              className="mt-5 text-4xl font-semibold tracking-tight text-ink sm:text-6xl sm:leading-[1.05]"
            >
              Build, share, and grow as a developer.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              A quiet place to document what you are working on, find teammates for your next idea, and level up your skills. No direct messages, no noise.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {user ? (
                <Link to="/feed" className={buttonStyles('primary')}>
                  Go to the feed
                </Link>
              ) : (
                <Link to="/signin" className={buttonStyles('primary')}>
                  Create a free account
                </Link>
              )}
              <Link to="/projects" className={buttonStyles('secondary')}>
                Explore projects
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted">Free to join. Email or GitHub sign-in.</p>
          </div>
          <ProductPreview />
        </div>
      </section>

      <section aria-labelledby="features-title" className="border-b border-line">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
          <h2 id="features-title" className="max-w-xl text-3xl font-semibold tracking-tight text-ink">
            Everything a developer needs, in one place
          </h2>
          <p className="mt-3 max-w-xl text-muted">Six small tools that work together. Nothing you have to configure.</p>
          <ul className="mt-10 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <li key={feature.title} className="bg-canvas">
                <Link to={feature.to} className="group block h-full p-6 transition-colors hover:bg-subtle">
                  <span className="inline-flex size-10 items-center justify-center rounded-lg border border-line text-ink">
                    <Icon path={feature.icon} />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-ink">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{feature.body}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="steps-title" className="border-b border-line bg-subtle">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
          <h2 id="steps-title" className="text-3xl font-semibold tracking-tight text-ink">
            How it works
          </h2>
          <ol className="mt-10 grid gap-8 sm:grid-cols-3">
            {STEPS.map((step, index) => (
              <li key={step.title}>
                <span
                  aria-hidden="true"
                  className="inline-flex size-9 items-center justify-center rounded-full bg-ink text-sm font-semibold text-canvas"
                >
                  {index + 1}
                </span>
                <h3 className="mt-4 text-base font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="principles-title" className="border-b border-line">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
          <h2 id="principles-title" className="text-3xl font-semibold tracking-tight text-ink">
            Built to stay useful
          </h2>
          <dl className="mt-10 grid gap-8 sm:grid-cols-3">
            {PRINCIPLES.map((principle) => (
              <div key={principle.title} className="border-t border-ink pt-4">
                <dt className="text-base font-semibold text-ink">{principle.title}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted">{principle.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="cta-title">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="rounded-2xl bg-ink px-6 py-12 text-center text-canvas sm:px-12 sm:py-16">
            <h2 id="cta-title" className="mx-auto max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
              Your next project starts with one post or one lesson
            </h2>
            <p className="mx-auto mt-4 max-w-md text-canvas/70">
              Join {SITE.name} today. It is free, and you can leave whenever you like.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {user ? (
                <Link
                  to="/projects"
                  className="inline-flex h-11 items-center justify-center rounded-md bg-canvas px-5 text-sm font-medium text-ink transition-opacity hover:opacity-90"
                >
                  Browse projects
                </Link>
              ) : (
                <Link
                  to="/signin"
                  className="inline-flex h-11 items-center justify-center rounded-md bg-canvas px-5 text-sm font-medium text-ink transition-opacity hover:opacity-90"
                >
                  Create a free account
                </Link>
              )}
              <Link
                to="/blog"
                className="inline-flex h-11 items-center justify-center rounded-md border border-canvas/30 px-5 text-sm font-medium text-canvas transition-colors hover:bg-canvas/10"
              >
                Read the blog
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}