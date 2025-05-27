"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~~/components/ui/card"
import { ArrowLeft, Users, Award, Target } from "lucide-react"
import Link from "next/link"
import { BusinessNav } from "~~/components/business-nav"
import { userStorage, campaignStorage, progressStorage } from "~~/lib/storage"
import { useRouter } from "next/navigation"

export default function CustomersPage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [customerData, setCustomerData] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    const user = userStorage.getCurrentUser()
    if (!user || user.type !== "business") {
      router.push("/")
      return
    }

    setCurrentUser(user)
    loadCustomerData(user.id)
  }, [router])

  const loadCustomerData = (businessId: string) => {
    // Get business campaigns
    const businessCampaigns = campaignStorage.getByBusinessId(businessId)

    // Get all customers who participated in any campaign
    const allUsers = userStorage.getAll()
    const customers = allUsers.filter((user) => user.type === "customer")

    // Get customer progress for business campaigns
    const customerStats = customers
      .map((customer) => {
        const customerProgress = progressStorage.getByCustomerId(customer.id)
        const businessProgress = customerProgress.filter((progress) =>
          businessCampaigns.some((campaign) => campaign.id === progress.campaignId),
        )

        const activeCampaigns = businessProgress.filter((p) => !p.completed).length
        const completedCampaigns = businessProgress.filter((p) => p.completed).length
        const totalBadges = businessProgress.reduce((sum, p) => sum + p.earnedBadges.length, 0)
        const totalProgress = businessProgress.reduce((sum, p) => sum + p.progress, 0)

        return {
          ...customer,
          activeCampaigns,
          completedCampaigns,
          totalBadges,
          totalProgress,
          isParticipating: businessProgress.length > 0,
        }
      })
      .filter((customer) => customer.isParticipating)

    setCustomerData(customerStats)
  }

  if (!currentUser) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BusinessNav />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/dashboard/business" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Customer Participants</h1>
          <p className="text-gray-600 mt-2">View customers participating in your loyalty campaigns</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Participants</p>
                  <p className="text-2xl font-bold">{customerData.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Participations</p>
                  <p className="text-2xl font-bold">
                    {customerData.reduce((sum, customer) => sum + customer.activeCampaigns, 0)}
                  </p>
                </div>
                <Target className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Badges Earned</p>
                  <p className="text-2xl font-bold">
                    {customerData.reduce((sum, customer) => sum + customer.totalBadges, 0)}
                  </p>
                </div>
                <Award className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer List */}
        <Card>
          <CardHeader>
            <CardTitle>Participating Customers</CardTitle>
            <CardDescription>Customers who have joined your loyalty campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            {customerData.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Participants Yet</h3>
                <p className="text-gray-600">Create and activate campaigns to start attracting customers</p>
              </div>
            ) : (
              <div className="space-y-4">
                {customerData.map((customer) => (
                  <div
                    key={customer.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">{customer.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold">{customer.name}</h4>
                        <p className="text-sm text-gray-600">{customer.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-600">Active</p>
                        <p className="text-lg font-bold text-blue-600">{customer.activeCampaigns}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-600">Completed</p>
                        <p className="text-lg font-bold text-green-600">{customer.completedCampaigns}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-600">Badges</p>
                        <p className="text-lg font-bold text-purple-600">{customer.totalBadges}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-600">Progress</p>
                        <p className="text-lg font-bold text-orange-600">{customer.totalProgress}</p>
                      </div>
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
