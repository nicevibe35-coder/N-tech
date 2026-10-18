import { listBookmarks } from '../services/bookmarkService'

import { useCurrentUser } from './useCurrentUser'
import { useQuery } from './useQuery'

export function useBookmarks() {
  const user = useCurrentUser()
  const { data, loading, error } = useQuery(`bookmarks:${user?.id ?? 'anon'}`, () =>
    user ? listBookmarks(user.id) : Promise.resolve([]),
  )
  return { bookmarks: data ?? [], loading, error }
}
