import { Navigate, Outlet } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useApp } from '../context/AppContext'

/**
 * Route guard: renders nested routes only when authenticated. While the
 * cached session is being re-validated it shows a loader to avoid a
 * redirect flash; unauthenticated users are sent to the login page.
 */
export default function PrivateRoute() {
  const { isAuthenticated, initializing } = useApp()

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
      </div>
    )
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}
