import { Switch, Route, Redirect } from 'wouter'
import { LoginPage } from './pages/LoginPage'
import { PendingActivationPage } from './pages/PendingActivationPage'
import { DashboardPage } from './pages/DashboardPage'
import { ReviewListPage } from './pages/ReviewListPage'
import { ReviewEditorPage } from './pages/ReviewEditorPage'
import { TemplateListPage } from './pages/TemplateListPage'
import { TemplateEditorPage } from './pages/TemplateEditorPage'
import { CheckinPage } from './pages/CheckinPage'
import { AdminStub } from './pages/AdminStub'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
  return (
    <Switch>
      <Route path="/">
        <Redirect to="/login" />
      </Route>
      <Route path="/login" component={LoginPage} />
      <Route path="/pending-activation" component={PendingActivationPage} />
      <Route path="/dashboard">
        <ProtectedRoute role="instructor">
          <DashboardPage />
        </ProtectedRoute>
      </Route>
      <Route path="/reviews">
        <ProtectedRoute role="instructor">
          <ReviewListPage />
        </ProtectedRoute>
      </Route>
      <Route path="/reviews/:id">
        <ProtectedRoute role="instructor">
          <ReviewEditorPage />
        </ProtectedRoute>
      </Route>
      <Route path="/templates">
        <ProtectedRoute role="instructor">
          <TemplateListPage />
        </ProtectedRoute>
      </Route>
      <Route path="/templates/new">
        <ProtectedRoute role="instructor">
          <TemplateEditorPage />
        </ProtectedRoute>
      </Route>
      <Route path="/templates/:id">
        <ProtectedRoute role="instructor">
          <TemplateEditorPage />
        </ProtectedRoute>
      </Route>
      <Route path="/checkin">
        <ProtectedRoute role="instructor">
          <CheckinPage />
        </ProtectedRoute>
      </Route>
      <Route path="/admin">
        <ProtectedRoute role="admin">
          <AdminStub />
        </ProtectedRoute>
      </Route>
      <Route component={NotFoundPage} />
    </Switch>
  )
}

export default App
