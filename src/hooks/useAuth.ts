import { useState, useEffect } from 'react'
import { blink } from '../lib/blink'
import { User } from '../types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      if (state.user) {
        setUser({
          id: state.user.id,
          name: state.user.displayName || 'User',
          email: state.user.email || '',
          role: (state.user.metadata?.role as any) || 'student',
          classId: state.user.metadata?.classId as string
        })
      } else {
        setUser(null)
      }
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  return { user, loading, isAuthenticated: !!user }
}
