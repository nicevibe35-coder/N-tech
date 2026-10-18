import { invalidate } from '../hooks/useQuery'
import { ServiceError } from './errors'
import { supabase } from '../lib/supabase'

export async function listProgress(userId) {
  const { data, error } = await supabase
    .from('progress')
    .select('track_slug, lesson_slug, completed_at')
    .eq('user_id', userId)

  if (error) throw new ServiceError('FETCH', error.message)

  return (data ?? []).map((row) => ({
    userId,
    trackSlug: row.track_slug,
    lessonSlug: row.lesson_slug,
    completedAt: row.completed_at,
  }))
}

export async function setLessonComplete(userId, trackSlug, lessonSlug, done) {
  if (done) {
    const { error } = await supabase
      .from('progress')
      .upsert(
        { user_id: userId, track_slug: trackSlug, lesson_slug: lessonSlug },
        { onConflict: 'user_id,track_slug,lesson_slug' },
      )
    if (error) throw new ServiceError('WRITE', error.message)
  } else {
    const { error } = await supabase
      .from('progress')
      .delete()
      .eq('user_id', userId)
      .eq('track_slug', trackSlug)
      .eq('lesson_slug', lessonSlug)
    if (error) throw new ServiceError('DELETE', error.message)
  }

  invalidate('progress')
}