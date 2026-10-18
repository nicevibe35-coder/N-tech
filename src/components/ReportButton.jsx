import { useState } from 'react'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { Dialog } from './ui/Dialog'
import { Button } from './ui/Button'
import { TextArea } from './ui/Field'
import { InlineError } from './ui/States'
import { supabase } from '../lib/supabase'

export function ReportButton({ kind, targetId, label = 'Report' }) {
  const user = useCurrentUser()
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const [done, setDone] = useState(false)

  if (!user) return null

  async function submit() {
    const trimmed = reason.trim()
    if (!trimmed) {
      setError('Tell us what is wrong.')
      return
    }
    setBusy(true)
    setError(null)
    const { error: dbError } = await supabase
      .from('reports')
      .insert({
        reporter_id: user.id,
        target_kind: kind,
        target_id: targetId,
        reason: trimmed,
      })
    if (dbError) {
      setError(dbError.message)
      setBusy(false)
      return
    }
    setBusy(false)
    setDone(true)
  }

  function close() {
    setOpen(false)
    setReason('')
    setError(null)
    setDone(false)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-muted transition-colors hover:bg-subtle hover:text-ink"
      >
        {label}
      </button>
      <Dialog open={open} onClose={close} title="Report content">
        {done ? (
          <div className="space-y-3">
            <p className="text-sm text-muted">
              Thanks — the moderators will look at this.
            </p>
            <div className="flex justify-end">
              <Button onClick={close}>Close</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted">
              Explain why this should be reviewed. Be specific — it helps the moderators.
            </p>
            <TextArea
              label="Reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              maxLength={500}
            />
            <InlineError message={error} />
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={close} disabled={busy}>
                Cancel
              </Button>
              <Button loading={busy} onClick={submit}>
                Send report
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </>
  )
}