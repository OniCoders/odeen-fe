"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2 } from "lucide-react"

import { Button } from "~~/components/ui/button"
import { Checkbox } from "~~/components/ui/checkbox"
import { Input } from "~~/components/ui/input"
import { Label } from "~~/components/ui/label"
import { useAuth } from "~~/context/AuthContext"
import { authService } from "~~/services/authService"

export function LoginForm() {
  const router = useRouter()
  const { login, isAuthenticated } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  // Verificar si el usuario ya está autenticado al cargar el componente
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard")
    }
  }, [isAuthenticated, router])

  // Cargar email recordado, si existe
  useEffect(() => {
    const rememberedEmail = authService.getRememberedEmail()
    if (rememberedEmail) {
      setEmail(rememberedEmail)
      setRememberMe(true)
    }
  }, [])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Por favor, completa todos los campos")
      return
    }

    try {
      setIsLoading(true)
      await login(email, password, rememberMe)
      router.push("/dashboard")
    } catch (err: any) {
      setError(err?.message || "Email o contraseña incorrectos")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-6">
      <div className="space-y-4 rounded-md shadow-sm">
        <div>
          <Label htmlFor="email" className="text-gray-300">
            Correo electrónico
          </Label>
          <div className="mt-1">
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full appearance-none rounded-md border border-gray-300 bg-gray-50 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
              placeholder="tu@ejemplo.com"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="password" className="text-gray-300">
            Contraseña
          </Label>
          <div className="mt-1 relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full appearance-none rounded-md border border-gray-300 bg-gray-50 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
              placeholder="••••••••"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
            </button>
          </div>
        </div>
      </div>

      {error && <div className="text-sm text-red-500 mt-2">{error}</div>}

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Checkbox 
            id="remember-me" 
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked === true)}
            className="h-4 w-4 text-gray-500 focus:ring-gray-500 border-gray-300 rounded" 
          />
          <Label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
            Recordarme
          </Label>
        </div>
      </div>

      <div>
        <Button
          type="submit"
          disabled={isLoading}
          className="group relative flex w-full justify-center rounded-md border border-transparent bg-gray-700 py-2 px-4 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Iniciar sesión
        </Button>
      </div>
    </form>
  )
}
