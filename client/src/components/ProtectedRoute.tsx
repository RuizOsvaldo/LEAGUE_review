import { Redirect } from 'wouter'
import { useAuth } from '../hooks/useAuth'

interface ProtectedRouteProps {
  role: 'admin' | 'instructor'
  children: React.ReactNode
}

export function ProtectedRoute({ role, children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()

  if (isLoading) return null

  if (!user) return <Redirect to="/login" />

  if (role === 'admin' && !user.isAdmin) {
    return <Redirect to={user.isActiveInstructor ? '/dashboard' : '/pending-activation'} />
  }

  if (role === 'instructor' && !user.isActiveInstructor) {
    return <Redirect to={user.isAdmin ? '/admin' : '/pending-activation'} />
  }

  return <>{children}</>
}
