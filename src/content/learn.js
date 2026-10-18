import { ServiceError } from '../services/errors'
import { supabase } from '../lib/supabase'

function toTrack(row) {
  return {
    slug: row.slug,
    title: row.title,
    summary: row.summary ?? '',
    level: row.level ?? 'Beginner',
  }
}

function toLesson(row) {
  return {
    trackSlug: row.track?.slug ?? row.track_slug ?? '',
    slug: row.slug,
    title: row.title,
    summary: row.summary ?? '',
    minutes: row.minutes ?? 5,
    body: row.body,
  }
}

export async function getTracks() {
  const { data, error } = await supabase
    .from('tracks')
    .select('slug, title, summary, level, position')
    .order('position', { ascending: true })

  if (error) throw new ServiceError('FETCH', error.message)
  return (data ?? []).map(toTrack)
}

export async function getTrack(slug) {
  const { data, error } = await supabase
    .from('tracks')
    .select('slug, title, summary, level')
    .eq('slug', slug)
    .maybeSingle()

  if (error) throw new ServiceError('FETCH', error.message)
  return data ? toTrack(data) : null
}

export async function getLessons(trackSlug) {
  const track = await getTrack(trackSlug)
  if (!track) return []

  const { data: trackRow, error: trackError } = await supabase
    .from('tracks')
    .select('id')
    .eq('slug', trackSlug)
    .single()

  if (trackError) throw new ServiceError('FETCH', trackError.message)

  const { data, error } = await supabase
    .from('lessons')
    .select('slug, title, summary, minutes, position')
    .eq('track_id', trackRow.id)
    .order('position', { ascending: true })

  if (error) throw new ServiceError('FETCH', error.message)
  return (data ?? []).map((row) => ({ ...toLesson(row), trackSlug }))
}

export async function getLesson(trackSlug, lessonSlug) {
  const { data: trackRow, error: trackError } = await supabase
    .from('tracks')
    .select('id')
    .eq('slug', trackSlug)
    .maybeSingle()

  if (trackError) throw new ServiceError('FETCH', trackError.message)
  if (!trackRow) return null

  const { data, error } = await supabase
    .from('lessons')
    .select('slug, title, summary, minutes, body')
    .eq('track_id', trackRow.id)
    .eq('slug', lessonSlug)
    .maybeSingle()

  if (error) throw new ServiceError('FETCH', error.message)
  return data ? { ...toLesson(data), trackSlug } : null
}

export function lessonRef(trackSlug, lessonSlug) {
  return `${trackSlug}/${lessonSlug}`
}