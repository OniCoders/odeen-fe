"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~~/components/ui/card"
import { Badge } from "~~/components/ui/badge"
import { Button } from "~~/components/ui/button"
import { Progress } from "~~/components/ui/progress"
import { ArrowLeft, Target, Users, Calendar, Award } from "lucide-react"
import Link from "next/link"
import { CustomerNav } from "~~/components/customer-nav"
import { userStorage, campaignStorage, progressStorage, badgeStorage, productStorage } from "~~/lib/storage"
import { useRouter } from "next/navigation"
import { useToast } from "~~/hooks/use-toast"

export default function CampaignsPage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [activeCampaigns, setActiveCampaigns] = useState<any[]>([])
  const [myCampaigns, setMyCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const user = userStorage.getCurrentUser()
    if (!user || user.type !== "customer") {
      router.push("/")
      return
    }

    setCurrentUser(user)
    loadCampaigns(user.id)
  }, [router])

  const loadCampaigns = (customerId: string) => {
    try {
      // Get all active campaigns
      const allActiveCampaigns = campaignStorage.getActiveForCustomer()

      // Get customer progress
      const customerProgress = progressStorage.getByCustomerId(customerId)

      // Get additional data for context
      const allBadges = badgeStorage.getAll()
      const allProducts = productStorage.getAll()

      // Separate campaigns into "available" and "my campaigns"
      const availableCampaigns: any[] = []
      const participatingCampaigns: any[] = []

      allActiveCampaigns.forEach((campaign) => {
        const progress = customerProgress.find((p) => p.campaignId === campaign.id)
        const isParticipating = campaign.participants.includes(customerId)

        // Get campaign badges
        const campaignBadges = campaign.badgeIds
          .map((badgeId) => allBadges.find((b) => b.id === badgeId))
          .filter(Boolean)

        // Get campaign products
        const campaignProducts = campaign.productIds
          .map((productId) => allProducts.find((p) => p.id === productId))
          .filter(Boolean)

        const enrichedCampaign = {
          ...campaign,
          progress: progress?.progress || 0,
          completed: progress?.completed || false,
          earnedBadges: progress?.earnedBadges || [],
          badges: campaignBadges,
          products: campaignProducts,
          progressPercentage: progress ? (progress.progress / campaign.targetValue) * 100 : 0,
        }

        if (isParticipating) {
          participatingCampaigns.push(enrichedCampaign)
        } else {
          availableCampaigns.push(enrichedCampaign)
        }
      })

      setActiveCampaigns(availableCampaigns)
      setMyCampaigns(participatingCampaigns)
    } catch (error) {
      console.error("Error loading campaigns:", error)
    } finally {
      setLoading(false)
    }
  }

  const joinCampaign = (campaignId: string) => {
    if (!currentUser) return

    try {
      // Add user to campaign participants
      campaignStorage.addParticipant(campaignId, currentUser.id)

      // Create initial progress record
      progressStorage.create({
        customerId: currentUser.id,
        campaignId: campaignId,
        progress: 0,
        completed: false,
        earnedBadges: [],
      })

      toast({
        title: "Joined Campaign!",
        description: "You've successfully joined the campaign. Start participating to earn rewards!",
      })

      // Reload campaigns
      loadCampaigns(currentUser.id)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join campaign. Please try again.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
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
            <Target className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-200">Campaigns</h1>
          </div>
          <p className="text-gray-600">Discover and participate in loyalty campaigns</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300">My Campaigns</p>
                  <p className="text-2xl font-bold">{myCampaigns.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300">Available</p>
                  <p className="text-2xl font-bold">{activeCampaigns.length}</p>
                </div>
                <Target className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300">Completed</p>
                  <p className="text-2xl font-bold">{myCampaigns.filter((c) => c.completed).length}</p>
                </div>
                <Award className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* My Campaigns */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              My Campaigns
            </CardTitle>
            <CardDescription>Campaigns you're currently participating in</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading your campaigns...</p>
              </div>
            ) : myCampaigns.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-200 mb-2">No Active Campaigns</h3>
                <p className="text-gray-300">Join a campaign below to start earning rewards!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myCampaigns.map((campaign) => (
                  <Card key={campaign.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2">{campaign.name}</h3>
                          <p className="text-gray-300 mb-3">{campaign.description}</p>

                          <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Target className="h-4 w-4" />
                              {campaign.ruleType.replace("-", " ")}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <Badge variant={campaign.completed ? "default" : "secondary"}>
                            {campaign.completed ? "Completed" : "In Progress"}
                          </Badge>
                          <Badge variant="outline">{campaign.rewardType}</Badge>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span>
                            {campaign.progress}/{campaign.targetValue}
                          </span>
                        </div>
                        <Progress value={campaign.progressPercentage} className="h-2" />
                      </div>

                      {/* Badges */}
                      {campaign.badges.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-400 mb-2">Badges to earn:</p>
                          <div className="flex gap-2">
                            {campaign.badges.map((badge: any) => (
                              <div key={badge.id} className="flex items-center gap-1 text-sm">
                                <span className="text-lg">{badge.icon}</span>
                                <span>{badge.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Reward */}
                      <div className="bg-gray-50/10 p-3 rounded-lg">
                        <p className="text-sm font-medium text-gray-400">Reward:</p>
                        <p className="text-sm text-gray-300">{campaign.rewardValue}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Available Campaigns */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Available Campaigns
            </CardTitle>
            <CardDescription>Join new campaigns to earn more rewards</CardDescription>
          </CardHeader>
          <CardContent>
            {activeCampaigns.length === 0 ? (
              <div className="text-center py-8">
                <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-200 mb-2">No Available Campaigns</h3>
                <p className="text-gray-400">Check back later for new campaigns!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeCampaigns.map((campaign) => (
                  <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">{campaign.name}</h3>
                        <p className="text-gray-300 mb-3">{campaign.description}</p>

                        <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(campaign.endDate)}
                          </span>
                          <Badge variant="outline">{campaign.rewardType}</Badge>
                        </div>
                      </div>

                      {/* Goal */}
                      <div className="mb-4 p-3 bg-blue-50/10 rounded-lg">
                        <p className="text-sm font-medium text-blue-900">Goal:</p>
                        <p className="text-sm text-blue-800">
                          {campaign.ruleType === "purchase-count" && `Purchase ${campaign.targetValue} items`}
                          {campaign.ruleType === "spend-amount" && `Spend $${campaign.targetValue}`}
                          {campaign.ruleType === "visit-frequency" && `Visit ${campaign.targetValue} times`}
                          {campaign.ruleType === "referral" && `Refer ${campaign.targetValue} friends`}
                        </p>
                      </div>

                      {/* Badges */}
                      {campaign.badges.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-400 mb-2">Earn badges:</p>
                          <div className="flex gap-2">
                            {campaign.badges.map((badge: any) => (
                              <span key={badge.id} className="text-lg" title={badge.name}>
                                {badge.icon}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Reward */}
                      <div className="mb-4 p-3 bg-green-50 rounded-lg">
                        <p className="text-sm font-medium text-green-900">Reward:</p>
                        <p className="text-sm text-green-800">{campaign.rewardValue}</p>
                      </div>

                      <Button onClick={() => joinCampaign(campaign.id)} className="w-full">
                        Join Campaign
                      </Button>
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
