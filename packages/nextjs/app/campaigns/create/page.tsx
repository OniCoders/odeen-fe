"use client"

import { useState, useEffect } from "react"
import { Button } from "~~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~~/components/ui/card"
import { Input } from "~~/components/ui/input"
import { Label } from "~~/components/ui/label"
import { Textarea } from "~~/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~~/components/ui/select"
import { Checkbox } from "~~/components/ui/checkbox"
import { Badge } from "~~/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { BusinessNav } from "~~/components/business-nav"
import { userStorage, productStorage, badgeStorage, campaignStorage } from "~~/lib/storage"
import { useRouter } from "next/navigation"
import { useToast } from "~~/hooks/use-toast"

export default function CreateCampaign() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [selectedBadges, setSelectedBadges] = useState<string[]>([])
  const [availableProducts, setAvailableProducts] = useState<any[]>([])
  const [availableBadges, setAvailableBadges] = useState<any[]>([])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    ruleType: "",
    targetValue: "",
    rewardType: "",
    rewardValue: "",
    status: "draft" as "active" | "draft",
  })
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const user = userStorage.getCurrentUser()
    if (!user || user.type !== "business") {
      router.push("/")
      return
    }

    setCurrentUser(user)

    // Load business products and badges
    const products = productStorage.getByBusinessId(user.id)
    const badges = badgeStorage.getByBusinessId(user.id)

    setAvailableProducts(products)
    setAvailableBadges(badges)
  }, [router])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleProduct = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    )
  }

  const toggleBadge = (badgeId: string) => {
    setSelectedBadges((prev) => (prev.includes(badgeId) ? prev.filter((id) => id !== badgeId) : [...prev, badgeId]))
  }

  const handleSubmit = (isDraft = false) => {
    if (!currentUser) return

    // Validation
    if (
      !formData.name ||
      !formData.description ||
      !formData.ruleType ||
      !formData.targetValue ||
      !formData.rewardType
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (selectedProducts.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one product",
        variant: "destructive",
      })
      return
    }

    try {
      const campaignData = {
        businessId: currentUser.id,
        name: formData.name,
        description: formData.description,
        startDate: formData.startDate || new Date().toISOString().split("T")[0],
        endDate: formData.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        ruleType: formData.ruleType as any,
        targetValue: Number.parseInt(formData.targetValue),
        rewardType: formData.rewardType as any,
        rewardValue: formData.rewardValue || "Standard reward",
        productIds: selectedProducts,
        badgeIds: selectedBadges,
        status: isDraft ? ("draft" as const) : ("active" as const),
      }

      const newCampaign = campaignStorage.create(campaignData)

      toast({
        title: isDraft ? "Campaign Saved as Draft" : "Campaign Created Successfully",
        description: `Campaign "${newCampaign.name}" has been ${isDraft ? "saved as draft" : "created and activated"}.`,
      })

      router.push("/dashboard/business")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (!currentUser) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen">
      <BusinessNav />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/dashboard/business" className="inline-flex items-center text-blue-200 hover:text-blue-400 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-200">Create New Campaign</h1>
          <p className="text-gray-400 mt-2">Set up a loyalty campaign with rules, products, and rewards</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Campaign Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Information</CardTitle>
                <CardDescription>Basic details about your loyalty campaign</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Campaign Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Summer Sale Loyalty Program"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your campaign and its benefits..."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange("startDate", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-date">End Date</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange("endDate", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Campaign Rules</CardTitle>
                <CardDescription>Define how customers can participate and earn rewards</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rule-type">Rule Type *</Label>
                  <Select value={formData.ruleType} onValueChange={(value) => handleInputChange("ruleType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rule type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="purchase-count">Purchase Count (e.g., buy 3 items)</SelectItem>
                      <SelectItem value="spend-amount">Spend Amount (e.g., spend $100)</SelectItem>
                      <SelectItem value="visit-frequency">Visit Frequency (e.g., visit 5 times)</SelectItem>
                      <SelectItem value="referral">Referral Program</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="target-value">Target Value *</Label>
                    <Input
                      id="target-value"
                      placeholder="e.g., 3"
                      type="number"
                      value={formData.targetValue}
                      onChange={(e) => handleInputChange("targetValue", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reward-type">Reward Type *</Label>
                    <Select
                      value={formData.rewardType}
                      onValueChange={(value) => handleInputChange("rewardType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select reward" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="badge">Badge Only</SelectItem>
                        <SelectItem value="discount">Discount</SelectItem>
                        <SelectItem value="free-item">Free Item</SelectItem>
                        <SelectItem value="points">Loyalty Points</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reward-value">Reward Description</Label>
                  <Input
                    id="reward-value"
                    placeholder="e.g., 20% discount, Free coffee, 100 points"
                    value={formData.rewardValue}
                    onChange={(e) => handleInputChange("rewardValue", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Product Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Products *</CardTitle>
                <CardDescription>Choose which products are part of this campaign</CardDescription>
              </CardHeader>
              <CardContent>
                {availableProducts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-300 mb-4">No products available</p>
                    <Link href="/products/manage">
                      <Button>Create Products First</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {availableProducts.map((product) => (
                      <div key={product.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <Checkbox
                          checked={selectedProducts.includes(product.id)}
                          onCheckedChange={() => toggleProduct(product.id)}
                        />
                        <div className="flex-1">
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-400">${product.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Badge Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Badges</CardTitle>
                <CardDescription>Choose badges that customers can earn from this campaign</CardDescription>
              </CardHeader>
              <CardContent>
                {availableBadges.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-300 mb-4">No badges available</p>
                    <Link href="/badges/create">
                      <Button>Create Badges First</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {availableBadges.map((badge) => (
                      <div
                        key={badge.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedBadges.includes(badge.id)
                            ? "border-blue-500 bg-blue-600/40"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => toggleBadge(badge.id)}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-2">{badge.icon}</div>
                          <p className="font-medium text-sm">{badge.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Campaign Preview */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Preview</CardTitle>
                <CardDescription>How your campaign will appear to customers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gray-50/10 rounded-lg">
                  <h3 className="font-semibold mb-2">{formData.name || "Campaign Name"}</h3>
                  <p className="text-sm text-gray-400 mb-3">
                    {formData.description || "Campaign description will appear here..."}
                  </p>

                  {formData.ruleType && formData.targetValue && (
                    <div className="mb-3">
                      <p className="text-xs font-medium text-gray-400 mb-1">Goal:</p>
                      <p className="text-sm">
                        {formData.ruleType === "purchase-count" && `Purchase ${formData.targetValue} items`}
                        {formData.ruleType === "spend-amount" && `Spend $${formData.targetValue}`}
                        {formData.ruleType === "visit-frequency" && `Visit ${formData.targetValue} times`}
                        {formData.ruleType === "referral" && `Refer ${formData.targetValue} friends`}
                      </p>
                    </div>
                  )}

                  {selectedProducts.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-medium text-gray-300 mb-2">Qualifying Products:</p>
                      <div className="space-y-1">
                        {selectedProducts.map((productId) => {
                          const product = availableProducts.find((p) => p.id === productId)
                          return (
                            <Badge key={productId} variant="outline" className="text-xs mr-1">
                              {product?.name}
                            </Badge>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {selectedBadges.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-300 mb-2">Earn These Badges:</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedBadges.map((badgeId) => {
                          const badge = availableBadges.find((b) => b.id === badgeId)
                          return (
                            <span key={badgeId} className="text-lg" title={badge?.name}>
                              {badge?.icon}
                            </span>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button
                className="w-full"
                onClick={() => handleSubmit(false)}
                disabled={!formData.name || !formData.description || selectedProducts.length === 0}
              >
                Create & Activate Campaign
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleSubmit(true)}
                disabled={!formData.name || !formData.description || selectedProducts.length === 0}
              >
                Save as Draft
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
