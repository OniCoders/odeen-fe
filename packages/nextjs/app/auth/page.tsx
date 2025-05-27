"use client"

import { useState, useEffect } from "react"
import { Button } from "~~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~~/components/ui/card"
import { Input } from "~~/components/ui/input"
import { Label } from "~~/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~~/components/ui/tabs"
import { Wallet, Mail, Lock, User, Building2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { userStorage, initializeSampleData } from "~~/lib/storage"
import { useToast } from "~~/hooks/use-toast"

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [userType, setUserType] = useState<"customer" | "business">("customer")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  })
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    initializeSampleData()
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAuth = async (type: "login" | "register" | "wallet") => {
    setIsLoading(true)

    try {
      if (type === "login") {
        const user = userStorage.getByEmail(formData.email)
        if (user && user.type === userType) {
          userStorage.setCurrentUser(user)
          toast({
            title: "Login successful",
            description: `Welcome back, ${user.name}!`,
          })

          if (userType === "business") {
            router.push("/dashboard/business")
          } else {
            router.push("/dashboard/customer")
          }
        } else {
          toast({
            title: "Login failed",
            description: "Invalid credentials or user type mismatch",
            variant: "destructive",
          })
        }
      } else if (type === "register") {
        if (!formData.name || !formData.email) {
          toast({
            title: "Registration failed",
            description: "Please fill in all fields",
            variant: "destructive",
          })
          return
        }

        const existingUser = userStorage.getByEmail(formData.email)
        if (existingUser) {
          toast({
            title: "Registration failed",
            description: "User with this email already exists",
            variant: "destructive",
          })
          return
        }

        const newUser = userStorage.create({
          email: formData.email,
          name: formData.name,
          type: userType,
        })

        userStorage.setCurrentUser(newUser)
        toast({
          title: "Registration successful",
          description: `Welcome, ${newUser.name}!`,
        })

        if (userType === "business") {
          router.push("/dashboard/business")
        } else {
          router.push("/dashboard/customer")
        }
      } else if (type === "wallet") {
        // Simulate wallet connection
        await new Promise((resolve) => setTimeout(resolve, 1500))

        const walletUser = userStorage.create({
          email: `wallet-${Date.now()}@example.com`,
          name: `Wallet User ${Math.floor(Math.random() * 1000)}`,
          type: userType,
        })

        userStorage.setCurrentUser(walletUser)
        toast({
          title: "Wallet connected",
          description: `Welcome, ${walletUser.name}!`,
        })

        if (userType === "business") {
          router.push("/dashboard/business")
        } else {
          router.push("/dashboard/customer")
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Loyalty Platform</CardTitle>
          <CardDescription>Join our loyalty ecosystem as a customer or business</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* User Type Selection */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={userType === "customer" ? "default" : "outline"}
              onClick={() => setUserType("customer")}
              className="flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              Customer
            </Button>
            <Button
              variant={userType === "business" ? "default" : "outline"}
              onClick={() => setUserType("business")}
              className="flex items-center gap-2"
            >
              <Building2 className="h-4 w-4" />
              Business
            </Button>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={() => handleAuth("login")} className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </TabsContent>

            <TabsContent value="register" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    className="pl-10"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={() => handleAuth("register")} className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </TabsContent>
          </Tabs>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button variant="outline" onClick={() => handleAuth("wallet")} className="w-full" disabled={isLoading}>
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
          </Button>

          {/* Demo credentials */}
          <div className="text-xs text-gray-500 text-center space-y-1">
            <p>Demo credentials:</p>
            <p>Business: business@example.com</p>
            <p>Customer: customer@example.com</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
