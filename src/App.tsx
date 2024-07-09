import { Route, Routes, Navigate } from 'react-router-dom'
import Dashboard from './page/dashboard/Dashboard'
import Login from './page/login/Login'
import {
  isAuthenticated,
  ProtectedRoute,
} from './components/util/ProtectedRoute'
import { Toaster } from 'react-hot-toast'
import UserManagement from './page/user-management/UserManagement'

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
