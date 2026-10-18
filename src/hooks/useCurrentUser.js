import { useAuthContext } from '../auth/auth-context'

export function useCurrentUser() {
  return useAuthContext().user
}

export function useAuthLoading() {
  return useAuthContext().loading
}