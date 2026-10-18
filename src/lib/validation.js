export const LIMITS = {
  username: { min: 3, max: 20 },
  displayName: { max: 40 },
  bio: { max: 160 },
  post: { max: 1000 },
  code: { max: 3000 },
  comment: { max: 500 },
  projectTitle: { min: 3, max: 80 },
  projectSummary: { min: 10, max: 600 },
  joinMessage: { max: 300 },
  tag: { max: 24 },
  maxTags: 6,
}

export function normalizeUsername(value) {
  return value.trim().replace(/^@/, '').toLowerCase()
}

export function validateUsername(value) {
  const username = normalizeUsername(value)
  const { min, max } = LIMITS.username
  if (username.length < min || username.length > max) {
    return `Username must be ${min} to ${max} characters.`
  }
  if (!/^[a-z0-9_]+$/.test(username)) {
    return 'Use only letters, numbers and underscores.'
  }
  return null
}

export function validateDisplayName(value) {
  const name = value.trim()
  if (!name) return 'Enter your name.'
  if (name.length > LIMITS.displayName.max) {
    return `Name must be ${LIMITS.displayName.max} characters or fewer.`
  }
  return null
}

export function validateBio(value) {
  return value.trim().length > LIMITS.bio.max ? `Bio must be ${LIMITS.bio.max} characters or fewer.` : null
}

export function isHttpUrl(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export function validateWebsite(value) {
  const website = value.trim()
  if (!website) return null
  return isHttpUrl(website) ? null : 'Enter a full link starting with http:// or https://.'
}

export function validateText(value, { label, min = 1, max }) {
  const text = value.trim()
  if (text.length < min) {
    return min === 1 ? `${label} can’t be empty.` : `${label} must be at least ${min} characters.`
  }
  if (text.length > max) return `${label} must be ${max} characters or fewer.`
  return null
}

export function parseTags(input) {
  const seen = new Set()
  const tags = []
  for (const part of input.split(',')) {
    const tag = part.trim()
    if (!tag) continue
    const key = tag.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    tags.push(tag)
  }
  return tags
}

export function validateTags(tags, { label, min }) {
  if (tags.length < min) return `Add at least ${min} ${label}.`
  if (tags.length > LIMITS.maxTags) return `Use at most ${LIMITS.maxTags} ${label}s.`
  if (tags.some((tag) => tag.length > LIMITS.tag.max)) {
    return `Each ${label} must be ${LIMITS.tag.max} characters or fewer.`
  }
  return null
}
