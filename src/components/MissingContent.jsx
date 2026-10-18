import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { buttonStyles } from './ui/button-styles'
import { PageShell } from './ui/PageShell'

export function MissingContent({ title, message, backTo, backLabel }) {
  useDocumentTitle(title)
  return (
    <PageShell width="narrow">
      <div role="alert" className="py-12">
        <p className="font-mono text-sm text-muted">404</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink">{title}</h1>
        <p className="mt-4 text-muted">{message}</p>
        <Link to={backTo} className={`${buttonStyles('primary')} mt-8`}>
          {backLabel}
        </Link>
      </div>
    </PageShell>
  )
}
