import { useState } from 'react'
import { errorMessage } from '../../services/errors'
import { Button } from './Button'
import { Dialog } from './Dialog'
import { InlineError } from './States'

export function ConfirmDialog({ open, title, message, confirmLabel, onConfirm, onClose }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  async function confirm() {
    setBusy(true)
    setError(null)
    try {
      await onConfirm()
      onClose()
    } catch (failure) {
      setError(errorMessage(failure))
    } finally {
      setBusy(false)
    }
  }

  function close() {
    setError(null)
    onClose()
  }

  return (
    <Dialog open={open} onClose={close} title={title}>
      <p className="text-sm text-muted">{message}</p>
      <div className="mt-4">
        <InlineError message={error} />
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={close} disabled={busy}>
          Cancel
        </Button>
        <Button variant="danger" onClick={confirm} loading={busy}>
          {confirmLabel}
        </Button>
      </div>
    </Dialog>
  )
}
