import { useState } from 'react'
import { useQuery } from '../hooks/useQuery'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { Button } from '../components/ui/Button'
import { Dialog } from '../components/ui/Dialog'
import { TextArea, TextField } from '../components/ui/Field'
import { FileUpload } from '../components/FileUpload'
import { InlineError, Loading } from '../components/ui/States'
import { supabase } from '../lib/supabase'

const TABS = [
  { key: 'blog', label: 'Blog' },
  { key: 'tracks', label: 'Tracks' },
  { key: 'lessons', label: 'Lessons' },
  { key: 'materials', label: 'Materials' },
]

async function fetchTable(key) {
  if (key === 'blog') {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('published_at', { ascending: false })
    if (error) throw new Error(error.message)
    return data ?? []
  }
  if (key === 'tracks') {
    const { data, error } = await supabase
      .from('tracks')
      .select('*')
      .order('position', { ascending: true })
    if (error) throw new Error(error.message)
    return data ?? []
  }
  if (key === 'lessons') {
    const { data, error } = await supabase
      .from('lessons')
      .select('*, track:tracks(slug, title)')
      .order('position', { ascending: true })
    if (error) throw new Error(error.message)
    return data ?? []
  }
  const { data, error } = await supabase
    .from('materials')
    .select('*')
    .order('position', { ascending: true })
  if (error) throw new Error(error.message)
  return data ?? []
}

async function fetchTrackOptions() {
  const { data, error } = await supabase
    .from('tracks')
    .select('id, slug, title')
    .order('position', { ascending: true })
  if (error) throw new Error(error.message)
  return data ?? []
}

function BlogEditor({ item, onClose, onSaved }) {
  const [slug, setSlug] = useState(item?.slug ?? '')
  const [title, setTitle] = useState(item?.title ?? '')
  const [summary, setSummary] = useState(item?.summary ?? '')
  const [body, setBody] = useState(item?.body ?? '')
  const [tags, setTags] = useState((item?.tags ?? []).join(', '))
  const [minutes, setMinutes] = useState(item?.minutes ?? 5)
  const [published, setPublished] = useState(item?.published ?? true)
  const [coverUrl, setCoverUrl] = useState(item?.cover_url ?? '')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  async function save() {
    setBusy(true)
    setError(null)
    const payload = {
      slug: slug.trim(),
      title: title.trim(),
      summary: summary.trim(),
      body,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      minutes: Number(minutes) || 5,
      published,
      cover_url: coverUrl,
    }
    const { error: dbError } = item
      ? await supabase.from('blog_posts').update(payload).eq('id', item.id)
      : await supabase.from('blog_posts').insert(payload)
    if (dbError) {
      setError(dbError.message)
      setBusy(false)
      return
    }
    setBusy(false)
    onSaved()
  }

  return (
    <div className="space-y-4">
      <TextField label="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
      <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <TextField label="Summary" value={summary} onChange={(e) => setSummary(e.target.value)} />
      <TextArea label="Body (Markdown)" value={body} onChange={(e) => setBody(e.target.value)} rows={12} />
      <TextField label="Tags (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} />
      <TextField label="Minutes" type="number" value={minutes} onChange={(e) => setMinutes(e.target.value)} />
      <div>
        <p className="mb-2 text-sm font-medium text-ink">Cover image (optional)</p>
        <FileUpload
          label="Upload cover"
          folder="covers"
          accept="image/*"
          value={coverUrl}
          onUploaded={setCoverUrl}
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-ink">
        <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
        Published
      </label>
      <InlineError message={error} />
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose} disabled={busy}>Cancel</Button>
        <Button loading={busy} onClick={save}>{item ? 'Save' : 'Create'}</Button>
      </div>
    </div>
  )
}

function TrackEditor({ item, onClose, onSaved }) {
  const [slug, setSlug] = useState(item?.slug ?? '')
  const [title, setTitle] = useState(item?.title ?? '')
  const [summary, setSummary] = useState(item?.summary ?? '')
  const [level, setLevel] = useState(item?.level ?? 'Beginner')
  const [position, setPosition] = useState(item?.position ?? 0)
  const [coverUrl, setCoverUrl] = useState(item?.cover_url ?? '')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  async function save() {
    setBusy(true)
    setError(null)
    const payload = {
      slug: slug.trim().toLowerCase().replace(/\s+/g, '-'),
      title: title.trim(),
      summary: summary.trim(),
      level,
      position: Number(position) || 0,
      cover_url: coverUrl,
    }
    const { error: dbError } = item
      ? await supabase.from('tracks').update(payload).eq('id', item.id)
      : await supabase.from('tracks').insert(payload)
    if (dbError) {
      setError(dbError.message)
      setBusy(false)
      return
    }
    setBusy(false)
    onSaved()
  }

  return (
    <div className="space-y-4">
      <TextField
        label="Slug"
        hint="lowercase, hyphens only — e.g. react-basics"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
      />
      <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <TextArea label="Summary" value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} />
      <TextField label="Level" value={level} onChange={(e) => setLevel(e.target.value)} placeholder="Beginner" />
      <TextField label="Position" type="number" value={position} onChange={(e) => setPosition(e.target.value)} />
      <div>
        <p className="mb-2 text-sm font-medium text-ink">Cover image (optional)</p>
        <FileUpload
          label="Upload cover"
          folder="covers"
          accept="image/*"
          value={coverUrl}
          onUploaded={setCoverUrl}
        />
      </div>
      <InlineError message={error} />
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose} disabled={busy}>Cancel</Button>
        <Button loading={busy} onClick={save}>{item ? 'Save' : 'Create'}</Button>
      </div>
    </div>
  )
}

