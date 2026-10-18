import { useState } from 'react'
import { SaveButton } from '../components/SaveButton'
import { FilterChips } from '../components/ui/FilterChips'
import { PageHeader, PageShell } from '../components/ui/PageShell'
import { ErrorState, Loading } from '../components/ui/States'
import { Tag } from '../components/ui/Tag'
import { listMaterials } from '../content/materials'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useQuery } from '../hooks/useQuery'

export default function MaterialsPage() {
  useDocumentTitle('Materials')
  const [filter, setFilter] = useState('all')
  const { data, error, loading, reload } = useQuery('materials:list', () => listMaterials())
  const items = data ?? []
  const categories = [...new Set(items.map((m) => m.category))]
  const filtered = filter === 'all' ? items : items.filter((m) => m.category === filter)
  const options = [
    { value: 'all', label: 'All' },
    ...categories.map((cat) => ({ value: cat, label: cat })),
  ]

  return (
    <PageShell>
      <PageHeader
        title="Materials"
        description="Trusted references, books and tools. Save the ones you want to come back to."
      />

      {loading ? <Loading label="Loading materials…" /> : null}
      {error ? <ErrorState message="Materials could not be loaded." onRetry={reload} /> : null}

      {!loading && !error && categories.length > 0 ? (
        <div className="mb-8">
          <FilterChips
            label="Filter materials by type"
            options={options}
            selected={filter}
            onSelect={setFilter}
          />
        </div>
      ) : null}

      {!loading && !error ? (
        <ul className="grid gap-5 sm:grid-cols-2">
          {filtered.map((material) => (
            <li key={material.id}>
              <article className="flex h-full flex-col rounded-lg border border-line p-5">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-base font-semibold text-ink">
                    <a
                      href={material.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline-offset-4 hover:underline"
                    >
                      {material.title}
                      <span className="sr-only"> (opens in a new tab)</span>
                      <span aria-hidden="true"> ↗</span>
                    </a>
                  </h2>
                  <Tag>{material.category}</Tag>
                </div>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                  {material.description}
                </p>
                <div className="mt-4">
                  <SaveButton kind="material" refId={material.id} title={material.title} />
                </div>
              </article>
            </li>
          ))}
        </ul>
      ) : null}
    </PageShell>
  )
}