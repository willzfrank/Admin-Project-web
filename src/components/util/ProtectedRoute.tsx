import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

interface ProtectedRouteProps {
  children: ReactNode
}

export const isAuthenticated = (): boolean => {
  const authData = localStorage.getItem('auth')
  if (!authData) {
    return false
  }

  try {
    const { token } = JSON.parse(authData)
    return !!token
  } catch (error) {
    console.error('Error parsing auth data:', error)
    return false
  }
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}
