import { supabase } from '../lib/supabase'
import { ServiceError } from './errors'

const BUCKET = 'media'

/**
 * Uploads a File to the media bucket and returns its public URL.
 * @param {File} file
 * @param {string} folder e.g. 'covers', 'avatars', 'attachments'
 */
export async function uploadFile(file, folder = 'uploads') {
  if (!file) throw new ServiceError('VALIDATION', 'No file selected.')

  const ext = file.name.includes('.') ? file.name.split('.').pop() : ''
  const id = crypto.randomUUID()
  const path = `${folder}/${id}${ext ? '.' + ext : ''}`

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })
  if (error) throw new ServiceError('UPLOAD', error.message)

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

export async function deleteFileByUrl(url) {
  if (!url) return
  const marker = `/object/public/${BUCKET}/`
  const idx = url.indexOf(marker)
  if (idx === -1) return
  const path = url.slice(idx + marker.length)
  await supabase.storage.from(BUCKET).remove([path])
}