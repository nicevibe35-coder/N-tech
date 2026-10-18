import { useMemo } from 'react'
import { lessonRef } from '../content/learn'
import { listProgress } from '../services/progressService'
import { useCurrentUser } from './useCurrentUser'
import { useQuery } from './useQuery'

/** The set of lessons (as "track/lesson") the signed-in person has completed. */
export function useProgress() {
  const user = useCurrentUser()
  const { data, loading } = useQuery(`progress:${user?.id ?? 'anon'}`, () =>
    user ? listProgress(user.id) : Promise.resolve([]),
  )
  const completed = useMemo(
    () => new Set((data ?? []).map((entry) => lessonRef(entry.trackSlug, entry.lessonSlug))),
    [data],
  )
  return { completed, loading }
}
