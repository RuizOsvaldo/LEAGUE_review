import { useQuery } from '@tanstack/react-query'
import type { AuthUser } from '../types/auth'

async function fetchCurrentUser(): Promise<AuthUser | null> {
  const res = await fetch('/api/auth/me')
  if (res.status === 401) return null
  if (!res.ok) throw new Error('Failed to fetch user')
  return res.json() as Promise<AuthUser>
}

export function useAuth() {
  const { data: user, isLoading } = useQuery<AuthUser | null>({
    queryKey: ['auth', 'me'],
    queryFn: fetchCurrentUser,
    staleTime: Infinity,
    retry: false,
  })

  return { user: user ?? null, isLoading }
}
