export function PageShell({ children, width = 'wide' }) {
  return (
    <div className={`mx-auto w-full px-4 py-12 sm:px-6 sm:py-16 ${width === 'narrow' ? 'max-w-3xl' : 'max-w-5xl'}`}>
      {children}
    </div>
  )
}

export function PageHeader({ title, description, actions }) {
  return (
    <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{title}</h1>
        {description ? <p className="mt-3 text-muted">{description}</p> : null}
      </div>
      {actions}
    </header>
  )
}
