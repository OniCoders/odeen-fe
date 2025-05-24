import ProtectedRoute from "~~/components/ProtectedRoute"
import Dashboard from "~~/components/sections/dashboard"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  )
}