import { Switch, Route } from 'wouter'
import { LoginPage } from './pages/LoginPage'
import { PendingActivationPage } from './pages/PendingActivationPage'
import { InstructorDashboardStub } from './pages/InstructorDashboardStub'
import { AdminStub } from './pages/AdminStub'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/pending-activation" component={PendingActivationPage} />
      <Route path="/dashboard">
        <ProtectedRoute role="instructor">
          <InstructorDashboardStub />
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
