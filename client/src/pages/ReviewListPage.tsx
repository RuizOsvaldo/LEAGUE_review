import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useSearch } from 'wouter'
import { MonthPicker } from '../components/MonthPicker'
import type { ReviewDto } from '../types/review'

function getCurrentMonth(): string {
  return new Date().toISOString().slice(0, 7)
}

async function fetchReviews(month: string): Promise<ReviewDto[]> {
  const res = await fetch(`/api/reviews?month=${encodeURIComponent(month)}`)
  if (!res.ok) throw new Error('Failed to load reviews')
  return res.json()
}

async function createReview(studentId: number, month: string): Promise<ReviewDto> {
  const res = await fetch('/api/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId, month }),
  })
  if (!res.ok) throw new Error('Failed to create review')
  return res.json()
}

const STATUS_BADGE: Record<string, string> = {
  pending: 'bg-slate-100 text-slate-600',
  draft: 'bg-amber-100 text-amber-700',
  sent: 'bg-green-100 text-green-700',
}

export function ReviewListPage() {
  const search = useSearch()
  const params = new URLSearchParams(search)
  const month = params.get('month') ?? getCurrentMonth()
  const queryClient = useQueryClient()

  const { data: reviews = [], isLoading, error } = useQuery<ReviewDto[]>({
    queryKey: ['reviews', month],
    queryFn: () => fetchReviews(month),
  })

  const createMutation = useMutation({
    mutationFn: ({ studentId }: { studentId: number }) => createReview(studentId, month),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reviews', month] }),
  })

  // Auto-create pending rows for any students that are missing reviews.
  // (In Sprint 002 this is a no-op since instructor_students is empty.)
  useEffect(() => {
    // Nothing to auto-create until Sprint 005 populates instructor_students.
    // The effect is intentionally a placeholder.
  }, [month, reviews, createMutation])

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Reviews</h1>
        <MonthPicker />
      </div>

      {isLoading && <p className="text-slate-500">Loading…</p>}
      {error && <p className="text-red-600">Failed to load reviews.</p>}

      {!isLoading && reviews.length === 0 && (
        <p className="text-slate-500">No reviews for this month.</p>
      )}

      {reviews.length > 0 && (
        <div className="space-y-2">
          {reviews.map((r) => (
            <Link
              key={r.id}
              href={`/reviews/${r.id}`}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 hover:bg-slate-50"
            >
              <span className="font-medium text-slate-800">{r.studentName}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE[r.status] ?? ''}`}
              >
                {r.status}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
