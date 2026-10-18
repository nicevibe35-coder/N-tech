import { useMemo, useState } from 'react'
import { PageShell } from '../components/ui/PageShell'
import { Loading, InlineError } from '../components/ui/States'
import { SignInPrompt } from '../components/SignInPrompt'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useRoadmap } from '../hooks/useRoadmap'
import { CATEGORIES, CAREERS, TRACKS } from '../roadmap/data'
import { TrackIcon } from '../roadmap/icons'
import {
  careerEarned,
  countDone,
  currentTitle,
  isTrackEarned,
  itemKey,
  totalEarned,
} from '../roadmap/logic'

function Badge({ icon, size = 'md' }) {
  const cls = size === 'lg' ? 'size-12 rounded-full' : 'size-10 rounded-xl'
  const iconSize = size === 'lg' ? 'size-7' : 'size-6'
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center border border-line bg-canvas text-ink ${cls}`}
    >
      <TrackIcon name={icon} className={iconSize} />
    </span>
  )
}

function TagCard({ title, name, earned, total }) {
  return (
    <div className="mx-auto max-w-md overflow-hidden rounded-2xl border border-line">
      <div className="bg-ink px-4 py-3 text-center text-xs font-bold uppercase tracking-[0.18em] text-canvas">
        Hello
        <span className="mt-1 block text-[11px] font-semibold tracking-widest opacity-80">
          My title is
        </span>
      </div>
      <div className="bg-canvas px-5 py-6 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          {title || 'Newcomer'}
        </h2>
        <p className="mt-1 text-sm font-medium text-muted">{name}</p>
        <p className="mt-3 text-xs text-muted">
          {earned} of {total} tags earned
        </p>
      </div>
    </div>
  )
}

function TrackRow({ track, done, onToggle }) {
  const [open, setOpen] = useState(false)
  const [id, title, , , tagName, items, icon] = track
  const count = countDone(track, done)
  const earned = count === items.length

  return (
    <li className="overflow-hidden rounded-2xl border border-line">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-subtle"
      >
        <Badge icon={icon} />
        <span className="min-w-0 flex-1">
          <span className="block font-semibold text-ink">{title}</span>
          <span className="block text-xs text-muted">
            {earned ? 'Tag earned' : `Earns: ${tagName}`}
          </span>
        </span>
        <span
          className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
            earned ? 'border-ink bg-ink text-canvas' : 'border-line text-muted'
          }`}
        >
          {count}/{items.length}
        </span>
      </button>
      <div className="mx-4 mb-3 h-1 overflow-hidden rounded-full bg-subtle ring-1 ring-inset ring-line">
        <div
          className="h-full bg-ink transition-[width]"
          style={{ width: `${Math.round((count / items.length) * 100)}%` }}
        />
      </div>
      {open ? (
        <div className="px-4 pb-4">
          {earned ? (
            <span className="mb-2 inline-block rounded-full border border-ink bg-ink px-2.5 py-0.5 text-xs font-bold text-canvas">
              {tagName}
            </span>
          ) : null}
          <ul className="space-y-0">
            {items.map((item, index) => {
              const key = itemKey(id, index)
              const checked = Boolean(done[key])
              return (
                <li key={key} className="border-t border-line first:border-t-0">
                  <label className="flex cursor-pointer items-start gap-3 py-2.5">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={checked}
                      onChange={(event) => onToggle(key, event.target.checked)}
                    />
                    <span
                      aria-hidden="true"
                      className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border-2 transition-colors ${
                        checked
                          ? 'border-ink bg-ink text-canvas'
                          : 'border-line bg-canvas text-transparent'
                      }`}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="size-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12l5 5 9-10" />
                      </svg>
                    </span>
                    <span className={`text-sm ${checked ? 'text-muted line-through' : 'text-ink'}`}>
                      {item}
                    </span>
                  </label>
                </li>
              )
            })}
          </ul>
        </div>
      ) : null}
    </li>
  )
}

function TracksView({ done, onToggle }) {
  const [filter, setFilter] = useState('')
  const filtered = filter ? TRACKS.filter((t) => t[3] === filter) : TRACKS

  return (
    <>
      <div
        role="group"
        aria-label="Filter tracks by category"
        className="mb-4 flex flex-wrap gap-2"
      >
        <button
          type="button"
          aria-pressed={!filter}
          onClick={() => setFilter('')}
          className={`inline-flex h-9 items-center rounded-full border px-4 text-sm font-medium transition-colors ${
            !filter
              ? 'border-ink bg-ink text-canvas'
              : 'border-line text-muted hover:bg-subtle hover:text-ink'
          }`}
        >
          All
        </button>
        {Object.entries(CATEGORIES).map(([code, { label }]) => (
          <button
            key={code}
            type="button"
            aria-pressed={filter === code}
            onClick={() => setFilter(code)}
            className={`inline-flex h-9 items-center rounded-full border px-4 text-sm font-medium transition-colors ${
              filter === code
                ? 'border-ink bg-ink text-canvas'
                : 'border-line text-muted hover:bg-subtle hover:text-ink'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <ul className="space-y-3">
        {filtered.map((track) => (
          <TrackRow key={track[0]} track={track} done={done} onToggle={onToggle} />
        ))}
      </ul>
    </>
  )
}

function MyTagsView({ done }) {
  return (
    <>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">Skill tags</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {TRACKS.map((track) => {
          const [id, title, , , tagName, , icon] = track
          const earned = isTrackEarned(track, done)
          return (
            <div
              key={id}
              className={`rounded-2xl border border-line bg-canvas p-4 text-center transition-opacity ${
                earned ? '' : 'opacity-50 grayscale'
              }`}
            >
              <Badge icon={icon} size="lg" />
              <p className="mt-3 text-sm font-semibold text-ink">{tagName}</p>
              <p className="mt-0.5 text-xs text-muted">{earned ? title : `Finish ${title}`}</p>
            </div>
          )
        })}
      </div>

      <h2 className="mt-8 mb-3 text-sm font-semibold uppercase tracking-wider text-muted">
        Career titles
      </h2>
      <ul className="space-y-2">
        {CAREERS.map((career) => {
          const earned = careerEarned(career, done)
          const reqs = career[1]
            .map((req) =>
              Array.isArray(req) ? 'one database' : TRACKS.find((t) => t[0] === req)?.[1] ?? req,
            )
            .join(' + ')
          return (
            <li
              key={career[0]}
              className={`flex items-center justify-between gap-3 rounded-xl border border-line bg-canvas px-4 py-3 ${
                earned ? '' : 'opacity-50'
              }`}
            >
              <div className="min-w-0">
                <p className="font-semibold text-ink">{career[0]}</p>
                <p className="mt-0.5 text-xs text-muted">{reqs}</p>
              </div>
              <span className="shrink-0 text-xs font-semibold text-muted">
                {earned ? 'Earned' : 'Locked'}
              </span>
            </li>
          )
        })}
      </ul>
    </>
  )
}

export default function RoadmapPage() {
  useDocumentTitle('Roadmap')
  const user = useCurrentUser()
  const { done, loading, error, setItem } = useRoadmap()
  const [view, setView] = useState('tracks')

  const title = useMemo(() => currentTitle(done), [done])
  const earned = useMemo(() => totalEarned(done), [done])

  if (!user) {
    return (
      <PageShell>
        <div className="mx-auto max-w-md">
          <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Roadmap</h1>
          <p className="mt-3 text-muted">
            Track your JavaScript skills. Earn tags as you complete each track and unlock career titles.
          </p>
          <div className="mt-6">
            <SignInPrompt action="track your roadmap progress" />
          </div>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <header className="mx-auto mb-8 max-w-2xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Roadmap</h1>
        <p className="mt-3 text-muted">
          Pick a track, tick off the skills, earn the tag. Complete whole paths to unlock career titles.
        </p>
      </header>

      {loading ? (
        <Loading label="Loading your roadmap…" />
      ) : (
        <>
          <TagCard title={title} name={user.displayName} earned={earned} total={TRACKS.length} />

          <InlineError message={error?.message} />

          <div className="mx-auto mt-6 grid max-w-md grid-cols-2 rounded-lg border border-line p-1">
            {[
              ['tracks', 'Tracks'],
              ['mine', 'My tags'],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={view === value}
                onClick={() => setView(value)}
                className={`h-10 rounded-md text-sm font-medium transition-colors ${
                  view === value ? 'bg-ink text-canvas' : 'text-muted hover:text-ink'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {view === 'tracks' ? (
              <TracksView done={done} onToggle={setItem} />
            ) : (
              <MyTagsView done={done} />
            )}
          </div>
        </>
      )}
    </PageShell>
  )
}