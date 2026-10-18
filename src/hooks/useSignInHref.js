import { useLocation } from 'react-router-dom'

/** Link to the sign-in page that returns the person to where they were. */
export function useSignInHref() {
  const { pathname, search } = useLocation()
  return `/signin?next=${encodeURIComponent(pathname + search)}`
}
