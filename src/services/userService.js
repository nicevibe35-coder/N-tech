import { supabase } from '../lib/supabase'
import { ServiceError } from './errors'

// ---------- New Supabase-backed API ----------

function toProfile(row) {
  if (!row) return null
  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    bio: row.bio ?? '',
    website: row.website ?? '',
    avatarUrl: row.avatar_url ?? '',
    role: row.role ?? 'member',
    createdAt: row.created_at,
  }
}

export async function getUserByUsername(username) {
  const wanted = username.trim().toLowerCase()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', wanted)
    .maybeSingle()

  if (error) throw new ServiceError('FETCH', error.message)
  return toProfile(data)
}

export async function getMyProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (error) throw new ServiceError('FETCH', error.message)
  return toProfile(data)
}

// ---------- Legacy stubs (kept so the old services import cleanly) ----------
// These are temporary. Each old service that uses them will be migrated to
// Supabase in a later batch, and once none import them, we delete this block.

export const USERS_KEY = 'users'

export function listUsers() {
  return []
}

export function findUserById() {
  return null
}

export function requireUser(id) {
  if (!id) throw new ServiceError('UNAUTHENTICATED', 'Sign in to continue.')
  return { id }
}