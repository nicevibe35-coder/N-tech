import { useState } from 'react'
import { LIMITS, validateBio, validateDisplayName, validateWebsite } from '../lib/validation'
import { updateProfile } from '../services/authService'
import { errorMessage } from '../services/errors'

import { Button } from './ui/Button'
import { TextArea, TextField } from './ui/Field'
import { InlineError } from './ui/States'

export function ProfileForm({ user, onSaved }) {
  const [displayName, setDisplayName] = useState(user.displayName)
  const [bio, setBio] = useState(user.bio)
  const [website, setWebsite] = useState(user.website)
  const [errors, setErrors] = useState({})
  const [actionError, setActionError] = useState(null)
  const [busy, setBusy] = useState(false)

  async function submit(event) {
    event.preventDefault()
    const next = {
      displayName: validateDisplayName(displayName),
      bio: validateBio(bio),
      website: validateWebsite(website),
    }
    setErrors(next)
    if (Object.values(next).some(Boolean)) return

    setBusy(true)
    setActionError(null)
    try {
      await updateProfile(user.id, { displayName, bio, website })
      onSaved()
    } catch (failure) {
      setActionError(errorMessage(failure))
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <TextField
        label="Name"
        value={displayName}
        onChange={(event) => setDisplayName(event.target.value)}
        maxLength={LIMITS.displayName.max}
        error={errors.displayName}
        autoComplete="name"
      />
      <TextArea
        label="Bio (optional)"
        value={bio}
        onChange={(event) => setBio(event.target.value)}
        maxLength={LIMITS.bio.max}
        error={errors.bio}
        rows={3}
      />
      <TextField
        label="Website (optional)"
        type="url"
        inputMode="url"
        value={website}
        onChange={(event) => setWebsite(event.target.value)}
        error={errors.website}
        autoComplete="url"
        placeholder="https://"
      />
      <InlineError message={actionError} />
      <div className="flex justify-end">
        <Button type="submit" loading={busy}>
          Save profile
        </Button>
      </div>
    </form>
  )
}
