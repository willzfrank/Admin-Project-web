import { Route, Routes, Navigate } from 'react-router-dom'
import Dashboard from './page/dashboard/Dashboard'
import Login from './page/login/Login'
import {
  isAuthenticated,
  ProtectedRoute,
} from './components/util/ProtectedRoute'
import { Toaster } from 'react-hot-toast'
import UserManagement from './page/user-management/UserManagement'
import IssueManagement from './page/issue-management/IssueManagement'
import ProjectManagement from './page/project-management/page'
import CompanyManagement from './page/company-management/CompanyManagement'
import CompanyDetailsPage from './page/company-management/slug/CompanyDetails'
import ProjectDetailsPage from './page/project-management/slug/ProjectDetailsPage'
import IssueDetails from './page/issue-management/slug/IssueDetails'
import PhasesManagement from './page/phases-management/page'
import PhaseDetails from './page/phases-management/slug/PhaseDetails'


function App() {
  return (
    <>
      <Toaster position="top-center" />{' '}
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-management"
          element={
            <ProtectedRoute>
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/issue-management"
          element={
            <ProtectedRoute>
              <IssueManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company-management"
          element={
            <ProtectedRoute>
              <CompanyManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company-management/:companyId"
          element={
            <ProtectedRoute>
              <CompanyDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/issue-management/:IssueId"
          element={
            <ProtectedRoute>
              <IssueDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/project-management"
          element={
            <ProtectedRoute>
              <ProjectManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/phases-management"
          element={
            <ProtectedRoute>
              <PhasesManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/phases-management/:phaseId"
          element={
            <ProtectedRoute>
              <PhaseDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/project-management/:projectId"
          element={
            <ProtectedRoute>
              <ProjectDetailsPage />
            </ProtectedRoute>
          }
        />

        {/* Redirect to dashboard if authenticated, otherwise to login */}
        <Route
          path="/"
          element={
            isAuthenticated() ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Catch-all route for undefined paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
