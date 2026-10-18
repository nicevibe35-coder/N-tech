import { invalidate } from '../hooks/useQuery'
import { ServiceError } from './errors'
import { supabase } from '../lib/supabase'

function toUser(row) {
  if (!row) return null
  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    avatarUrl: row.avatar_url ?? '',
    bio: row.bio ?? '',
    website: row.website ?? '',
  }
}

function toProject(row, viewerId) {
  if (!row) return null
  const members = (row.join_requests ?? [])
    .filter((r) => r.status === 'accepted')
    .map((r) => toUser(r.user))
    .filter(Boolean)

  const viewerRequest = viewerId
    ? (row.join_requests ?? []).find((r) => r.user_id === viewerId) ?? null
    : null

  return {
    id: row.id,
    ownerId: row.owner_id,
    title: row.title,
    summary: row.summary,
    stack: row.stack ?? [],
    roles: row.roles ?? [],
    status: row.status,
    createdAt: row.created_at,
    owner: toUser(row.owner),
    members,
    viewerRequest: viewerRequest
      ? {
          id: viewerRequest.id,
          userId: viewerRequest.user_id,
          projectId: viewerRequest.project_id,
          message: viewerRequest.message ?? '',
          status: viewerRequest.status,
          createdAt: viewerRequest.created_at,
        }
      : null,
  }
}

const PROJECT_SELECT = `
  *,
  owner:profiles!projects_owner_id_fkey(*),
  join_requests(
    id, project_id, user_id, message, status, created_at,
    user:profiles!join_requests_user_id_fkey(*)
  )
`

export async function listProjects({ status = 'all', involvingUserId, viewerId = null } = {}) {
  let query = supabase
    .from('projects')
    .select(PROJECT_SELECT)
    .order('created_at', { ascending: false })

  if (status !== 'all') {
    query = query.eq('status', status)
  }

  const { data, error } = await query
  if (error) throw new ServiceError('FETCH', error.message)

  let projects = (data ?? []).map((row) => toProject(row, viewerId))

  if (involvingUserId) {
    projects = projects.filter(
      (p) => p.ownerId === involvingUserId || p.members.some((m) => m.id === involvingUserId),
    )
  }

  return projects
}

export async function getProject(id, viewerId) {
  const { data, error } = await supabase
    .from('projects')
    .select(PROJECT_SELECT)
    .eq('id', id)
    .maybeSingle()

  if (error) throw new ServiceError('FETCH', error.message)
  if (!data) throw new ServiceError('NOT_FOUND', 'That project does not exist or was removed.')
  return toProject(data, viewerId)
}

export async function createProject(ownerId, input) {
  const title = input.title.trim()
  const summary = input.summary.trim()
  const stack = input.stack ?? []
  const roles = input.roles ?? []

  if (title.length < 3) throw new ServiceError('VALIDATION', 'Title is too short.')
  if (summary.length < 10) throw new ServiceError('VALIDATION', 'Summary is too short.')
  if (stack.length === 0) throw new ServiceError('VALIDATION', 'Add at least one technology.')

  const { data, error } = await supabase
    .from('projects')
    .insert({
      owner_id: ownerId,
      title,
      summary,
      stack,
      roles,
      status: 'open',
    })
    .select(PROJECT_SELECT)
    .single()

  if (error) throw new ServiceError('WRITE', error.message)
  invalidate('projects')
  return toProject(data, ownerId)
}

export async function setProjectStatus(ownerId, projectId, status) {
  const { error } = await supabase
    .from('projects')
    .update({ status })
    .eq('id', projectId)

  if (error) throw new ServiceError('WRITE', error.message)
  invalidate('projects')
  invalidate('project')
}

export async function deleteProject(ownerId, projectId) {
  const { error } = await supabase.from('projects').delete().eq('id', projectId)
  if (error) throw new ServiceError('DELETE', error.message)
  invalidate('projects')
  invalidate('project')
}

export async function requestToJoin(userId, projectId, message) {
  const { error } = await supabase
    .from('join_requests')
    .insert({
      project_id: projectId,
      user_id: userId,
      message: (message ?? '').trim(),
      status: 'pending',
    })

  if (error) throw new ServiceError('WRITE', error.message)
  invalidate('project')
  invalidate('requests')
}

/** Withdraws a pending request or leaves a project. */
export async function cancelMembership(userId, requestId) {
  const { error } = await supabase.from('join_requests').delete().eq('id', requestId)
  if (error) throw new ServiceError('DELETE', error.message)
  invalidate('project')
  invalidate('requests')
}

export async function listRequests(ownerId, projectId) {
  const { data, error } = await supabase
    .from('join_requests')
    .select('*, user:profiles!join_requests_user_id_fkey(*)')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  if (error) throw new ServiceError('FETCH', error.message)

  const order = { pending: 0, accepted: 1, declined: 2 }
  return (data ?? [])
    .map((row) => ({
      id: row.id,
      projectId: row.project_id,
      userId: row.user_id,
      message: row.message ?? '',
      status: row.status,
      createdAt: row.created_at,
      user: toUser(row.user),
    }))
    .sort((a, b) => order[a.status] - order[b.status] || b.createdAt.localeCompare(a.createdAt))
}

export async function decideRequest(ownerId, requestId, decision) {
  const { error } = await supabase
    .from('join_requests')
    .update({ status: decision })
    .eq('id', requestId)

  if (error) throw new ServiceError('WRITE', error.message)
  invalidate('project')
  invalidate('requests')
}