"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~~/components/ui/card"
import { Badge } from "~~/components/ui/badge"
import { Button } from "~~/components/ui/button"
import { ArrowLeft, Gift, Calendar, CheckCircle, Clock, Award } from "lucide-react"
import Link from "next/link"
import { CustomerNav } from "~~/components/customer-nav"
import { userStorage, rewardStorage, campaignStorage, progressStorage } from "~~/lib/storage"
import { useRouter } from "next/navigation"
import { useToast } from "~~/hooks/use-toast"

export default function RewardsPage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [allRewards, setAllRewards] = useState<any[]>([])
  const [availableRewards, setAvailableRewards] = useState<any[]>([])
  const [claimedRewards, setClaimedRewards] = useState<any[]>([])
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
    loadRewards(user.id)
  }, [router])

  const loadRewards = (customerId: string) => {
    try {
      // Get customer rewards
      const customerRewards = rewardStorage.getByCustomerId(customerId)

      // Get campaigns for context
      const allCampaigns = campaignStorage.getAll()

      // Get completed progress to create rewards for completed campaigns
      const customerProgress = progressStorage.getByCustomerId(customerId)
      const completedProgress = customerProgress.filter((p) => p.completed)

      // Create rewards for completed campaigns that don't have rewards yet
      completedProgress.forEach((progress) => {
        const campaign = allCampaigns.find((c) => c.id === progress.campaignId)
        if (campaign) {
          const existingReward = customerRewards.find((r) => r.campaignId === progress.campaignId)
          if (!existingReward) {
            // Create a new reward
            rewardStorage.create({
              customerId: customerId,
              campaignId: progress.campaignId,
              type: campaign.rewardType,
              value: campaign.rewardValue,
              claimed: false,
            })
          }
        }
      })

      // Reload rewards after creating new ones
      const updatedRewards = rewardStorage.getByCustomerId(customerId)

      // Enrich rewards with campaign information
      const enrichedRewards = updatedRewards.map((reward) => {
        const campaign = allCampaigns.find((c) => c.id === reward.campaignId)
        return {
          ...reward,
          campaignName: campaign?.name || "Unknown Campaign",
          campaignDescription: campaign?.description || "",
        }
      })

      // Separate available and claimed rewards
      const available = enrichedRewards.filter((r) => !r.claimed)
      const claimed = enrichedRewards.filter((r) => r.claimed)

      setAllRewards(enrichedRewards)
      setAvailableRewards(available)
      setClaimedRewards(claimed)
    } catch (error) {
      console.error("Error loading rewards:", error)
    } finally {
      setLoading(false)
    }
  }

  const claimReward = (rewardId: string) => {
    try {
      const success = rewardStorage.claimReward(rewardId)
      if (success) {
        toast({
          title: "Reward Claimed!",
          description: "Your reward has been successfully claimed.",
        })
        loadRewards(currentUser.id)
      } else {
        toast({
          title: "Error",
          description: "Failed to claim reward. It may have already been claimed.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to claim reward. Please try again.",
        variant: "destructive",
      })
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

  const getRewardIcon = (type: string) => {
    switch (type) {
      case "badge":
        return <Award className="h-5 w-5" />
      case "discount":
        return <Gift className="h-5 w-5" />
      case "free-item":
        return <Gift className="h-5 w-5" />
      case "points":
        return <Award className="h-5 w-5" />
      default:
        return <Gift className="h-5 w-5" />
    }
  }

  const getRewardColor = (type: string) => {
    switch (type) {
      case "badge":
        return "text-purple-600"
      case "discount":
        return "text-green-600"
      case "free-item":
        return "text-blue-600"
      case "points":
        return "text-orange-600"
      default:
        return "text-gray-600"
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
          <Link href="/dashboard/customer" className="inline-flex items-center text-blue-300 hover:text-blue-400 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Gift className="h-8 w-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-200">My Rewards</h1>
          </div>
          <p className="text-gray-300">Your earned rewards and their status</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300">Total Rewards</p>
                  <p className="text-2xl font-bold">{allRewards.length}</p>
                </div>
                <Gift className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300">Available</p>
                  <p className="text-2xl font-bold">{availableRewards.length}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300">Claimed</p>
                  <p className="text-2xl font-bold">{claimedRewards.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Available Rewards */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              Available Rewards
            </CardTitle>
            <CardDescription>Rewards you can claim right now</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-400">Loading your rewards...</p>
              </div>
            ) : availableRewards.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-300 mb-2">No Available Rewards</h3>
                <p className="text-gray-400 mb-6">Complete campaigns to earn rewards!</p>
                <Link href="/campaigns">
                  <Button>Browse Campaigns</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableRewards.map((reward) => (
                  <Card key={reward.id} className="border-2 border-orange-200 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="text-center mb-4">
                        <div
                          className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 mb-3 ${getRewardColor(reward.type)}`}
                        >
                          {getRewardIcon(reward.type)}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1 capitalize">{reward.type}</h3>
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                          Available
                        </Badge>
                      </div>

                      <div className="space-y-3 text-sm mb-4">
                        <div>
                          <p className="font-medium text-gray-200">Reward:</p>
                          <p className="text-gray-300 font-semibold">{reward.value}</p>
                        </div>

                        <div>
                          <p className="font-medium text-gray-700">From campaign:</p>
                          <p className="text-gray-200">{reward.campaignName}</p>
                        </div>

                        <div>
                          <p className="font-medium text-gray-700">Earned:</p>
                          <p className="text-gray-300 flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(reward.createdAt)}
                          </p>
                        </div>
                      </div>

                      <Button onClick={() => claimReward(reward.id)} className="w-full">
                        Claim Reward
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Claimed Rewards */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-blue-300" />
              Claimed Rewards
            </CardTitle>
            <CardDescription>Rewards you have already claimed</CardDescription>
          </CardHeader>
          <CardContent>
            {claimedRewards.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-200 mb-2">No Claimed Rewards</h3>
                <p className="text-gray-300">Your claimed rewards will appear here</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {claimedRewards.map((reward) => (
                  <Card key={reward.id} className="border-2 border-blue-200 opacity-75">
                    <CardContent className="p-6">
                      <div className="text-center mb-4">
                        <div
                          className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-3 ${getRewardColor(reward.type)}`}
                        >
                          {getRewardIcon(reward.type)}
                        </div>
                        <h3 className="text-lg font-bold text-gray-200 mb-1 capitalize">{reward.type}</h3>
                        <Badge variant="default" className="bg-blue-400">
                          Claimed
                        </Badge>
                      </div>

                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="font-medium text-gray-400">Reward:</p>
                          <p className="text-gray-900 font-semibold">{reward.value}</p>
                        </div>

                        <div>
                          <p className="font-medium text-gray-400">From campaign:</p>
                          <p className="text-gray-600">{reward.campaignName}</p>
                        </div>

                        <div>
                          <p className="font-medium text-gray-400">Claimed on:</p>
                          <p className="text-gray-600 flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(reward.claimedAt)}
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
