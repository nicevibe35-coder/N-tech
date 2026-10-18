import { ServiceError } from '../services/errors'
import { supabase } from '../lib/supabase'

function toMaterial(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    url: row.url,
    category: row.category,
  }
}

export async function listMaterials() {
  const { data, error } = await supabase
    .from('materials')
    .select('id, title, description, url, category, position')
    .order('position', { ascending: true })

  if (error) throw new ServiceError('FETCH', error.message)
  return (data ?? []).map(toMaterial)
}

export async function getMaterial(id) {
  const { data, error } = await supabase
    .from('materials')
    .select('id, title, description, url, category')
    .eq('id', id)
    .maybeSingle()

  if (error) throw new ServiceError('FETCH', error.message)
  return data ? toMaterial(data) : null
}

export async function getMaterialCategories() {
  const { data, error } = await supabase
    .from('materials')
    .select('category')
    .order('position', { ascending: true })

  if (error) throw new ServiceError('FETCH', error.message)
  return [...new Set((data ?? []).map((row) => row.category))]
}