import { useState, useEffect } from 'react'
import { useParams } from 'wouter'
import type { FeedbackContextDto } from '../types/feedback'

type State = 'loading' | 'not-found' | 'already-submitted' | 'form' | 'confirmed'

export function FeedbackPage() {
  const { token } = useParams<{ token: string }>()
  const [state, setState] = useState<State>('loading')
  const [context, setContext] = useState<FeedbackContextDto | null>(null)
  const [rating, setRating] = useState<number>(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch(`/api/feedback/${token}`)
      .then(async (res) => {
        if (res.status === 404) { setState('not-found'); return }
        const data: FeedbackContextDto = await res.json()
        setContext(data)
        setState(data.alreadySubmitted ? 'already-submitted' : 'form')
      })
      .catch(() => setState('not-found'))
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const body: Record<string, unknown> = { rating }
    if (comment.trim()) body.comment = comment.trim()
    const res = await fetch(`/api/feedback/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    setSubmitting(false)
    if (res.status === 409) { setState('already-submitted'); return }
    if (res.ok) setState('confirmed')
  }

  if (state === 'loading') return <p>Loading…</p>
  if (state === 'not-found') return <p>Feedback link not found.</p>
  if (state === 'already-submitted') return <p>Feedback already submitted.</p>
  if (state === 'confirmed') return <p>Thank you for your feedback!</p>

  return (
    <form onSubmit={handleSubmit}>
      <p>Review for {context?.studentName} — {context?.month}</p>
      <div>
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" aria-label={`${n} star`}
            onClick={() => setRating(n)}
            className={rating === n ? 'selected' : ''}>
            {n}
          </button>
        ))}
      </div>
      <textarea
        aria-label="Comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button type="submit" disabled={submitting || rating === 0}>
        Submit
      </button>
    </form>
  )
}
