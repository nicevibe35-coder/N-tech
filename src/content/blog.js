import { ServiceError } from '../services/errors'
import { supabase } from '../lib/supabase'

function toPost(row) {
  if (!row) return null
  return {
    slug: row.slug,
    title: row.title,
    date: row.published_at,
    summary: row.summary ?? '',
    tags: row.tags ?? [],
    body: row.body,
    minutes: row.minutes ?? 5,
  }
}

export async function listBlogPosts() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('slug, title, summary, body, tags, minutes, published_at')
    .eq('published', true)
    .order('published_at', { ascending: false })

  if (error) throw new ServiceError('FETCH', error.message)
  return (data ?? []).map(toPost)
}

export async function getBlogPost(slug) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('slug, title, summary, body, tags, minutes, published_at')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle()

  if (error) throw new ServiceError('FETCH', error.message)
  return toPost(data)
}

export async function getBlogTags() {
  const posts = await listBlogPosts()
  return [...new Set(posts.flatMap((p) => p.tags))].sort()
}