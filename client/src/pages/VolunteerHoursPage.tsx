import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { VolunteerHourDto, VolunteerSummaryDto } from '../types/admin'

// ---- Helpers ----

function ytdFrom(): string {
  return `${new Date().getFullYear()}-01-01`
}

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

function buildUrl(filters: Filters): string {
  const params = new URLSearchParams()
  if (filters.volunteerName) params.set('volunteerName', filters.volunteerName)
  if (filters.category) params.set('category', filters.category)
  if (filters.from) params.set('from', filters.from)
  if (filters.to) params.set('to', filters.to)
  const qs = params.toString()
  return `/api/admin/volunteer-hours${qs ? '?' + qs : ''}`
}

function buildSummaryUrl(from: string, to: string): string {
  return `/api/admin/volunteer-hours/summary?from=${from}&to=${to}`
}

async function fetchSummary(from: string, to: string): Promise<VolunteerSummaryDto[]> {
  const res = await fetch(buildSummaryUrl(from, to))
  if (!res.ok) throw new Error('Failed to load volunteer summary')
  return res.json()
}

async function fetchHours(filters: Filters): Promise<VolunteerHourDto[]> {
  const res = await fetch(buildUrl(filters))
  if (!res.ok) throw new Error('Failed to load volunteer hours')
  return res.json()
}

