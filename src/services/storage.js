import { ServiceError } from './errors'

const PREFIX = 'dc1:'
const listeners = new Set()
const memory = new Map()
const parsed = new Map()
const EMPTY = Object.freeze([])

function detectStorage() {
  try {
    const storage = window.localStorage
    const probe = '__dc_probe__'
    storage.setItem(probe, '1')
    storage.removeItem(probe)
    return storage
  } catch {
    return null
  }
}

const backing = detectStorage()

/** False when the browser blocks storage; data then only lives until the tab closes. */
export const isPersistent = backing !== null

function getRaw(key) {
  if (!backing) return memory.get(key) ?? null
  try {
    return backing.getItem(key)
  } catch {
    return null
  }
}

function emit() {
  listeners.forEach((listener) => listener())
}

export function subscribe(listener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/**
 * Returns the same object for the same stored text, so React snapshots stay
 * stable between reads. Corrupt data falls back instead of crashing the app.
 */
export function readJson(key, fallback) {
  const full = PREFIX + key
  const raw = getRaw(full)
  if (raw === null) return fallback
  const hit = parsed.get(full)
  if (hit && hit.raw === raw) return hit.value
  try {
    const value = JSON.parse(raw)
    parsed.set(full, { raw, value })
    return value
  } catch {
    return fallback
  }
}

export function readList(key) {
  const value = readJson(key, EMPTY)
  return Array.isArray(value) ? value : EMPTY
}

export function writeJson(key, value) {
  const full = PREFIX + key
  const raw = JSON.stringify(value)
  try {
    if (backing) backing.setItem(full, raw)
    else memory.set(full, raw)
  } catch {
    throw new ServiceError('STORAGE', 'We couldn’t save your changes. Your browser storage may be full or blocked.')
  }
  parsed.set(full, { raw, value })
  emit()
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === null || event.key.startsWith(PREFIX)) emit()
  })
}
