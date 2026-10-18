const BASE =
  'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50'

const VARIANTS = {
  primary: 'bg-ink text-canvas hover:opacity-90',
  secondary: 'border border-line text-ink hover:bg-subtle',
  ghost: 'text-muted hover:bg-subtle hover:text-ink',
  danger: 'border border-danger text-danger hover:bg-subtle',
}

const SIZES = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-5 text-sm',
}

/** Use on links (`<Link className={buttonStyles()}>`) so they match real buttons. */
export function buttonStyles(variant = 'primary', size = 'md') {
  return `${BASE} ${VARIANTS[variant]} ${SIZES[size]}`
}
