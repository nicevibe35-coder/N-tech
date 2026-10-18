import { useEffect, useState } from 'react'

export function CodeBlock({ value, language }) {
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    if (status === 'idle') return
    const timer = window.setTimeout(() => setStatus('idle'), 2000)
    return () => window.clearTimeout(timer)
  }, [status])

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setStatus('copied')
    } catch {
      setStatus('failed')
    }
  }

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-subtle">
      <div className="flex items-center justify-between border-b border-line px-3 py-1.5 text-xs text-muted">
        <span className="font-mono">{language || 'code'}</span>
        <button
          type="button"
          onClick={copy}
          className="rounded px-2 py-1 font-medium transition-colors hover:bg-canvas hover:text-ink"
        >
          {status === 'copied' ? 'Copied' : status === 'failed' ? 'Copy failed' : 'Copy'}
        </button>
        <span className="sr-only" role="status">
          {status === 'copied' ? 'Code copied to clipboard' : ''}
        </span>
      </div>
      <pre
        tabIndex={0}
        aria-label="Code sample"
        className="overflow-x-auto p-4 font-mono text-sm leading-relaxed text-ink"
      >
        <code>{value}</code>
      </pre>
    </div>
  )
}
