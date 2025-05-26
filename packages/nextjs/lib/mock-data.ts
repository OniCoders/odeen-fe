import type { Campaign, User, Profile } from "~~/types"

export const mockCampaigns: Campaign[] = [
  {
    id: "camp-1",
    business_name: "Coffee Corner",
    title: "Coffee Lover Challenge",
    description: "Scan 3 different coffee products to earn your Coffee Master badge!",
    rules: {
      type: "scan_count",
      target: 3,
    },
    badge: {
      id: "badge-1",
      name: "Coffee Master",
      description: "Completed the Coffee Lover Challenge",
      image: "/placeholder.svg?height=80&width=80&text=☕",
    },
    rewards: [
      {
        id: "reward-1",
        type: "discount",
        value: "20%",
        description: "20% off your next coffee purchase",
      },
    ],
    is_active: true,
    products: [
      {
        id: "prod-1",
        name: "Espresso Blend",
        campaign_id: "camp-1",
        qr_code: "QR-ESP-001",
        image: "/placeholder.svg?height=100&width=100&text=Espresso",
      },
      {
        id: "prod-2",
        name: "Colombian Roast",
        campaign_id: "camp-1",
        qr_code: "QR-COL-002",
        image: "/placeholder.svg?height=100&width=100&text=Colombian",
      },
      {
        id: "prod-3",
        name: "French Vanilla",
        campaign_id: "camp-1",
        qr_code: "QR-FRV-003",
        image: "/placeholder.svg?height=100&width=100&text=Vanilla",
      },
    ],
  },
  {
    id: "camp-2",
    business_name: "Tech Store",
    title: "Gadget Explorer",
    description: "Visit our store twice to unlock exclusive tech deals!",
    rules: {
      type: "visit_count",
      target: 2,
    },
    badge: {
      id: "badge-2",
      name: "Tech Explorer",
      description: "Visited Tech Store multiple times",
      image: "/placeholder.svg?height=80&width=80&text=🔧",
    },
    rewards: [
      {
        id: "reward-2",
        type: "gift",
        value: "Free",
        description: "Free phone case with any purchase",
      },
    ],
    is_active: true,
    products: [
      {
        id: "prod-4",
        name: "Store Visit",
        campaign_id: "camp-2",
        qr_code: "QR-VISIT-001",
        image: "/placeholder.svg?height=100&width=100&text=Visit",
      },
    ],
  },
]

export const mockUser: User = {
  id: "user-1",
  email: "demo@example.com",
  public_id: "pub-user-1",
  created_at: new Date().toISOString(),
}

export const mockProfile: Profile = {
  id: "profile-1",
  user_id: "user-1",
  public_id: "pub-user-1",
  scanned_products: [],
  claimed_badges: [],
  created_at: new Date().toISOString(),
}
