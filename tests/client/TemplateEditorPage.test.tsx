import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Router, Switch, Route } from 'wouter'
import { memoryLocation } from 'wouter/memory-location'
import { TemplateEditorPage } from '../../client/src/pages/TemplateEditorPage'
import type { TemplateDto } from '../../client/src/types/template'

function makeClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
}

function renderEditor(path: string) {
  const { hook, navigate } = memoryLocation({ path, record: true })
  const result = render(
    <QueryClientProvider client={makeClient()}>
      <Router hook={hook}>
        <Switch>
          <Route path="/templates/new">
            <TemplateEditorPage />
          </Route>
          <Route path="/templates/:id">
            <TemplateEditorPage />
          </Route>
        </Switch>
      </Router>
    </QueryClientProvider>,
  )
  return { ...result, navigate }
}

const EXISTING_TEMPLATE: TemplateDto = {
  id: 7,
  name: 'Starter Template',
  subject: 'Monthly Report for {{studentName}}',
  body: 'Hi {{studentName}}, here is your {{month}} report.',
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
}

function setupFetch(opts: { templates?: TemplateDto[]; saveResponse?: TemplateDto } = {}) {
  const { templates = [], saveResponse = EXISTING_TEMPLATE } = opts
  vi.stubGlobal(
    'fetch',
    vi.fn((url: string, options?: RequestInit) => {
      if ((url as string).includes('/api/templates') && options?.method === 'POST') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ ...saveResponse, id: 99 }),
        })
      }
      if ((url as string).match(/\/api\/templates\/\d+$/) && options?.method === 'PUT') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(saveResponse),
        })
      }
      if ((url as string).includes('/api/templates')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(templates),
        })
      }
      return Promise.reject(new Error(`Unmocked fetch: ${url}`))
    }),
  )
}

describe('TemplateEditorPage — create mode', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders empty form with New Template heading', () => {
    setupFetch()
    renderEditor('/templates/new')

    expect(screen.getByText('New Template')).toBeInTheDocument()
    // Labels have no htmlFor; select inputs by role order: [name, subject, body]
    const inputs = screen.getAllByRole('textbox')
    expect(inputs[0]).toHaveValue('') // Name
    expect(inputs[1]).toHaveValue('') // Subject
    expect(inputs[2]).toHaveValue('') // Body
  })

  it('Submit fires POST /api/templates with form values', async () => {
    setupFetch({
      saveResponse: {
        id: 99,
        name: 'My Template',
        subject: 'Hello',
        body: 'World',
        createdAt: '',
        updatedAt: '',
      },
    })
    renderEditor('/templates/new')

    const [nameInput, subjectInput, bodyInput] = screen.getAllByRole('textbox')
    await userEvent.type(nameInput, 'My Template')
    await userEvent.type(subjectInput, 'Hello')
    await userEvent.type(bodyInput, 'World')

    await userEvent.click(screen.getByRole('button', { name: /^Save$/i }))

    await waitFor(() => {
      const calls = (fetch as ReturnType<typeof vi.fn>).mock.calls
      const postCall = calls.find(
        ([url, opts]) =>
          (url as string).includes('/api/templates') && (opts as RequestInit)?.method === 'POST',
      )
      expect(postCall).toBeTruthy()
      const body = JSON.parse((postCall![1] as RequestInit).body as string)
      expect(body.name).toBe('My Template')
      expect(body.subject).toBe('Hello')
      expect(body.body).toBe('World')
    })
  })
})

describe('TemplateEditorPage — edit mode', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders pre-populated fields in edit mode', async () => {
    setupFetch({ templates: [EXISTING_TEMPLATE] })
    renderEditor('/templates/7')

    expect(screen.getByText('Edit Template')).toBeInTheDocument()
    expect(await screen.findByDisplayValue('Starter Template')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Monthly Report for {{studentName}}')).toBeInTheDocument()
    expect(
      screen.getByDisplayValue('Hi {{studentName}}, here is your {{month}} report.'),
    ).toBeInTheDocument()
  })

  it('Submit fires PUT /api/templates/:id with updated values', async () => {
    setupFetch({ templates: [EXISTING_TEMPLATE], saveResponse: EXISTING_TEMPLATE })
    renderEditor('/templates/7')

    // Wait for pre-population
    const nameInput = await screen.findByDisplayValue('Starter Template')
    await userEvent.clear(nameInput)
    await userEvent.type(nameInput, 'Updated Template')

    await userEvent.click(screen.getByRole('button', { name: /^Save$/i }))

    await waitFor(() => {
      const calls = (fetch as ReturnType<typeof vi.fn>).mock.calls
      const putCall = calls.find(
        ([url, opts]) =>
          (url as string).includes('/api/templates/7') && (opts as RequestInit)?.method === 'PUT',
      )
      expect(putCall).toBeTruthy()
      const body = JSON.parse((putCall![1] as RequestInit).body as string)
      expect(body.name).toBe('Updated Template')
    })
  })

  it('Cancel navigates back to /templates without saving', async () => {
    setupFetch({ templates: [EXISTING_TEMPLATE] })
    const { navigate } = renderEditor('/templates/7')

    await screen.findByText('Edit Template')
    await userEvent.click(screen.getByRole('button', { name: /Cancel/i }))

    // No POST or PUT should have been made
    const calls = (fetch as ReturnType<typeof vi.fn>).mock.calls
    const writeCalls = calls.filter(
      ([, opts]) =>
        (opts as RequestInit)?.method === 'POST' || (opts as RequestInit)?.method === 'PUT',
    )
    expect(writeCalls).toHaveLength(0)
  })
})
