"use client"

import { Button } from "~~/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "~~/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~~/components/ui/dropdown-menu"
import { User, Award, Target, Gift, Settings, LogOut } from "lucide-react"
import Link from "next/link"
import { userStorage } from "~~/lib/storage"
import { useRouter } from "next/navigation"

export function CustomerNav() {
  const router = useRouter()

  const handleLogout = () => {
    userStorage.clearCurrentUser()
    router.push("/")
  }

  return (
    <nav className="bg-white/40 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard/customer" className="flex items-center space-x-2">
              <User className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold">Loyalty Hub</span>
            </Link>

            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="/dashboard/customer"
                className="text-gray-300 hover:text-blue-400 flex items-center space-x-1"
              >
                <span>Dashboard</span>
              </Link>
              <Link href="/my-badges" className="text-gray-300 hover:text-blue-400 flex items-center space-x-1">
                <Award className="h-4 w-4" />
                <span>My Badges</span>
              </Link>
              <Link href="/campaigns" className="text-gray-300 hover:text-blue-400 flex items-center space-x-1">
                <Target className="h-4 w-4" />
                <span>Campaigns</span>
              </Link>
              <Link href="/rewards" className="text-gray-300 hover:text-blue-400 flex items-center space-x-1">
                <Gift className="h-4 w-4" />
                <span>Rewards</span>
              </Link>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Customer" />
                  <AvatarFallback>CU</AvatarFallback>
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
