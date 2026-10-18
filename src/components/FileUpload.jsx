import { useRef, useState } from 'react'
import { Button } from './ui/Button'
import { InlineError } from './ui/States'
import { uploadFile } from '../services/storageService'

/**
 * A file input that uploads to Supabase storage and reports the public URL.
 * `accept` filters what the browser offers — e.g. "image/*", "video/*", "audio/*".
 */
export function FileUpload({ label = 'Upload file', folder = 'uploads', accept, onUploaded, value }) {
  const inputRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  async function pick(event) {
    const file = event.target.files?.[0]
    if (!file) return
    setBusy(true)
    setError(null)
    try {
      const url = await uploadFile(file, folder)
      onUploaded(url)
    } catch (failure) {
      setError(failure.message)
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="secondary"
          size="sm"
          loading={busy}
          onClick={() => inputRef.current?.click()}
        >
          {label}
        </Button>
        {value ? (
          <span className="truncate text-xs text-muted">Uploaded · {value.split('/').pop()}</span>
        ) : null}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={pick}
        className="hidden"
      />
      <InlineError message={error} />
      {value && accept?.startsWith('image') ? (
        <img src={value} alt="" className="max-h-32 rounded-lg border border-line object-cover" />
      ) : null}
      {value && accept?.startsWith('video') ? (
        <video src={value} controls className="max-h-56 w-full rounded-lg border border-line" />
      ) : null}
      {value && accept?.startsWith('audio') ? (
        <audio src={value} controls className="w-full" />
      ) : null}
    </div>
  )
}