import { invalidate } from '../hooks/useQuery'
import { ServiceError } from './errors'
import { supabase } from '../lib/supabase'

const KIND_TARGET = (target) => ({
  target_kind: target.kind,
  target_id: target.id,
})

function toComment(row) {
  if (!row) return null
  return {
    id: row.id,
    targetKind: row.target_kind,
    targetId: row.target_id,
    authorId: row.author_id,
    body: row.body,
    createdAt: row.created_at,
    author: row.author
      ? {
          id: row.author.id,
          username: row.author.username,
          displayName: row.author.display_name,
          avatarUrl: row.author.avatar_url ?? '',
        }
      : null,
  }
}

export async function getEngagement(target, viewerId) {
  const { count: likeCount, error: likeError } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('target_kind', target.kind)
    .eq('target_id', target.id)

  if (likeError) throw new ServiceError('FETCH', likeError.message)

  let liked = false
  if (viewerId) {
    const { data, error } = await supabase
      .from('likes')
      .select('user_id')
      .eq('target_kind', target.kind)
      .eq('target_id', target.id)
      .eq('user_id', viewerId)
      .maybeSingle()
    if (error) throw new ServiceError('FETCH', error.message)
    liked = Boolean(data)
  }

  const { count: commentCount, error: commentError } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true })
    .eq('target_kind', target.kind)
    .eq('target_id', target.id)

  if (commentError) throw new ServiceError('FETCH', commentError.message)

  return {
    likeCount: likeCount ?? 0,
    liked,
    commentCount: commentCount ?? 0,
  }
}

/** Returns whether the item is liked after the toggle. */
export async function toggleLike(userId, target) {
  const { data: existing, error: readError } = await supabase
    .from('likes')
    .select('user_id')
    .eq('target_kind', target.kind)
    .eq('target_id', target.id)
    .eq('user_id', userId)
    .maybeSingle()

  if (readError) throw new ServiceError('FETCH', readError.message)

  if (existing) {
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('target_kind', target.kind)
      .eq('target_id', target.id)
      .eq('user_id', userId)

    if (error) throw new ServiceError('DELETE', error.message)
    invalidate('engagement')
    return false
  }

  const { error } = await supabase
    .from('likes')
    .insert({ ...KIND_TARGET(target), user_id: userId })

  if (error) throw new ServiceError('WRITE', error.message)
  invalidate('engagement')
  return true
}

export async function listComments(target) {
  const { data, error } = await supabase
    .from('comments')
    .select('*, author:profiles!comments_author_id_fkey(*)')
    .eq('target_kind', target.kind)
    .eq('target_id', target.id)
    .order('created_at', { ascending: true })

  if (error) throw new ServiceError('FETCH', error.message)
  return (data ?? []).map(toComment)
}

export async function addComment(userId, target, body) {
  const trimmed = body.trim()
  if (!trimmed) throw new ServiceError('VALIDATION', 'Comment can’t be empty.')

  const { data, error } = await supabase
    .from('comments')
    .insert({
      ...KIND_TARGET(target),
      author_id: userId,
      body: trimmed,
    })
    .select('*, author:profiles!comments_author_id_fkey(*)')
    .single()

  if (error) throw new ServiceError('WRITE', error.message)
  invalidate('comments')
  return toComment(data)
}

export async function deleteComment(userId, commentId) {
  const { error } = await supabase.from('comments').delete().eq('id', commentId)
  if (error) throw new ServiceError('DELETE', error.message)
  invalidate('comments')
}

/** Used when the thing being discussed is deleted, so no orphans are left behind. */
export async function removeEngagementFor(target) {
  await supabase
    .from('likes')
    .delete()
    .eq('target_kind', target.kind)
    .eq('target_id', target.id)

  await supabase
    .from('comments')
    .delete()
    .eq('target_kind', target.kind)
    .eq('target_id', target.id)
}