async function createHours(body: HoursFormData): Promise<VolunteerHourDto> {
  const res = await fetch('/api/admin/volunteer-hours', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error('Failed to create entry')
  return res.json()
}

async function updateHours(id: number, body: Partial<HoursFormData>): Promise<VolunteerHourDto> {
  const res = await fetch(`/api/admin/volunteer-hours/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error('Failed to update entry')
  return res.json()
}

async function deleteHours(id: number): Promise<void> {
  const res = await fetch(`/api/admin/volunteer-hours/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete entry')
}

function exportToCsv(rows: VolunteerHourDto[], filename: string) {
  const header = ['Volunteer', 'Category', 'Hours', 'Description', 'Date', 'Source']
  const lines = rows.map((r) =>
    [
      r.volunteerName,
      r.category,
      r.hours,
      r.description ?? '',
      r.recordedAt.slice(0, 10),
      r.source,
    ].join(','),
  )
  const blob = new Blob([[header, ...lines].join('\n')], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

// ---- Types ----

interface Filters {
  volunteerName: string
  category: string
  from: string
  to: string
}

interface HoursFormData {
  volunteerName: string
  category: string
  hours: number
  description?: string
  recordedAt?: string
}

const EMPTY_FORM: HoursFormData = {
  volunteerName: '',
  category: '',
  hours: 0,
  description: '',
  recordedAt: today(),
}

// ---- Entry form ----

interface EntryFormProps {
  initial?: HoursFormData
  onSubmit: (data: HoursFormData) => void
  onCancel: () => void
  isPending: boolean
}

function EntryForm({ initial = EMPTY_FORM, onSubmit, onCancel, isPending }: EntryFormProps) {
  const [form, setForm] = useState<HoursFormData>(initial)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: name === 'hours' ? parseFloat(value) || 0 : value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">Volunteer Name</label>
          <input
            name="volunteerName"
            value={form.volunteerName}
            onChange={handleChange}
            required
            className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select…</option>
            <option value="Teaching">Teaching</option>
            <option value="Events">Events</option>
            <option value="Mentoring">Mentoring</option>
            <option value="Admin">Admin</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">Hours</label>
          <input
            type="number"
            name="hours"
            value={form.hours}
            onChange={handleChange}
            required
            min={0}
            step={0.5}
            className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">Date</label>
          <input
            type="date"
            name="recordedAt"
            value={form.recordedAt}
            onChange={handleChange}
            className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-600">Description (optional)</label>
        <input
          name="description"
          value={form.description ?? ''}
          onChange={handleChange}
          className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded bg-slate-100 px-4 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

// ---- Summary table ----

type SummarySortKey = 'volunteerName' | 'totalHours' | 'isScheduled'
type SortDir = 'asc' | 'desc'

function SummarySortIcon({ col, sortKey, sortDir }: { col: SummarySortKey; sortKey: SummarySortKey; sortDir: SortDir }) {
  if (col !== sortKey) return <span className="ml-1 text-slate-300">↕</span>
  return <span className="ml-1 text-blue-600">{sortDir === 'asc' ? '↑' : '↓'}</span>
}

function SummaryTable({ rows }: { rows: VolunteerSummaryDto[] }) {
  const [sortKey, setSortKey] = useState<SummarySortKey>('totalHours')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  function handleSort(key: SummarySortKey) {
    if (key === sortKey) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('asc') }
  }

  const sorted = useMemo(() => {
    return [...rows].sort((a, b) => {
      let cmp = 0
      if (sortKey === 'volunteerName') cmp = a.volunteerName.localeCompare(b.volunteerName)
      else if (sortKey === 'totalHours') cmp = Number(a.totalHours) - Number(b.totalHours)
      else if (sortKey === 'isScheduled') cmp = Number(a.isScheduled) - Number(b.isScheduled)
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [rows, sortKey, sortDir])

  if (rows.length === 0) return <p className="text-slate-500">No volunteer hours recorded for this period.</p>

  const thClass = 'cursor-pointer select-none px-4 py-2.5 text-left font-medium text-slate-600 hover:text-slate-800 whitespace-nowrap'

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="border-b border-slate-200 bg-slate-50">
          <tr>
            <th className={thClass} onClick={() => handleSort('volunteerName')}>
              Volunteer <SummarySortIcon col="volunteerName" sortKey={sortKey} sortDir={sortDir} />
            </th>
            <th className={`${thClass} text-right`} onClick={() => handleSort('totalHours')}>
              YTD Hours <SummarySortIcon col="totalHours" sortKey={sortKey} sortDir={sortDir} />
            </th>
            <th className={`${thClass} text-center`} onClick={() => handleSort('isScheduled')}>
              Scheduled <SummarySortIcon col="isScheduled" sortKey={sortKey} sortDir={sortDir} />
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {sorted.map((row) => (
            <tr key={row.volunteerName} className="hover:bg-slate-50">
              <td className="px-4 py-2.5 font-medium text-slate-800">{row.volunteerName}</td>
              <td className="px-4 py-2.5 text-right tabular-nums text-slate-700">
                {Number(row.totalHours).toFixed(1)}
              </td>
              <td className="px-4 py-2.5 text-center">
                {row.isScheduled ? (
                  <span className="inline-block rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                    Scheduled
                  </span>
                ) : (
                  <span className="inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
                    Not scheduled
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ---- Main page ----

type View = 'summary' | 'detail'

export function VolunteerHoursPage() {
  const queryClient = useQueryClient()
  const [view, setView] = useState<View>('summary')
  const [summaryFrom, setSummaryFrom] = useState(ytdFrom())
  const [summaryTo, setSummaryTo] = useState(today())
  const [filters, setFilters] = useState<Filters>({
    volunteerName: '',
    category: '',
    from: ytdFrom(),
    to: today(),
  })
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const { data: summary = [], isLoading: summaryLoading, error: summaryError } = useQuery<VolunteerSummaryDto[]>({
    queryKey: ['admin', 'volunteer-hours-summary', summaryFrom, summaryTo],
    queryFn: () => fetchSummary(summaryFrom, summaryTo),
    enabled: view === 'summary',
  })

  const { data: entries = [], isLoading: detailLoading, error: detailError } = useQuery<VolunteerHourDto[]>({
    queryKey: ['admin', 'volunteer-hours', filters],
    queryFn: () => fetchHours(filters),
    enabled: view === 'detail',
  })

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'volunteer-hours'] })
    queryClient.invalidateQueries({ queryKey: ['admin', 'volunteer-hours-summary'] })
  }

  const createMutation = useMutation({
    mutationFn: createHours,
    onSuccess: () => { invalidate(); setShowAddForm(false) },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<HoursFormData> }) => updateHours(id, data),
    onSuccess: () => { invalidate(); setEditingId(null) },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteHours,
    onSuccess: invalidate,
  })

  function handleFilterChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Volunteer Hours</h1>
        <div className="flex gap-2">
          {view === 'detail' && (
            <button
              onClick={() => exportToCsv(entries, 'volunteer-hours.csv')}
              className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Export CSV
            </button>
          )}
          <button
            onClick={() => { setShowAddForm(true); setEditingId(null) }}
            className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Add Entry
          </button>
        </div>
      </div>

      {/* View toggle */}
      <div className="mb-4 flex gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1 w-fit">
        <button
          onClick={() => setView('summary')}
          className={`rounded px-4 py-1.5 text-sm font-medium transition-colors ${
            view === 'summary'
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Summary
        </button>
        <button
          onClick={() => setView('detail')}
          className={`rounded px-4 py-1.5 text-sm font-medium transition-colors ${
            view === 'detail'
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Detail
        </button>
      </div>

      {/* Summary view */}
      {view === 'summary' && (
        <>
          <div className="mb-4 flex items-center gap-3">
            <label className="text-sm text-slate-600">From</label>
            <input
              type="date"
              value={summaryFrom}
              onChange={(e) => setSummaryFrom(e.target.value)}
              className="rounded border border-slate-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label className="text-sm text-slate-600">To</label>
            <input
              type="date"
              value={summaryTo}
              onChange={(e) => setSummaryTo(e.target.value)}
              className="rounded border border-slate-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {summaryLoading && <p className="text-slate-500">Loading…</p>}
          {summaryError && <p className="text-red-600">Failed to load volunteer summary.</p>}
          {!summaryLoading && <SummaryTable rows={summary} />}
        </>
      )}

      {/* Detail view */}
      {view === 'detail' && (
        <>
          <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <input
              name="volunteerName"
              placeholder="Volunteer name…"
              value={filters.volunteerName}
              onChange={handleFilterChange}
              className="rounded border border-slate-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="rounded border border-slate-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All categories</option>
              <option value="Teaching">Teaching</option>
              <option value="Events">Events</option>
              <option value="Mentoring">Mentoring</option>
              <option value="Admin">Admin</option>
              <option value="Other">Other</option>
            </select>
            <input
              type="date"
              name="from"
              value={filters.from}
              onChange={handleFilterChange}
              className="rounded border border-slate-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              name="to"
              value={filters.to}
              onChange={handleFilterChange}
              className="rounded border border-slate-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {showAddForm && (
            <div className="mb-4">
              <EntryForm
                onSubmit={(data) => createMutation.mutate(data)}
                onCancel={() => setShowAddForm(false)}
                isPending={createMutation.isPending}
              />
            </div>
          )}

          {detailLoading && <p className="text-slate-500">Loading…</p>}
          {detailError && <p className="text-red-600">Failed to load volunteer hours.</p>}

          {!detailLoading && entries.length === 0 && !showAddForm && (
            <p className="text-slate-500">No entries.</p>
          )}

          {entries.length > 0 && (
            <div className="space-y-2">
              {entries.map((entry) => (
                <div key={entry.id}>
                  {editingId === entry.id ? (
                    <EntryForm
                      initial={{
                        volunteerName: entry.volunteerName,
                        category: entry.category,
                        hours: entry.hours,
                        description: entry.description ?? '',
                        recordedAt: entry.recordedAt.slice(0, 10),
                      }}
                      onSubmit={(data) => updateMutation.mutate({ id: entry.id, data })}
                      onCancel={() => setEditingId(null)}
                      isPending={updateMutation.isPending}
                    />
                  ) : (
                    <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-800">{entry.volunteerName}</span>
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                            {entry.category}
                          </span>
                          {entry.source === 'pike13' && (
                            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                              Pike13
                            </span>
                          )}
                        </div>
                        <div className="mt-0.5 flex gap-3 text-sm text-slate-600">
                          <span>{entry.hours} hrs</span>
                          {entry.description && <span>{entry.description}</span>}
                          <span className="text-slate-400">
                            {entry.recordedAt.slice(0, 10)}
                            {entry.source === 'pike13' && (() => {
                              const start = new Date(entry.recordedAt)
                              const end = new Date(start.getTime() + entry.hours * 3_600_000)
                              const fmt = (d: Date) => d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
                              return <span className="ml-1">· {fmt(start)}–{fmt(end)}</span>
                            })()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4 flex shrink-0 gap-2">
                        <button
                          onClick={() => { setEditingId(entry.id); setShowAddForm(false) }}
                          className="rounded bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteMutation.mutate(entry.id)}
                          disabled={entry.source === 'pike13' || deleteMutation.isPending}
                          className="rounded bg-red-50 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
