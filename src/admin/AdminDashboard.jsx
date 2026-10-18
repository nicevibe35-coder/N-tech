import { useQuery } from '../hooks/useQuery'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { Loading } from '../components/ui/States'
import { supabase } from '../lib/supabase'

async function loadStats() {
  const [profiles, posts, projects, reportsOpen, comments] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('posts').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'open'),
    supabase.from('comments').select('*', { count: 'exact', head: true }),
  ])

  return {
    members: profiles.count ?? 0,
    posts: posts.count ?? 0,
    projects: projects.count ?? 0,
    reports: reportsOpen.count ?? 0,
    comments: comments.count ?? 0,
  }
}

const CARDS = [
  { key: 'members', label: 'Members', to: '/admin/members' },
  { key: 'posts', label: 'Posts', to: '/feed' },
  { key: 'projects', label: 'Projects', to: '/projects' },
  { key: 'comments', label: 'Comments', to: '/feed' },
  { key: 'reports', label: 'Open reports', to: '/admin/moderation', highlight: true },
]

export default function AdminDashboard() {
  useDocumentTitle('Admin · Dashboard')
  const { data, loading } = useQuery('admin:stats', () => loadStats())

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold tracking-tight text-ink">Overview</h2>
      {loading ? <Loading label="Loading stats…" /> : null}
      {data ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((card) => (
            <li key={card.key}>
              <div
                className={`rounded-2xl border p-6 ${
                  card.highlight && data[card.key] > 0
                    ? 'border-danger bg-canvas'
                    : 'border-line bg-canvas'
                }`}
              >
                <p className="text-sm text-muted">{card.label}</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-ink">
                  {data[card.key]}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}