function LessonEditor({ item, onClose, onSaved }) {
  const { data: trackOptions, loading: loadingTracks } = useQuery('admin:tracks:options', () => fetchTrackOptions())
  const [trackId, setTrackId] = useState(item?.track_id ?? '')
  const [slug, setSlug] = useState(item?.slug ?? '')
  const [title, setTitle] = useState(item?.title ?? '')
  const [summary, setSummary] = useState(item?.summary ?? '')
  const [body, setBody] = useState(item?.body ?? '')
  const [minutes, setMinutes] = useState(item?.minutes ?? 5)
  const [position, setPosition] = useState(item?.position ?? 0)
  const [coverUrl, setCoverUrl] = useState(item?.cover_url ?? '')
  const [mediaUrl, setMediaUrl] = useState(item?.media_url ?? '')
  const [mediaKind, setMediaKind] = useState(item?.media_kind ?? 'video')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  async function save() {
    setBusy(true)
    setError(null)
    const payload = {
      track_id: trackId || null,
      slug: slug.trim().toLowerCase().replace(/\s+/g, '-'),
      title: title.trim(),
      summary: summary.trim(),
      body,
      minutes: Number(minutes) || 5,
      position: Number(position) || 0,
      cover_url: coverUrl,
      media_url: mediaUrl,
      media_kind: mediaKind,
    }
    if (!payload.track_id) {
      setError('Please choose a track.')
      setBusy(false)
      return
    }
    const { error: dbError } = item
      ? await supabase.from('lessons').update(payload).eq('id', item.id)
      : await supabase.from('lessons').insert(payload)
    if (dbError) {
      setError(dbError.message)
      setBusy(false)
      return
    }
    setBusy(false)
    onSaved()
  }

  return (
    <div className="space-y-4">
      {loadingTracks ? (
        <Loading label="Loading tracks…" />
      ) : (
        <label className="block">
          <span className="text-sm font-medium text-ink">Track</span>
          <select
            value={trackId}
            onChange={(e) => setTrackId(e.target.value)}
            className="mt-1.5 block h-11 w-full rounded-md border border-line bg-canvas px-3 text-sm text-ink"
          >
            <option value="">— choose a track —</option>
            {(trackOptions ?? []).map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        </label>
      )}
      <TextField label="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
      <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <TextField label="Summary" value={summary} onChange={(e) => setSummary(e.target.value)} />
      <TextArea
        label="Body (Markdown)"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={14}
        spellCheck={false}
      />
      <div className="grid grid-cols-2 gap-4">
        <TextField label="Minutes" type="number" value={minutes} onChange={(e) => setMinutes(e.target.value)} />
        <TextField label="Position" type="number" value={position} onChange={(e) => setPosition(e.target.value)} />
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-ink">Cover image (optional)</p>
        <FileUpload
          label="Upload cover"
          folder="covers"
          accept="image/*"
          value={coverUrl}
          onUploaded={setCoverUrl}
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-ink">Video or audio (optional)</p>
        <div className="mb-2 flex gap-4">
          <label className="flex items-center gap-2 text-sm text-ink">
            <input
              type="radio"
              checked={mediaKind === 'video'}
              onChange={() => setMediaKind('video')}
            />
            Video
          </label>
          <label className="flex items-center gap-2 text-sm text-ink">
            <input
              type="radio"
              checked={mediaKind === 'audio'}
              onChange={() => setMediaKind('audio')}
            />
            Audio
          </label>
        </div>
        <FileUpload
          label={mediaKind === 'video' ? 'Upload video' : 'Upload audio'}
          folder="media"
          accept={mediaKind === 'video' ? 'video/*' : 'audio/*'}
          value={mediaUrl}
          onUploaded={setMediaUrl}
        />
      </div>

      <InlineError message={error} />
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose} disabled={busy}>Cancel</Button>
        <Button loading={busy} onClick={save}>{item ? 'Save' : 'Create'}</Button>
      </div>
    </div>
  )
}

