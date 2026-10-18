import { SITE } from '../config/site'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function LegalPage({ title, updated, intro, sections }) {
  useDocumentTitle(title)

  return (
    <article aria-labelledby="legal-title" className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24">
      <header>
        <h1 id="legal-title" className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 text-sm text-muted">Last updated {updated}</p>
        <p className="mt-6 text-muted">{intro}</p>
      </header>

      <nav aria-label={`${title} contents`} className="mt-10 rounded-lg border border-line bg-subtle p-5">
        <p className="text-sm font-medium text-ink">On this page</p>
        <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-muted marker:text-muted">
          {sections.map((section, index) => (
            <li key={section.title}>
              <a href={`#section-${index + 1}`} className="underline underline-offset-4 hover:text-ink">
                {section.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-12 space-y-10">
        {sections.map((section, index) => (
          <section
            key={section.title}
            id={`section-${index + 1}`}
            aria-labelledby={`heading-${index + 1}`}
            className="scroll-mt-6"
          >
            <h2 id={`heading-${index + 1}`} className="text-lg font-semibold text-ink">
              {index + 1}. {section.title}
            </h2>
            <div className="mt-3 space-y-3 leading-relaxed text-muted">{section.body}</div>
          </section>
        ))}
      </div>

      <p className="mt-16 border-t border-line pt-6 text-sm text-muted">
        {SITE.contactEmail ? (
          <>
            Questions about this page? Write to{' '}
            <a href={`mailto:${SITE.contactEmail}`} className="text-ink underline underline-offset-4">
              {SITE.contactEmail}
            </a>
            .
          </>
        ) : (
          <>Questions about this page? Reach us through the {SITE.name} community.</>
        )}
      </p>
    </article>
  )
}
