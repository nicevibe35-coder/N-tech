import { useState } from 'react'
import { LIMITS, validateText } from '../lib/validation'
import { errorMessage } from '../services/errors'
import { createPost } from '../services/postService'

import { Avatar } from './ui/Avatar'
import { Button } from './ui/Button'
import { TextArea } from './ui/Field'
import { InlineError } from './ui/States'

export function PostComposer({ user }) {
  const [body, setBody] = useState('')
  const [code, setCode] = useState('')
  const [showCode, setShowCode] = useState(false)
  const [bodyError, setBodyError] = useState(null)
  const [codeError, setCodeError] = useState(null)
  const [actionError, setActionError] = useState(null)
  const [busy, setBusy] = useState(false)

  async function submit(event) {
    event.preventDefault()
    const bodyProblem = validateText(body, { label: 'Your update', max: LIMITS.post.max })
    const codeProblem =
      showCode && code.length > LIMITS.code.max ? `Code must be ${LIMITS.code.max} characters or fewer.` : null
    setBodyError(bodyProblem)
    setCodeError(codeProblem)
    if (bodyProblem || codeProblem) return

    setBusy(true)
    setActionError(null)
    try {
      await createPost(user.id, { body, code: showCode ? code : '' })
      setBody('')
      setCode('')
      setShowCode(false)
    } catch (failure) {
      setActionError(errorMessage(failure))
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} noValidate aria-label="Share an update" className="rounded-lg border border-line p-5">
      <div className="flex gap-3">
        <Avatar name={user.displayName} />
        <div className="min-w-0 flex-1 space-y-3">
          <TextArea
            label="What are you working on or learning?"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            maxLength={LIMITS.post.max}
            error={bodyError}
            rows={3}
          />
          {showCode ? (
            <TextArea
              label="Code snippet"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              maxLength={LIMITS.code.max}
              error={codeError}
              spellCheck={false}
              className="font-mono"
              rows={6}
            />
          ) : null}
          <InlineError message={actionError} />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCode((current) => !current)}
              aria-pressed={showCode}
            >
              {showCode ? 'Remove code snippet' : 'Add code snippet'}
            </Button>
            <Button type="submit" loading={busy}>
              Post update
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
