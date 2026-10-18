import { useCurrentUser, useAuthLoading } from '../hooks/useCurrentUser'
import { Loading } from '../components/ui/States'
import { MissingContent } from '../components/MissingContent'

export function AdminGuard({ children }) {
  const user = useCurrentUser()
  const loading = useAuthLoading()

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
        <Loading label="Checking access…" />
      </div>
    )
  }

  if (!user || user.role !== 'admin') {
    return (
      <MissingContent
        title="Page not found"
        message="This page does not exist."
        backTo="/"
        backLabel="Back to home"
      />
    )
  }

  return children
}