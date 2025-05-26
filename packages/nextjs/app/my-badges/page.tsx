"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~~/components/ui/card"
import { Badge } from "~~/components/ui/badge"
import { ArrowLeft, Award, Calendar, Trophy } from "lucide-react"
import Link from "next/link"
import { CustomerNav } from "~~/components/customer-nav"
import { userStorage, progressStorage, badgeStorage, campaignStorage } from "~~/lib/storage"
import { useRouter } from "next/navigation"

export default function MyBadgesPage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [earnedBadges, setEarnedBadges] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const user = userStorage.getCurrentUser()
    if (!user || user.type !== "customer") {
      router.push("/")
      return
    }

    setCurrentUser(user)
    loadEarnedBadges(user.id)
  }, [router])

  const loadEarnedBadges = (customerId: string) => {
    try {
      // Get customer progress to find earned badges
      const customerProgress = progressStorage.getByCustomerId(customerId)

      // Get all badges and campaigns for context
      const allBadges = badgeStorage.getAll()
      const allCampaigns = campaignStorage.getAll()

      // Collect all earned badges with details
      const badgeDetails: any[] = []

      customerProgress.forEach((progress) => {
        if (progress.completed && progress.earnedBadges && progress.earnedBadges.length > 0) {
          const campaign = allCampaigns.find((c) => c.id === progress.campaignId)

          progress.earnedBadges.forEach((badgeId) => {
            const badge = allBadges.find((b) => b.id === badgeId)
            if (badge) {
              badgeDetails.push({
                ...badge,
                earnedDate: progress.completedAt || progress.createdAt || new Date().toISOString(),
                campaignName: campaign?.name || "Unknown Campaign",
                campaignId: progress.campaignId,
              })
            }
          })
        }
      })

      // Sort by earned date (newest first)
      badgeDetails.sort((a, b) => new Date(b.earnedDate).getTime() - new Date(a.earnedDate).getTime())

      setEarnedBadges(badgeDetails)
    } catch (error) {
      console.error("Error loading badges:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!currentUser) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen">
      <CustomerNav />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/dashboard/customer" className="inline-flex items-center text-blue-300 hover:text-blue-400 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="h-8 w-8 text-yellow-600" />
            <h1 className="text-3xl font-bold text-gray-300">My Badges</h1>
          </div>
          <p className="text-gray-400">Your earned badges and achievements</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Badges</p>
                  <p className="text-2xl font-bold">{earnedBadges.length}</p>
                </div>
                <Award className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-2xl font-bold">
                    {
                      earnedBadges.filter((badge) => {
                        const earnedDate = new Date(badge.earnedDate)
                        const now = new Date()
                        return (
                          earnedDate.getMonth() === now.getMonth() && earnedDate.getFullYear() === now.getFullYear()
                        )
                      }).length
                    }
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300">Latest Badge</p>
                  <p className="text-sm font-bold">
                    {earnedBadges.length > 0 ? new Date(earnedBadges[0].earnedDate).toLocaleDateString() : "None yet"}
                  </p>
                </div>
                <Trophy className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Badges Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Earned Badges</CardTitle>
            <CardDescription>All the badges you've earned through your loyalty journey</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-300">Loading your badges...</p>
              </div>
            ) : earnedBadges.length === 0 ? (
              <div className="text-center py-12">
                <Award className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Badges Yet</h3>
                <p className="text-gray-400 mb-6">Start participating in campaigns to earn your first badge!</p>
                <Link href="/campaigns">
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                    Browse Campaigns
                  </button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {earnedBadges.map((badge, index) => (
                  <Card
                    key={`${badge.id}-${index}`}
                    className="hover:shadow-lg transition-shadow border-2 border-yellow-200"
                  >
                    <CardContent className="p-6">
                      <div className="text-center mb-4">
                        <div className="text-5xl mb-3">{badge.icon}</div>
                        <h3 className="text-lg font-bold text-gray-400 mb-1">{badge.name}</h3>
                        <Badge variant="default" className="bg-yellow-500 text-white">
                          Earned
                        </Badge>
                      </div>

                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="font-medium text-gray-400">Description:</p>
                          <p className="text-gray-600">{badge.description}</p>
                        </div>

                        <div>
                          <p className="font-medium text-gray-400">Earned from:</p>
                          <p className="text-gray-600">{badge.campaignName}</p>
                        </div>

                        <div>
                          <p className="font-medium text-gray-400">Date earned:</p>
                          <p className="text-gray-600 flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(badge.earnedDate)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
