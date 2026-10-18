import { useState } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { TextField } from '../components/ui/Field'
import { PageShell } from '../components/ui/PageShell'
import { InlineError } from '../components/ui/States'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { safeInternalPath } from '../lib/format'
import { LIMITS, validateDisplayName, validateUsername } from '../lib/validation'
import { signInWithEmail, signInWithGitHub, signUpWithEmail } from '../services/authService'
import { errorMessage } from '../services/errors'

export default function SignInPage() {
  useDocumentTitle('Sign in')
  const user = useCurrentUser()
  const [params] = useSearchParams()
  const next = safeInternalPath(params.get('next'))

  const [mode, setMode] = useState('create')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [errors, setErrors] = useState({})
  const [actionError, setActionError] = useState(null)
  const [busy, setBusy] = useState(false)

  if (user) return <Navigate to={next} replace />

  function switchMode(target) {
    setMode(target)
    setErrors({})
    setActionError(null)
  }

  async function submit(event) {
    event.preventDefault()
    const nextErrors = { email: null, password: null, username: null, displayName: null }

    if (!email.trim() || !email.includes('@')) nextErrors.email = 'Enter a valid email address.'
    if (password.length < 6) nextErrors.password = 'Password must be at least 6 characters.'

    if (mode === 'create') {
      nextErrors.username = validateUsername(username)
      nextErrors.displayName = validateDisplayName(displayName)
    }

    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) return

    setBusy(true)
    setActionError(null)
    try {
      if (mode === 'create') {
        await signUpWithEmail({ email, password, username, displayName })
      } else {
        await signInWithEmail(email, password)
      }
    } catch (failure) {
      setActionError(errorMessage(failure))
      setBusy(false)
    }
  }

  async function github() {
    setActionError(null)
    setBusy(true)
    try {
      await signInWithGitHub()
      // Browser will redirect to GitHub; no need to reset busy.
    } catch (failure) {
      setActionError(errorMessage(failure))
      setBusy(false)
    }
  }

  return (
    <PageShell width="narrow">
      <div className="mx-auto max-w-md">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">
          {mode === 'create' ? 'Create your account' : 'Welcome back'}
        </h1>
        <p className="mt-3 text-muted">
          {mode === 'create'
            ? 'Sign up with email or GitHub to start learning and sharing.'
            : 'Sign in to continue where you left off.'}
        </p>

        <button
          type="button"
          onClick={github}
          disabled={busy}
          className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-line bg-canvas text-sm font-medium text-ink transition-colors hover:bg-subtle disabled:opacity-50"
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.66-.22.66-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.1-1.46-1.1-1.46-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86v2.76c0 .27.16.58.67.48A10 10 0 0 0 22 12c0-5.52-4.48-10-10-10Z" />
          </svg>
          Continue with GitHub
        </button>

        <div className="my-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-line" />
          <span className="text-xs uppercase tracking-wide text-muted">or with email</span>
          <span className="h-px flex-1 bg-line" />
        </div>

        <div
          role="group"
          aria-label="Choose how to continue"
          className="grid grid-cols-2 rounded-lg border border-line p-1"
        >
          {['create', 'signin'].map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={mode === value}
              onClick={() => switchMode(value)}
              className={`h-10 rounded-md text-sm font-medium transition-colors ${
                mode === value ? 'bg-ink text-canvas' : 'text-muted hover:text-ink'
              }`}
            >
              {value === 'create' ? 'New account' : 'I have an account'}
            </button>
          ))}
        </div>

        <form onSubmit={submit} noValidate className="mt-6 space-y-4">
          <TextField
            label="Email"
            type="email"
            inputMode="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={errors.email}
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={errors.password}
            hint={mode === 'create' ? 'At least 6 characters.' : undefined}
            autoComplete={mode === 'create' ? 'new-password' : 'current-password'}
          />

          {mode === 'create' ? (
            <>
              <TextField
                label="Username"
                hint={`${LIMITS.username.min} to ${LIMITS.username.max} letters, numbers or underscores`}
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                error={errors.username}
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
              />
              <TextField
                label="Display name"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                maxLength={LIMITS.displayName.max}
                error={errors.displayName}
                autoComplete="name"
              />
            </>
          ) : null}

          <InlineError message={actionError} />
          <Button type="submit" loading={busy} className="w-full">
            {mode === 'create' ? 'Create account' : 'Sign in'}
          </Button>
        </form>
      </div>
    </PageShell>
  )
}