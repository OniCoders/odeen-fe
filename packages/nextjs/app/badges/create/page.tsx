"use client"

import { useState, useEffect } from "react"
import { Button } from "~~/components/ui/button"
import { Card, CardContent } from "~~/components/ui/card"
import { Input } from "~~/components/ui/input"
import { Label } from "~~/components/ui/label"
import { Textarea } from "~~/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~~/components/ui/dialog"
import { ArrowLeft, Plus, Edit, Trash2, Award } from "lucide-react"
import Link from "next/link"
import { BusinessNav } from "~~/components/business-nav"
import { userStorage, badgeStorage } from "~~/lib/storage"
import { useRouter } from "next/navigation"
import { useToast } from "~~/hooks/use-toast"

const EMOJI_OPTIONS = [
  "⭐",
  "🏆",
  "🥇",
  "🎖️",
  "🏅",
  "👑",
  "💎",
  "🔥",
  "⚡",
  "🌟",
  "✨",
  "🎯",
  "🚀",
  "💪",
  "🎉",
  "🎊",
  "☕",
  "🛍️",
  "🎁",
  "💝",
  "🌅",
  "🌙",
  "🍀",
  "🦄",
  "🎨",
  "🎭",
  "🎪",
  "🎸",
  "🎵",
  "🎮",
  "📚",
  "🔮",
]

export default function CreateBadges() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [badges, setBadges] = useState<any[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingBadge, setEditingBadge] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    icon: "⭐",
    description: "",
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
    loadBadges(user.id)
  }, [router])

  const loadBadges = (businessId: string) => {
    const businessBadges = badgeStorage.getByBusinessId(businessId)
    setBadges(businessBadges)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setFormData({
      name: "",
      icon: "⭐",
      description: "",
    })
    setEditingBadge(null)
  }

  const handleSubmit = () => {
    if (!currentUser) return

    // Validation
    if (!formData.name || !formData.icon) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      if (editingBadge) {
        // Update existing badge
        badgeStorage.update(editingBadge.id, {
          name: formData.name,
          icon: formData.icon,
          description: formData.description,
        })
        toast({
          title: "Badge Updated",
          description: `Badge "${formData.name}" has been updated successfully.`,
        })
      } else {
        // Create new badge
        badgeStorage.create({
          businessId: currentUser.id,
          name: formData.name,
          icon: formData.icon,
          description: formData.description,
        })
        toast({
          title: "Badge Created",
          description: `Badge "${formData.name}" has been created successfully.`,
        })
      }

      loadBadges(currentUser.id)
      setIsCreateDialogOpen(false)
      resetForm()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save badge. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (badge: any) => {
    setEditingBadge(badge)
    setFormData({
      name: badge.name,
      icon: badge.icon,
      description: badge.description,
    })
    setIsCreateDialogOpen(true)
  }

  const handleDelete = (badgeId: string) => {
    if (confirm("Are you sure you want to delete this badge?")) {
      const success = badgeStorage.delete(badgeId)
      if (success) {
        toast({
          title: "Badge Deleted",
          description: "Badge has been deleted successfully.",
        })
        loadBadges(currentUser.id)
      }
    }
  }

  const openCreateDialog = () => {
    resetForm()
    setIsCreateDialogOpen(true)
  }

  if (!currentUser) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen">
      <BusinessNav />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/dashboard/business" className="inline-flex items-center text-blue-300 hover:text-blue-400 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-200">Design Badges</h1>
              <p className="text-gray-300 mt-2">Create attractive badges as customer rewards</p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openCreateDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Badge
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingBadge ? "Edit Badge" : "Create New Badge"}</DialogTitle>
                  <DialogDescription>
                    {editingBadge ? "Update badge information" : "Design a new badge for your customers"}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="badge-name">Badge Name *</Label>
                    <Input
                      id="badge-name"
                      placeholder="e.g., Coffee Lover"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Select Icon *</Label>
                    <div className="grid grid-cols-8 gap-2 p-4 border rounded-lg max-h-48 overflow-y-auto">
                      {EMOJI_OPTIONS.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          className={`p-2 text-2xl rounded hover:bg-gray-100 ${
                            formData.icon === emoji ? "bg-blue-100 border-2 border-blue-500" : "border"
                          }`}
                          onClick={() => handleInputChange("icon", emoji)}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="badge-description">Description</Label>
                    <Textarea
                      id="badge-description"
                      placeholder="Describe what this badge represents..."
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                    />
                  </div>

                  {/* Preview */}
                  <div className="space-y-2">
                    <Label>Preview</Label>
                    <div className="p-4 border rounded-lg bg-gray-50/10">
                      <div className="text-center">
                        <div className="text-4xl mb-2">{formData.icon}</div>
                        <h4 className="font-semibold">{formData.name || "Badge Name"}</h4>
                        {formData.description && <p className="text-sm text-gray-300 mt-1">{formData.description}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSubmit}>{editingBadge ? "Update Badge" : "Create Badge"}</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Badges Grid */}
        {badges.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-200 mb-2">No Badges Yet</h3>
              <p className="text-gray-300 mb-6">Create your first badge to reward customer loyalty</p>
              <Button onClick={openCreateDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Badge
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {badges.map((badge) => (
              <Card key={badge.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{badge.icon}</div>
                  <h3 className="font-semibold text-lg mb-2">{badge.name}</h3>
                  {badge.description && <p className="text-gray-300 text-sm mb-4">{badge.description}</p>}
                  <div className="flex justify-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(badge)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(badge.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
