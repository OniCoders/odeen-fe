"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "~~/context/AuthContext"

interface ProtectedRouteWithContextProps {
  children: React.ReactNode
}

export default function ProtectedRouteWithContext({ children }: ProtectedRouteWithContextProps) {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        setAuthorized(true)
      } else {
        router.push("/auth/login")
      }
    }
  }, [isAuthenticated, isLoading, router])

  // Mostrar un estado de carga mientras se verifica la autenticación
  if (isLoading || !authorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          {isLoading ? "Verificando autenticación..." : "Redirigiendo..."}
        </div>
      </div>
    )
  }

  // Solo renderizar los componentes hijos si el usuario está autenticado
  return <>{children}</>
}