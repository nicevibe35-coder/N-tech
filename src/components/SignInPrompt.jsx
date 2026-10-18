import { Link } from 'react-router-dom'
import { useSignInHref } from '../hooks/useSignInHref'
import { buttonStyles } from './ui/button-styles'

export function SignInPrompt({ action }) {
  const href = useSignInHref()
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-line bg-subtle px-5 py-4">
      <p className="text-sm text-muted">Sign in to {action}.</p>
      <Link to={href} className={buttonStyles('primary', 'sm')}>
        Sign in
      </Link>
    </div>
  )
}
