/**
 * Every failure a service can report. The message is always safe to show to a
 * person, so the UI never has to translate backend errors.
 */
export class ServiceError extends Error {
  constructor(code, message) {
    super(message)
    this.name = 'ServiceError'
    this.code = code
  }
}

export function errorMessage(error, fallback = 'Something went wrong. Please try again.') {
  return error instanceof ServiceError ? error.message : fallback
}

export function isNotFound(error) {
  return error instanceof ServiceError && error.code === 'NOT_FOUND'
}

export function assertValid(message) {
  if (message) throw new ServiceError('VALIDATION', message)
}
