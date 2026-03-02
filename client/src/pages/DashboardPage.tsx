import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useSearch } from 'wouter'
import { MonthPicker } from '../components/MonthPicker'
import type { PendingCheckinResponse } from '../types/checkin'

interface DashboardData {
  month: string
  totalStudents: number
  pending: number
  draft: number
  sent: number
}

function getCurrentMonth(): string {
  return new Date().toISOString().slice(0, 7)
}

async function fetchDashboard(month: string): Promise<DashboardData> {
  const res = await fetch(`/api/instructor/dashboard?month=${encodeURIComponent(month)}`)
  if (!res.ok) throw new Error('Failed to load dashboard')
  return res.json()
}

async function fetchPendingCheckin(): Promise<PendingCheckinResponse> {
  const res = await fetch('/api/checkins/pending')
  if (!res.ok) throw new Error('Failed to load check-in status')
  return res.json()
}

interface StatCardProps {
  label: string
  value: number
  color?: string
}

function StatCard({ label, value, color = 'text-slate-800' }: StatCardProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-1 text-3xl font-bold ${color}`}>{value}</p>
    </div>
  )
}

export function DashboardPage() {
  const search = useSearch()
  const params = new URLSearchParams(search)
  const month = params.get('month') ?? getCurrentMonth()

  const [checkinDismissed, setCheckinDismissed] = useState(false)

  const { data, isLoading, error } = useQuery<DashboardData>({
    queryKey: ['dashboard', month],
    queryFn: () => fetchDashboard(month),
  })

  const { data: checkinData } = useQuery<PendingCheckinResponse>({
    queryKey: ['checkins', 'pending'],
    queryFn: fetchPendingCheckin,
  })

  const showCheckinBanner =
    !checkinDismissed &&
    checkinData !== undefined &&
    !checkinData.alreadySubmitted

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <MonthPicker />
      </div>

      {showCheckinBanner && (
        <div className="mb-6 flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <span>
            Weekly TA check-in not yet submitted for {checkinData.weekOf}.{' '}
            <Link href="/checkin" className="font-medium underline">
              Submit now
            </Link>
          </span>
          <button
            onClick={() => setCheckinDismissed(true)}
            className="ml-4 text-amber-600 hover:text-amber-800"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      )}

      {isLoading && <p className="text-slate-500">Loading…</p>}
      {error && <p className="text-red-600">Failed to load dashboard.</p>}

      {data && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Total Students" value={data.totalStudents} />
          <StatCard label="Pending" value={data.pending} color="text-slate-600" />
          <StatCard label="Draft" value={data.draft} color="text-amber-600" />
          <StatCard label="Sent" value={data.sent} color="text-green-600" />
        </div>
      )}

      {data && (
        <div className="mt-6">
          <Link
            href={`/reviews?month=${month}`}
            className="inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            View Reviews
          </Link>
        </div>
      )}
    </div>
  )
}
