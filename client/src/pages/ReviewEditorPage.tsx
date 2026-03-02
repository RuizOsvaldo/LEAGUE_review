import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useLocation } from 'wouter'
import type { ReviewDto } from '../types/review'
import type { TemplateDto } from '../types/template'
import { Button } from '../components/ui/button'

async function fetchReview(id: string): Promise<ReviewDto> {
  const res = await fetch(`/api/reviews/${id}`)
  if (!res.ok) throw new Error('Failed to load review')
  return res.json()
}

async function fetchTemplates(): Promise<TemplateDto[]> {
  const res = await fetch('/api/templates')
  if (!res.ok) throw new Error('Failed to load templates')
  return res.json()
}

function applyTemplate(template: TemplateDto, studentName: string, month: string): { subject: string; body: string } {
  return {
    subject: template.subject
      .replace(/\{\{studentName\}\}/g, studentName)
      .replace(/\{\{month\}\}/g, month),
    body: template.body
      .replace(/\{\{studentName\}\}/g, studentName)
      .replace(/\{\{month\}\}/g, month),
  }
}

export function ReviewEditorPage() {
  const { id } = useParams<{ id: string }>()
  const [, setLocation] = useLocation()
  const queryClient = useQueryClient()

  const { data: review, isLoading, error } = useQuery<ReviewDto>({
    queryKey: ['review', id],
    queryFn: () => fetchReview(id!),
    enabled: !!id,
  })

  const { data: templates = [] } = useQuery<TemplateDto[]>({
    queryKey: ['templates'],
    queryFn: fetchTemplates,
  })

  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [dirty, setDirty] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)

  useEffect(() => {
    if (review) {
      setSubject(review.subject ?? '')
      setBody(review.body ?? '')
    }
  }, [review])

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault()
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [dirty])

  const saveMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, body }),
      })
      if (!res.ok) throw new Error('Failed to save draft')
      return res.json() as Promise<ReviewDto>
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(['review', id], updated)
      setDirty(false)
    },
  })

  const sendMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/reviews/${id}/send`, { method: 'POST' })
      if (!res.ok) throw new Error('Failed to mark as sent')
      return res.json() as Promise<ReviewDto>
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(['review', id], updated)
    },
  })

  if (isLoading) return <div className="p-8 text-slate-500">Loading…</div>
  if (error || !review) return <div className="p-8 text-red-600">Review not found.</div>

  const isSent = review.status === 'sent'
  const month = review.month

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-4 flex items-center gap-2">
        <button
          onClick={() => setLocation(`/reviews?month=${month}`)}
          className="text-sm text-blue-600 hover:underline"
        >
          ← Reviews
        </button>
        <span className="text-slate-400">/</span>
        <span className="text-sm text-slate-600">{review.studentName}</span>
      </div>

      <h1 className="text-xl font-bold text-slate-800 mb-1">{review.studentName}</h1>
      <p className="text-sm text-slate-500 mb-4">{month}</p>

      {isSent && (
        <div className="mb-4 rounded bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-700">
          This review has been marked as sent.
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => { setSubject(e.target.value); setDirty(true) }}
            disabled={isSent}
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Body</label>
          <textarea
            value={body}
            onChange={(e) => { setBody(e.target.value); setDirty(true) }}
            disabled={isSent}
            rows={10}
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-400"
          />
        </div>
      </div>

      {!isSent && (
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
          >
            {saveMutation.isPending ? 'Saving…' : 'Save Draft'}
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowTemplates((v) => !v)}
          >
            Apply Template
          </Button>
          <Button
            variant="outline"
            disabled
            title="Available in Sprint 6"
          >
            Generate from GitHub
          </Button>
          <Button
            onClick={() => sendMutation.mutate()}
            disabled={sendMutation.isPending}
            className="bg-green-600 hover:bg-green-700"
          >
            {sendMutation.isPending ? 'Sending…' : 'Mark as Sent'}
          </Button>
        </div>
      )}

      {saveMutation.isError && (
        <p className="mt-2 text-sm text-red-600">Failed to save. Please try again.</p>
      )}
      {sendMutation.isError && (
        <p className="mt-2 text-sm text-red-600">Failed to mark as sent. Please try again.</p>
      )}

      {showTemplates && templates.length > 0 && (
        <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4 shadow-md">
          <h2 className="text-sm font-semibold text-slate-700 mb-2">Choose a Template</h2>
          <ul className="space-y-1">
            {templates.map((t) => (
              <li key={t.id}>
                <button
                  onClick={() => {
                    const applied = applyTemplate(t, review.studentName, month)
                    setSubject(applied.subject)
                    setBody(applied.body)
                    setDirty(true)
                    setShowTemplates(false)
                  }}
                  className="w-full text-left rounded px-2 py-1.5 text-sm hover:bg-slate-50"
                >
                  <span className="font-medium text-slate-800">{t.name}</span>
                  <span className="ml-2 text-slate-500">{t.subject}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showTemplates && templates.length === 0 && (
        <p className="mt-4 text-sm text-slate-500">
          No templates yet.{' '}
          <a href="/templates/new" className="text-blue-600 underline">Create one</a>
        </p>
      )}
    </div>
  )
}
