import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadProfile(authUser) {
      if (!authUser) {
        if (active) {
          setUser(null)
          setProfile(null)
          setLoading(false)
        }
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (!active) return

      if (error) {
        setUser(authUser)
        setProfile(null)
      } else {
        setUser(authUser)
        setProfile(data)
      }
      setLoading(false)
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      loadProfile(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        loadProfile(session?.user ?? null)
      }
    )

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  const value = user
    ? {
        id: user.id,
        email: user.email,
        username: profile?.username ?? user.email?.split('@')[0] ?? 'user',
        displayName: profile?.display_name ?? user.user_metadata?.full_name ?? 'Member',
        bio: profile?.bio ?? '',
        website: profile?.website ?? '',
        avatarUrl: profile?.avatar_url ?? user.user_metadata?.avatar_url ?? '',
        role: profile?.role ?? 'member',
        createdAt: profile?.created_at ?? user.created_at,
      }
    : null

  return (
    <AuthContext.Provider value={{ user: value, loading }}>
      {children}
    </AuthContext.Provider>
  )
}