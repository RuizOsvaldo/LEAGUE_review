import { useQuery } from '@tanstack/react-query'
import type { AdminFeedbackDto } from '../types/admin'

async function fetchFeedback(): Promise<AdminFeedbackDto[]> {
  const res = await fetch('/api/admin/feedback')
  if (!res.ok) throw new Error('Failed to load feedback')
  return res.json()
}

export function AdminFeedbackPage() {
  const { data: rows = [], isLoading, error } = useQuery<AdminFeedbackDto[]>({
    queryKey: ['admin', 'feedback'],
    queryFn: fetchFeedback,
  })

  return (
    <div className="max-w-5xl">
      <h1 className="mb-6 text-2xl font-bold text-slate-800">Guardian Feedback</h1>
      {isLoading && <p>Loading…</p>}
      {error && <p className="text-red-600">Failed to load feedback.</p>}
      {!isLoading && rows.length === 0 && <p>No feedback yet.</p>}
      {rows.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Student</th><th>Instructor</th><th>Month</th>
              <th>Rating</th><th>Comment</th><th>Submitted</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{r.studentName}</td>
                <td>{r.instructorName}</td>
                <td>{r.month}</td>
                <td>{r.rating}</td>
                <td>{r.comment ?? '—'}</td>
                <td>{new Date(r.submittedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
