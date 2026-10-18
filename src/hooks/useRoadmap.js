import { useCallback, useEffect, useRef, useState } from 'react'
import { loadRoadmap, saveRoadmap } from '../services/roadmapService'
import { useCurrentUser } from './useCurrentUser'

/**
 * Loads the signed-in user's roadmap once. Every mutation optimistically
 * updates local state and writes to Supabase (debounced).
 */
export function useRoadmap() {
  const user = useCurrentUser()
  const [done, setDone] = useState({})
  const [loading, setLoading] = useState(Boolean(user))
  const [error, setError] = useState(null)
  const saveTimer = useRef(null)

  useEffect(() => {
    if (!user) return
    let active = true
    loadRoadmap(user.id).then(
      (data) => {
        if (!active) return
        setDone(data.done || {})
        setLoading(false)
      },
      (err) => {
        if (!active) return
        setError(err)
        setDone({})
        setLoading(false)
      },
    )
    return () => {
      active = false
    }
  }, [user])

  const setItem = useCallback((key, value) => {
    setDone((current) => ({ ...current, [key]: value ? 1 : 0 }))
  }, [])

  useEffect(() => {
    if (!user) return
    if (saveTimer.current) window.clearTimeout(saveTimer.current)
    saveTimer.current = window.setTimeout(() => {
      saveRoadmap(user.id, { done }).catch((err) => setError(err))
    }, 400)
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done])

  return { done, loading, error, setItem }
}