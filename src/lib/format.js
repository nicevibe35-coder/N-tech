export function plural(count, noun) {
  return `${count} ${noun}${count === 1 ? '' : 's'}`
}

/** Only allow same-site paths as post-login redirects, never external URLs. */
export function safeInternalPath(value, fallback = '/') {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) {
    return fallback
  }
  return value
}
