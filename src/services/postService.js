import { invalidate } from '../hooks/useQuery'
import { ServiceError } from './errors'
import { supabase } from '../lib/supabase'

function toPost(row) {
  if (!row) return null
  return {
    id: row.id,
    authorId: row.author_id,
    body: row.body,
    code: row.code ?? '',
    createdAt: row.created_at,
    author: row.author
      ? {
          id: row.author.id,
          username: row.author.username,
          displayName: row.author.display_name,
          avatarUrl: row.author.avatar_url ?? '',
          bio: row.author.bio ?? '',
          website: row.author.website ?? '',
        }
      : null,
  }
}

export async function listPosts({ limit = 20, offset = 0, authorId } = {}) {
  let query = supabase
    .from('posts')
    .select('*, author:profiles!posts_author_id_fkey(*)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (authorId) {
    query = query.eq('author_id', authorId)
  }

  const { data, error, count } = await query
  if (error) throw new ServiceError('FETCH', error.message)

  return {
    items: (data ?? []).map(toPost),
    total: count ?? 0,
  }
}

export async function createPost(authorId, { body, code = '' }) {
  const trimmedBody = body.trim()
  if (!trimmedBody) throw new ServiceError('VALIDATION', 'Post can’t be empty.')

  const { data, error } = await supabase
    .from('posts')
    .insert({ author_id: authorId, body: trimmedBody, code: code.replace(/\s+$/, '') })
    .select('*, author:profiles!posts_author_id_fkey(*)')
    .single()

  if (error) throw new ServiceError('CREATE', error.message)

  invalidate('feed')
  invalidate('profile-posts')
  return toPost(data)
}

export async function deletePost(userId, postId) {
  const { error } = await supabase.from('posts').delete().eq('id', postId)
  if (error) throw new ServiceError('DELETE', error.message)

  invalidate('feed')
  invalidate('profile-posts')
}