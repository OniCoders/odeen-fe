// services/authService.ts

// Simulación de usuarios (en un entorno real, esto estaría en el backend)
const USERS = [
    { email: "usuario@ejemplo.com", password: "123456", name: "Usuario Demo" },
    { email: "admin@ejemplo.com", password: "admin123", name: "Administrador" }
  ]
  
  export interface User {
    email: string
    name: string
    loginTime?: string
  }
  
  export interface AuthData {
    email: string
    password: string
    rememberMe?: boolean
  }
  
  export const authService = {
    /**
     * Inicia sesión con email y contraseña
     */
    login: async (data: AuthData): Promise<User> => {
      // Simular una llamada a API
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const user = USERS.find(u => 
        u.email === data.email && u.password === data.password
      )
      
      if (!user) {
        throw new Error("Credenciales inválidas")
      }
      
      const userData: User = {
        email: user.email,
        name: user.name,
        loginTime: new Date().toISOString()
      }

      
      
      // Guardar en sessionStorage
      sessionStorage.setItem("isAuthenticated", "true")
      sessionStorage.setItem("userData", JSON.stringify(userData))
      
      // Manejar "recordarme"
      if (data.rememberMe) {
        localStorage.setItem("rememberedEmail", data.email)
      } else {
        localStorage.removeItem("rememberedEmail")
      }
      
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);

      sessionStorage.setItem("expiresAt", expiresAt.toISOString());

      return userData
    },
    
    /**
     * Cierra la sesión actual
     */
    logout: () => {
      sessionStorage.removeItem("isAuthenticated")
      sessionStorage.removeItem("userData")
    },
    
    /**
     * Verifica si el usuario está autenticado
     */
    isAuthenticated: (): boolean => {
      if (typeof window === "undefined") return false;
  
      const isAuth = sessionStorage.getItem("isAuthenticated") === "true";
      const expiresAt = sessionStorage.getItem("expiresAt");
      
      if (!isAuth || !expiresAt) return false;
      
      // Verificar si la sesión ha expirado
      return new Date(expiresAt) > new Date();
    },
    
    /**
     * Obtiene los datos del usuario autenticado
     */
    getUserData: (): User | null => {
      if (typeof window === "undefined") return null
      
      const userDataStr = sessionStorage.getItem("userData")
      if (!userDataStr) return null
      
      try {
        return JSON.parse(userDataStr)
      } catch (error) {
        console.error("Error parsing user data", error)
        return null
      }
    },
    
    /**
     * Obtiene el email recordado (si existe)
     */
    getRememberedEmail: (): string | null => {
      if (typeof window === "undefined") return null
      return localStorage.getItem("rememberedEmail")
    }
  }