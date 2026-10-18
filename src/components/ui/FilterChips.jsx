export function FilterChips({ label, options, selected, onSelect }) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = option.value === selected
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(option.value)}
            className={`inline-flex h-9 items-center rounded-full border px-4 text-sm font-medium transition-colors ${
              active ? 'border-ink bg-ink text-canvas' : 'border-line text-muted hover:bg-subtle hover:text-ink'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
