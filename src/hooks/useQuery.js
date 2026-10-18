import { useCallback, useEffect, useRef, useState } from 'react'

// Simple key-based invalidation bus. Services call invalidate('posts')
// after a write to tell every mounted useQuery to refetch.
const listeners = new Set()

export function invalidate(prefix) {
  for (const listener of listeners) {
    listener(prefix)
  }
}

export function invalidateAll() {
  invalidate(null)
}

export function useQuery(key, fetcher, options = {}) {
  const fetcherRef = useRef(fetcher)
  useEffect(() => {
    fetcherRef.current = fetcher
  })

  const [settled, setSettled] = useState(null)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    function onInvalidate(prefix) {
      if (!prefix || key.startsWith(prefix)) {
        setVersion((current) => current + 1)
      }
    }
    listeners.add(onInvalidate)
    return () => {
      listeners.delete(onInvalidate)
    }
  }, [key])

  useEffect(() => {
    let cancelled = false
    fetcherRef.current().then(
      (data) => {
        if (!cancelled) setSettled({ key, data, error: null })
      },
      (error) => {
        if (!cancelled) {
          setSettled({
            key,
            data: null,
            error: error instanceof Error ? error : new Error('Request failed'),
          })
        }
      },
    )
    return () => {
      cancelled = true
    }
  }, [key, version])

  const reload = useCallback(() => {
    setVersion((current) => current + 1)
  }, [])

  const current = settled && (settled.key === key || options.keepPrevious) ? settled : null

  return {
    data: current?.data ?? null,
    error: current?.error ?? null,
    loading: current === null,
    stale: current !== null && current.key !== key,
    reload,
  }
}