function MaterialEditor({ item, onClose, onSaved }) {
  const [id, setId] = useState(item?.id ?? '')
  const [title, setTitle] = useState(item?.title ?? '')
  const [description, setDescription] = useState(item?.description ?? '')
  const [url, setUrl] = useState(item?.url ?? '')
  const [category, setCategory] = useState(item?.category ?? 'Reference')
  const [position, setPosition] = useState(item?.position ?? 0)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  async function save() {
    setBusy(true)
    setError(null)
    const payload = {
      id: id.trim(),
      title: title.trim(),
      description: description.trim(),
      url: url.trim(),
      category: category.trim(),
      position: Number(position) || 0,
    }
    const { error: dbError } = item
      ? await supabase.from('materials').update(payload).eq('id', item.id)
      : await supabase.from('materials').insert(payload)
    if (dbError) {
      setError(dbError.message)
      setBusy(false)
      return
    }
    setBusy(false)
    onSaved()
  }

  return (
    <div className="space-y-4">
      <TextField label="ID" value={id} onChange={(e) => setId(e.target.value)} />
      <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <TextArea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
      <TextField label="URL" value={url} onChange={(e) => setUrl(e.target.value)} />
      <TextField label="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
      <TextField label="Position" type="number" value={position} onChange={(e) => setPosition(e.target.value)} />
      <InlineError message={error} />
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose} disabled={busy}>Cancel</Button>
        <Button loading={busy} onClick={save}>{item ? 'Save' : 'Create'}</Button>
      </div>
    </div>
  )
}

function EditorFor({ tab, item, onClose, onSaved }) {
  if (tab === 'blog') return <BlogEditor item={item} onClose={onClose} onSaved={onSaved} />
  if (tab === 'tracks') return <TrackEditor item={item} onClose={onClose} onSaved={onSaved} />
  if (tab === 'lessons') return <LessonEditor item={item} onClose={onClose} onSaved={onSaved} />
  if (tab === 'materials') return <MaterialEditor item={item} onClose={onClose} onSaved={onSaved} />
  return null
}

export default function AdminContent() {
  useDocumentTitle('Admin · Content')
  const [tab, setTab] = useState('blog')
  const [editing, setEditing] = useState(null)
  const [creating, setCreating] = useState(false)
  const { data, loading, reload } = useQuery(`admin:content:${tab}`, () => fetchTable(tab))

  function displayTitle(item) {
    if (tab === 'lessons') return `${item.title} · ${item.track?.title ?? ''}`
    return item.title
  }

  function displaySubtitle(item) {
    if (tab === 'blog') return `/blog/${item.slug} · ${item.published ? 'published' : 'draft'}`
    if (tab === 'tracks') return `/${item.slug} · ${item.level}`
    if (tab === 'lessons') return `/${item.slug} · ${item.minutes} min`
    return `${item.category} · ${item.url}`
  }

  const singular = { blog: 'post', tracks: 'track', lessons: 'lesson', materials: 'material' }[tab]

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div role="group" aria-label="Content type" className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              aria-pressed={tab === t.key}
              onClick={() => setTab(t.key)}
              className={`inline-flex h-9 items-center rounded-full border px-4 text-sm font-medium transition-colors ${
                tab === t.key
                  ? 'border-ink bg-ink text-canvas'
                  : 'border-line text-muted hover:bg-subtle hover:text-ink'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <Button onClick={() => setCreating(true)}>New {singular}</Button>
      </div>

      {loading ? <Loading label="Loading…" /> : null}

      {data && data.length === 0 ? (
        <p className="text-sm text-muted">
          No {tab} yet. Click “New {singular}” to add one.
        </p>
      ) : null}

      {data && data.length > 0 ? (
        <ul className="divide-y divide-line border-y border-line">
          {data.map((item) => (
            <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
              <div className="flex min-w-0 items-center gap-3">
                {item.cover_url ? (
                  <img
                    src={item.cover_url}
                    alt=""
                    className="size-12 shrink-0 rounded-lg border border-line object-cover"
                  />
                ) : null}
                <div className="min-w-0">
                  <p className="font-medium text-ink">{displayTitle(item)}</p>
                  <p className="text-sm text-muted">{displaySubtitle(item)}</p>
                </div>
              </div>
              <Button variant="secondary" size="sm" onClick={() => setEditing(item)}>
                Edit
              </Button>
            </li>
          ))}
        </ul>
      ) : null}

      <Dialog open={creating} onClose={() => setCreating(false)} title={`New ${singular}`}>
        <EditorFor
          tab={tab}
          item={null}
          onClose={() => setCreating(false)}
          onSaved={() => {
            setCreating(false)
            reload()
          }}
        />
      </Dialog>

      <Dialog open={Boolean(editing)} onClose={() => setEditing(null)} title={`Edit ${singular}`}>
        {editing ? (
          <EditorFor
            tab={tab}
            item={editing}
            onClose={() => setEditing(null)}
            onSaved={() => {
              setEditing(null)
              reload()
            }}
          />
        ) : null}
      </Dialog>
    </div>
  )
}