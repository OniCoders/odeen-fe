"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LogOut, User } from "lucide-react"
import { Button } from "~~/components/ui/button"
import { useAuth } from "~~/context/AuthContext"

export default function DashboardWithContext() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, logout } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Cargando...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Panel de Control</h1>
        <Button variant="outline" onClick={logout} className="flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </Button>
      </div>

      <div className="bg-gray-600 p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-gray-200 p-4 rounded-full">
            <User className="h-8 w-8 text-gray-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-gray-200">{user.email}</p>
          </div>
        </div>

        <div className="border-t pt-4 mt-4">
          <h3 className="font-medium mb-2">Información de sesión</h3>
          <p className="text-sm text-gray-200">
            Inicio de sesión: {user.loginTime ? new Date(user.loginTime).toLocaleString() : 'No disponible'}
          </p>
        </div>
      </div>
    </div>
  )
}