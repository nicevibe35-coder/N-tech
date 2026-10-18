import { supabase } from '../lib/supabase'
import { ServiceError } from './errors'

function wrap(error, fallback) {
  if (!error) return null
  return new ServiceError(error.status?.toString() ?? 'AUTH', error.message || fallback)
}

export async function signUpWithEmail({ email, password, username, displayName }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        display_name: displayName,
      },
    },
  })
  if (error) throw wrap(error, 'Could not create your account.')
  return data.user
}

export async function signInWithEmail(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw wrap(error, 'Could not sign you in.')
  return data.user
}

export async function signInWithGitHub() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: window.location.origin,
    },
  })
  if (error) throw wrap(error, 'Could not start GitHub sign-in.')
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw wrap(error, 'Could not sign you out.')
}

export async function updateProfile(userId, { displayName, bio, website }) {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      display_name: displayName,
      bio: bio ?? '',
      website: website ?? '',
    })
    .eq('id', userId)
    .select()
    .single()
  if (error) throw wrap(error, 'Could not save your profile.')
  return data
}