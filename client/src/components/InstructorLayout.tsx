import { Link, useLocation } from 'wouter'
import { useAuth } from '../hooks/useAuth'

const NAV_LINKS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/templates', label: 'Templates' },
  { href: '/checkin', label: 'Check-in' },
]

interface InstructorLayoutProps {
  children: React.ReactNode
}

export function InstructorLayout({ children }: InstructorLayoutProps) {
  const [location] = useLocation()
  const { user } = useAuth()

  return (
    <div className="flex min-h-screen">
      <nav className="w-52 shrink-0 border-r border-slate-200 bg-white p-4">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
          Instructor
        </p>
        <ul className="space-y-1">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = location === href || (href === '/reviews' && location.startsWith('/reviews'))
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`block rounded px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>

        {user?.isAdmin && (
          <div className="mt-6 border-t border-slate-200 pt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
              Admin
            </p>
            <Link
              href="/admin"
              className="block rounded px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Admin Panel
            </Link>
          </div>
        )}
      </nav>
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  )
}
