import { createContext, useContext } from 'react'

export const AuthContext = createContext(undefined)

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (ctx === undefined) {
    throw new Error('useAuthContext must be used inside AuthProvider')
  }
  return ctx
}