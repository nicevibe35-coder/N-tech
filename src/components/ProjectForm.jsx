import { useState } from 'react'
import { LIMITS, parseTags, validateTags, validateText } from '../lib/validation'
import { errorMessage } from '../services/errors'
import { createProject } from '../services/projectService'

import { Button } from './ui/Button'
import { TextArea, TextField } from './ui/Field'
import { InlineError } from './ui/States'

export function ProjectForm({ user, onCreated }) {
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [stack, setStack] = useState('')
  const [roles, setRoles] = useState('')
  const [errors, setErrors] = useState({})
  const [actionError, setActionError] = useState(null)
  const [busy, setBusy] = useState(false)

  async function submit(event) {
    event.preventDefault()
    const stackTags = parseTags(stack)
    const roleTags = parseTags(roles)
    const next = {
      title: validateText(title, { label: 'Title', min: LIMITS.projectTitle.min, max: LIMITS.projectTitle.max }),
      summary: validateText(summary, {
        label: 'Summary',
        min: LIMITS.projectSummary.min,
        max: LIMITS.projectSummary.max,
      }),
      stack: validateTags(stackTags, { label: 'technology', min: 1 }),
      roles: validateTags(roleTags, { label: 'role', min: 0 }),
    }
    setErrors(next)
    if (Object.values(next).some(Boolean)) return

    setBusy(true)
    setActionError(null)
    try {
      const project = await createProject(user.id, { title, summary, stack: stackTags, roles: roleTags })
      onCreated(project)
    } catch (failure) {
      setActionError(errorMessage(failure))
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <TextField
        label="Title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        maxLength={LIMITS.projectTitle.max}
        error={errors.title}
        autoComplete="off"
      />
      <TextArea
        label="What are you building?"
        hint="Say what it does and what you want to learn or ship."
        value={summary}
        onChange={(event) => setSummary(event.target.value)}
        maxLength={LIMITS.projectSummary.max}
        error={errors.summary}
        rows={4}
      />
      <TextField
        label="Technologies"
        hint="Separate with commas, for example: React, Node.js, PostgreSQL"
        value={stack}
        onChange={(event) => setStack(event.target.value)}
        error={errors.stack}
        autoComplete="off"
      />
      <TextField
        label="Roles you need (optional)"
        hint="For example: Frontend developer, Designer"
        value={roles}
        onChange={(event) => setRoles(event.target.value)}
        error={errors.roles}
        autoComplete="off"
      />
      <InlineError message={actionError} />
      <div className="flex justify-end">
        <Button type="submit" loading={busy}>
          Post project
        </Button>
      </div>
    </form>
  )
}
