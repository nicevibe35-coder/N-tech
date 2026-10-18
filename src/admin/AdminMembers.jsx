import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '../hooks/useQuery'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { Avatar } from '../components/ui/Avatar'
import { Button } from '../components/ui/Button'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { InlineError, Loading } from '../components/ui/States'
import { Tag } from '../components/ui/Tag'
import { formatDate } from '../lib/time'
import { supabase } from '../lib/supabase'

async function listMembers() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data ?? []
}

async function setRole(userId, role) {
  const { error } = await supabase.from('profiles').update({ role }).eq('id', userId)
  if (error) throw new Error(error.message)
}

async function deleteProfile(userId) {
  const { error } = await supabase.from('profiles').delete().eq('id', userId)
  if (error) throw new Error(error.message)
}

function MemberRow({ member, isSelf, onChanged }) {
  const [busy, setBusy] = useState(null)
  const [error, setError] = useState(null)
  const [confirming, setConfirming] = useState(false)

  async function toggleRole() {
    setBusy('role')
    setError(null)
    try {
      await setRole(member.id, member.role === 'admin' ? 'member' : 'admin')
      onChanged()
    } catch (failure) {
      setError(failure.message)
    } finally {
      setBusy(null)
    }
  }

  return (
    <li className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-canvas p-4">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar name={member.display_name} />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Link to={`/u/${member.username}`} className="font-medium text-ink hover:underline">
              {member.display_name}
            </Link>
            {member.role === 'admin' ? <Tag strong>Admin</Tag> : null}
            {isSelf ? <Tag>You</Tag> : null}
          </div>
          <p className="truncate text-sm text-muted">
            @{member.username} · joined {formatDate(member.created_at)}
          </p>
        </div>
      </div>

      {!isSelf ? (
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" loading={busy === 'role'} onClick={toggleRole}>
            {member.role === 'admin' ? 'Demote to member' : 'Make admin'}
          </Button>
          <Button variant="danger" size="sm" onClick={() => setConfirming(true)}>
            Delete member
          </Button>
          <ConfirmDialog
            open={confirming}
            title="Delete this member?"
            message={`This removes @${member.username} and everything they posted. It cannot be undone.`}
            confirmLabel="Delete member"
            onConfirm={async () => {
              await deleteProfile(member.id)
              onChanged()
            }}
            onClose={() => setConfirming(false)}
          />
        </div>
      ) : null}

      <div className="basis-full">
        <InlineError message={error} />
      </div>
    </li>
  )
}

export default function AdminMembers() {
  useDocumentTitle('Admin · Members')
  const me = useCurrentUser()
  const { data, loading, reload } = useQuery('admin:members', () => listMembers())

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold tracking-tight text-ink">Members</h2>
      {loading ? <Loading label="Loading members…" /> : null}
      {data && data.length === 0 ? (
        <p className="text-sm text-muted">No members yet.</p>
      ) : null}
      {data && data.length > 0 ? (
        <ul className="space-y-3">
          {data.map((member) => (
            <MemberRow
              key={member.id}
              member={member}
              isSelf={member.id === me?.id}
              onChanged={reload}
            />
          ))}
        </ul>
      ) : null}
    </div>
  )
} 