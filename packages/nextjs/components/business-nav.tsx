"use client"

import { Button } from "~~/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "~~/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~~/components/ui/dropdown-menu"
import { Building2, PlayIcon as Campaign, Package, Award, Users, Settings, LogOut } from "lucide-react"
import Link from "next/link"
import { userStorage } from "~~/lib/storage"
import { useRouter } from "next/navigation"

export function BusinessNav() {
  const router = useRouter()

  const handleLogout = () => {
    userStorage.clearCurrentUser()
    router.push("/")
  }

  return (
    <nav className="bg-white/10 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard/business" className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold">Loyalty Pro</span>
            </Link>

            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="/dashboard/business"
                className="text-gray-700 hover:text-blue-600 flex items-center space-x-1"
              >
                <span>Dashboard</span>
              </Link>
              <Link href="/campaigns/create" className="text-gray-300 hover:text-blue-300 flex items-center space-x-1">
                <Campaign className="h-4 w-4" />
                <span>Campaigns</span>
              </Link>
              <Link href="/products/manage" className="text-gray-300 hover:text-blue-300 flex items-center space-x-1">
                <Package className="h-4 w-4" />
                <span>Products</span>
              </Link>
              <Link href="/badges/create" className="text-gray-300 hover:text-blue-300 flex items-center space-x-1">
                <Award className="h-4 w-4" />
                <span>Badges</span>
              </Link>
              <Link href="/customers" className="text-gray-300 hover:text-blue-300 flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>Customers</span>
              </Link>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Business Owner" />
                  <AvatarFallback>BO</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}
