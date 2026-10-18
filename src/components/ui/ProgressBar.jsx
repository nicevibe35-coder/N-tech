export function ProgressBar({ value, max, label }) {
  const percent = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={`${value} of ${max} lessons complete`}
      className="h-2 w-full overflow-hidden rounded-full bg-subtle ring-1 ring-inset ring-line"
    >
      <div
        className="h-full rounded-full bg-ink transition-[width] motion-reduce:transition-none"
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}
