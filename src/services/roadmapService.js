import { invalidate } from '../hooks/useQuery'
import { ServiceError } from './errors'
import { supabase } from '../lib/supabase'

export async function loadRoadmap(userId) {
  const { data, error } = await supabase
    .from('roadmap_progress')
    .select('name, done')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw new ServiceError('FETCH', error.message)
  return data ?? { name: '', done: {} }
}

export async function saveRoadmap(userId, { name, done }) {
  const { error } = await supabase
    .from('roadmap_progress')
    .upsert(
      {
        user_id: userId,
        name,
        done,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' },
    )

  if (error) throw new ServiceError('WRITE', error.message)
  invalidate('roadmap')
}