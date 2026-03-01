import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useLocation } from 'wouter'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'

const loginSchema = z.object({
  role: z.enum(['admin', 'instructor', 'inactive']),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginPage() {
  const [, setLocation] = useLocation()
  const queryClient = useQueryClient()

  const { register, handleSubmit, formState: { isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { role: 'instructor' },
  })

  const onSubmit = async (data: LoginFormValues) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) return
    const user = await res.json()
    await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
    if (user.isAdmin) setLocation('/admin')
    else if (user.isActiveInstructor) setLocation('/dashboard')
    else setLocation('/pending-activation')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-sm p-8 bg-white rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">LEAGUE Report</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium text-slate-700">Sign in as</legend>
            {(['admin', 'instructor', 'inactive'] as const).map((role) => (
              <label key={role} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" value={role} {...register('role')} />
                <span className="capitalize text-sm text-slate-600">{role}</span>
              </label>
            ))}
          </fieldset>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  )
}
