import { invalidate } from '../hooks/useQuery'
import { ServiceError } from './errors'
import { supabase } from '../lib/supabase'

export async function listBookmarks(userId) {
  const { data, error } = await supabase
    .from('bookmarks')
    .select('kind, ref, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw new ServiceError('FETCH', error.message)

  return (data ?? []).map((row) => ({
    userId,
    kind: row.kind,
    ref: row.ref,
    createdAt: row.created_at,
  }))
}

/** Returns whether the item is saved after the toggle. */
export async function toggleBookmark(userId, kind, ref) {
  const { data: existing, error: readError } = await supabase
    .from('bookmarks')
    .select('kind')
    .eq('user_id', userId)
    .eq('kind', kind)
    .eq('ref', ref)
    .maybeSingle()

  if (readError) throw new ServiceError('FETCH', readError.message)

  if (existing) {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('user_id', userId)
      .eq('kind', kind)
      .eq('ref', ref)

    if (error) throw new ServiceError('DELETE', error.message)
    invalidate('bookmarks')
    return false
  }

  const { error } = await supabase
    .from('bookmarks')
    .insert({ user_id: userId, kind, ref })

  if (error) throw new ServiceError('WRITE', error.message)
  invalidate('bookmarks')
  return true
}