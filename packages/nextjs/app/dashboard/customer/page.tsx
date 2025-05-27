"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~~/components/ui/card"
import { Badge } from "~~/components/ui/badge"
import { Progress } from "~~/components/ui/progress"
import { Button } from "~~/components/ui/button"
import { Award, Gift, Star, Trophy, Target } from "lucide-react"
import { CustomerNav } from "~~/components/customer-nav"
import { userStorage, campaignStorage, progressStorage, rewardStorage, badgeStorage } from "~~/lib/storage"
import { useRouter } from "next/navigation"
import { useToast } from "~~/hooks/use-toast"

export default function CustomerDashboard() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [userBadges, setUserBadges] = useState<any[]>([])
  const [activeCampaigns, setActiveCampaigns] = useState<any[]>([])
  const [availableRewards, setAvailableRewards] = useState<any[]>([])
  const [stats, setStats] = useState({
    badgesEarned: 0,
    activeCampaigns: 0,
    availableRewards: 0,
    loyaltyScore: 0,
  })
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const user = userStorage.getCurrentUser()
    if (!user || user.type !== "customer") {
      router.push("/")
      return
    }

    setCurrentUser(user)
    loadCustomerData(user.id)
  }, [router])

  const loadCustomerData = (customerId: string) => {
    // Get customer progress
    const customerProgress = progressStorage.getByCustomerId(customerId)

    // Get active campaigns for customer
    const allCampaigns = campaignStorage.getActiveForCustomer()
    const customerCampaigns = allCampaigns.map((campaign) => {
      const progress = customerProgress.find((p) => p.campaignId === campaign.id)
      return {
        ...campaign,
        progress: progress?.progress || 0,
        completed: progress?.completed || false,
        earnedBadges: progress?.earnedBadges || [],
      }
    })

    // Get available rewards
    const rewards = rewardStorage.getAvailableByCustomerId(customerId)

    // Calculate earned badges
    const earnedBadges = customerProgress.filter((p) => p.completed).flatMap((p) => p.earnedBadges)

    // Get badge details
    const allBadges = badgeStorage.getAll()
    const badgeDetails = earnedBadges.map((badgeId) => allBadges.find((b) => b.id === badgeId)).filter(Boolean)

    setActiveCampaigns(customerCampaigns)
    setAvailableRewards(rewards)
    setUserBadges(badgeDetails)

    // Calculate stats
    const loyaltyScore = customerProgress.reduce((sum, p) => sum + p.progress, 0) * 10
    setStats({
      badgesEarned: badgeDetails.length,
      activeCampaigns: customerCampaigns.length,
      availableRewards: rewards.length,
      loyaltyScore: Math.floor(loyaltyScore),
    })
  }

  const joinCampaign = (campaignId: string) => {
    if (!currentUser) return

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

    // Reload data
    loadCustomerData(currentUser.id)
  }

  const claimReward = (rewardId: string) => {
    const success = rewardStorage.claimReward(rewardId)
    if (success) {
      toast({
        title: "Reward Claimed!",
        description: "Your reward has been successfully claimed.",
      })
      loadCustomerData(currentUser.id)
    }
  }

  if (!currentUser) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen">
      <CustomerNav />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-200">My Loyalty Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {currentUser.name}! Track your rewards, badges, and campaign progress
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Badges Earned</p>
                  <p className="text-2xl font-bold">{stats.badgesEarned}</p>
                </div>
                <Award className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Active Campaigns</p>
                  <p className="text-2xl font-bold">{stats.activeCampaigns}</p>
                </div>
                <Target className="h-8 w-8 text-blue-300" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Rewards Available</p>
                  <p className="text-2xl font-bold">{stats.availableRewards}</p>
                </div>
                <Gift className="h-8 w-8 text-green-300" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Loyalty Score</p>
                  <p className="text-2xl font-bold">{stats.loyaltyScore}</p>
                </div>
                <Star className="h-8 w-8 text-purple-300" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Badges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                My Badges
              </CardTitle>
              <CardDescription>Your earned badges</CardDescription>
            </CardHeader>
            <CardContent>
              {userBadges.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No badges earned yet</p>
                  <p className="text-sm text-gray-400">Join campaigns to start earning badges!</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {userBadges.map((badge) => (
                    <div key={badge.id} className="p-4 border rounded-lg text-center">
                      <div className="text-3xl mb-2">{badge.icon}</div>
                      <h4 className="font-semibold text-sm">{badge.name}</h4>
                      <Badge variant="default" className="mt-2">
                        Earned
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Campaigns */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Available Campaigns
              </CardTitle>
              <CardDescription>Join campaigns to earn rewards</CardDescription>
            </CardHeader>
            <CardContent>
              {activeCampaigns.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">No active campaigns available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeCampaigns.map((campaign) => (
                    <div key={campaign.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold">{campaign.name}</h4>
                          <p className="text-sm text-gray-300">{campaign.description}</p>
                        </div>
                        <Badge variant="outline">{campaign.rewardType}</Badge>
                      </div>

                      {campaign.participants?.includes(currentUser.id) ? (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>
                              {campaign.progress}/{campaign.targetValue}
                            </span>
                          </div>
                          <Progress value={(campaign.progress / campaign.targetValue) * 100} className="h-2" />
                          {campaign.completed && (
                            <Badge variant="default" className="mt-2">
                              Completed!
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <Button onClick={() => joinCampaign(campaign.id)} className="w-full mt-2" size="sm">
                          Join Campaign
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Available Rewards */}
        {availableRewards.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Available Rewards
              </CardTitle>
              <CardDescription>Claim your earned rewards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableRewards.map((reward) => (
                  <div key={reward.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold capitalize">{reward.type}</h4>
                        <p className="text-sm text-gray-300">{reward.value}</p>
                      </div>
                    </div>
                    <Button onClick={() => claimReward(reward.id)} className="w-full" size="sm">
                      Claim Reward
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
