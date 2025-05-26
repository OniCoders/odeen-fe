"use client"

import { useState, useEffect } from "react"
import { Button } from "~~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~~/components/ui/card"
import { Badge } from "~~/components/ui/badge"
import { Plus, PlayIcon as Campaign, Package, Award, Users } from "lucide-react"
import Link from "next/link"
import { BusinessNav } from "~~/components/business-nav"
import { userStorage, campaignStorage, productStorage, badgeStorage } from "~~/lib/storage"
import { useRouter } from "next/navigation"

export default function BusinessDashboard() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [stats, setStats] = useState({
    activeCampaigns: 0,
    totalProducts: 0,
    totalBadges: 0,
    totalParticipants: 0,
  })
  const router = useRouter()

  useEffect(() => {
    const user = userStorage.getCurrentUser()
    if (!user || user.type !== "business") {
      router.push("/")
      return
    }

    setCurrentUser(user)

    // Load business data
    const businessCampaigns = campaignStorage.getByBusinessId(user.id)
    const businessProducts = productStorage.getByBusinessId(user.id)
    const businessBadges = badgeStorage.getByBusinessId(user.id)

    setCampaigns(businessCampaigns)

    // Calculate stats
    const activeCampaigns = businessCampaigns.filter((c) => c.status === "active").length
    const totalParticipants = businessCampaigns.reduce((sum, c) => sum + c.participants.length, 0)

    setStats({
      activeCampaigns,
      totalProducts: businessProducts.length,
      totalBadges: businessBadges.length,
      totalParticipants,
    })
  }, [router])

  if (!currentUser) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen">
      <BusinessNav />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-200">Business Dashboard</h1>
          <p className="text-gray-300 mt-2">
            Welcome back, {currentUser.name}! Manage your loyalty campaigns, products, and customer engagement
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Active Campaigns</p>
                  <p className="text-2xl font-bold">{stats.activeCampaigns}</p>
                </div>
                <Campaign className="h-8 w-8 text-blue-300" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Total Products</p>
                  <p className="text-2xl font-bold">{stats.totalProducts}</p>
                </div>
                <Package className="h-8 w-8 text-green-300" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Badges Created</p>
                  <p className="text-2xl font-bold">{stats.totalBadges}</p>
                </div>
                <Award className="h-8 w-8 text-purple-300" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Total Participants</p>
                  <p className="text-2xl font-bold">{stats.totalParticipants}</p>
                </div>
                <Users className="h-8 w-8 text-orange-300" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/campaigns/create">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Plus className="h-12 w-12 text-blue-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Create Campaign</h3>
                <p className="text-gray-400">Set up a new loyalty campaign with rules and rewards</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/products/manage">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Package className="h-12 w-12 text-green-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Manage Products</h3>
                <p className="text-gray-400">Add and organize products for your campaigns</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/badges/create">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Award className="h-12 w-12 text-purple-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Design Badges</h3>
                <p className="text-gray-400">Create attractive badges as customer rewards</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Campaigns */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Campaigns</CardTitle>
            <CardDescription>Overview of your loyalty campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            {campaigns.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-300 mb-4">No campaigns created yet</p>
                <Link href="/campaigns/create">
                  <Button>Create Your First Campaign</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h4 className="font-semibold">{campaign.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-300 mt-1">
                          <span>{campaign.participants.length} participants</span>
                          <span>{campaign.productIds.length} products</span>
                          <span>{campaign.badgeIds.length} badges</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant={campaign.status === "active" ? "default" : "secondary"}>{campaign.status}</Badge>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
