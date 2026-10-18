import { useState } from 'react'
import { useQuery } from '../hooks/useQuery'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { Button } from '../components/ui/Button'
import { InlineError, Loading, EmptyState } from '../components/ui/States'
import { Tag } from '../components/ui/Tag'
import { Time } from '../components/Time'
import { supabase } from '../lib/supabase'

async function listOpenReports() {
  const { data, error } = await supabase
    .from('reports')
    .select('*, reporter:profiles!reports_reporter_id_fkey(id, username, display_name)')
    .eq('status', 'open')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

async function resolveReport(id) {
  const { error } = await supabase
    .from('reports')
    .update({ status: 'resolved' })
    .eq('id', id)
  if (error) throw new Error(error.message)
}

async function dismissReport(id) {
  const { error } = await supabase
    .from('reports')
    .update({ status: 'dismissed' })
    .eq('id', id)
  if (error) throw new Error(error.message)
}

async function deleteReportedContent(kind, id) {
  const table = kind === 'post' ? 'posts' : kind === 'comment' ? 'comments' : 'projects'
  const { error } = await supabase.from(table).delete().eq('id', id)
  if (error) throw new Error(error.message)
}

function ReportRow({ report, onChanged }) {
  const [busy, setBusy] = useState(null)
  const [error, setError] = useState(null)

  async function act(action) {
    setBusy(action)
    setError(null)
    try {
      if (action === 'delete') await deleteReportedContent(report.target_kind, report.target_id)
      if (action === 'resolve') await resolveReport(report.id)
      if (action === 'dismiss') await dismissReport(report.id)
      onChanged()
    } catch (failure) {
      setError(failure.message)
    } finally {
      setBusy(null)
    }
  }

  return (
    <li className="rounded-2xl border border-line bg-canvas p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Tag strong>{report.target_kind}</Tag>
            <p className="text-sm text-muted">
              <Time iso={report.created_at} />
            </p>
          </div>
          <p className="mt-3 whitespace-pre-wrap break-words text-sm text-ink">{report.reason}</p>
          <p className="mt-2 text-xs text-muted">
            Reported by{' '}
            {report.reporter ? (
              <span className="font-medium text-ink">@{report.reporter.username}</span>
            ) : (
              'unknown'
            )}{' '}
            · Target ID: <code className="font-mono">{report.target_id}</code>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="danger"
            size="sm"
            loading={busy === 'delete'}
            onClick={() => act('delete')}
          >
            Delete content
          </Button>
          <Button
            variant="secondary"
            size="sm"
            loading={busy === 'resolve'}
            onClick={() => act('resolve')}
          >
            Resolve
          </Button>
          <Button
            variant="ghost"
            size="sm"
            loading={busy === 'dismiss'}
            onClick={() => act('dismiss')}
          >
            Dismiss
          </Button>
        </div>
      </div>
      <div className="mt-3">
        <InlineError message={error} />
      </div>
    </li>
  )
}

export default function AdminModeration() {
  useDocumentTitle('Admin · Moderation')
  const { data, loading, reload } = useQuery('admin:reports', () => listOpenReports())

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold tracking-tight text-ink">Moderation queue</h2>
      {loading ? <Loading label="Loading reports…" /> : null}
      {data && data.length === 0 ? (
        <EmptyState title="No open reports">Everything looks clean.</EmptyState>
      ) : null}
      {data && data.length > 0 ? (
        <ul className="space-y-3">
          {data.map((report) => (
            <ReportRow key={report.id} report={report} onChanged={reload} />
          ))}
        </ul>
      ) : null}
    </div>
  )
}