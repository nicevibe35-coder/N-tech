import { useId } from 'react'

const CONTROL =
  'block w-full rounded-md border bg-canvas px-3 text-sm text-ink placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink'

function describedBy(hintId, errorId) {
  const ids = [hintId, errorId].filter(Boolean).join(' ')
  return ids || undefined
}

function FieldFrame({ id, label, hint, error, counter, children }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
        </label>
        {counter ? <span className="text-xs text-muted">{counter}</span> : null}
      </div>
      {hint ? (
        <p id={`${id}-hint`} className="mt-1 text-xs text-muted">
          {hint}
        </p>
      ) : null}
      <div className="mt-1.5">{children}</div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export function TextField({ label, hint, error, className = '', ...rest }) {
  const id = useId()
  return (
    <FieldFrame id={id} label={label} hint={hint} error={error}>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(hint ? `${id}-hint` : undefined, error ? `${id}-error` : undefined)}
        className={`${CONTROL} h-11 ${error ? 'border-danger' : 'border-line'} ${className}`}
        {...rest}
      />
    </FieldFrame>
  )
}

export function TextArea({ label, hint, error, className = '', value, maxLength, ...rest }) {
  const id = useId()
  return (
    <FieldFrame
      id={id}
      label={label}
      hint={hint}
      error={error}
      counter={maxLength ? `${value.length}/${maxLength}` : undefined}
    >
      <textarea
        id={id}
        value={value}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(hint ? `${id}-hint` : undefined, error ? `${id}-error` : undefined)}
        className={`${CONTROL} min-h-28 py-2.5 leading-relaxed ${error ? 'border-danger' : 'border-line'} ${className}`}
        {...rest}
      />
    </FieldFrame>
  )
}
