// Types for our data structures
export interface User {
  id: string
  email: string
  name: string
  type: "customer" | "business"
  createdAt: string
}

export interface Product {
  id: string
  businessId: string
  name: string
  price: number
  description: string
  category: string
  createdAt: string
}

export interface Badge {
  id: string
  businessId: string
  name: string
  icon: string
  description: string
  createdAt: string
}

export interface Campaign {
  id: string
  businessId: string
  name: string
  description: string
  startDate: string
  endDate: string
  ruleType: "purchase-count" | "spend-amount" | "visit-frequency" | "referral"
  targetValue: number
  rewardType: "badge" | "discount" | "free-item" | "points"
  rewardValue: string
  productIds: string[]
  badgeIds: string[]
  status: "active" | "draft" | "completed"
  participants: string[]
  createdAt: string
}

export interface CustomerProgress {
  id: string
  customerId: string
  campaignId: string
  progress: number
  completed: boolean
  completedAt?: string
  earnedBadges: string[]
}

export interface Reward {
  id: string
  customerId: string
  campaignId: string
  type: "badge" | "discount" | "free-item" | "points"
  value: string
  claimed: boolean
  claimedAt?: string
  createdAt: string
}

// Storage keys
const STORAGE_KEYS = {
  USERS: "loyalty_users",
  PRODUCTS: "loyalty_products",
  BADGES: "loyalty_badges",
  CAMPAIGNS: "loyalty_campaigns",
  CUSTOMER_PROGRESS: "loyalty_customer_progress",
  REWARDS: "loyalty_rewards",
  CURRENT_USER: "loyalty_current_user",
}

// Generic storage functions
function getFromStorage<T>(key: string): T[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : []
}

function saveToStorage<T>(key: string, data: T[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(key, JSON.stringify(data))
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// User management
export const userStorage = {
  create: (userData: Omit<User, "id" | "createdAt">): User => {
    const users = getFromStorage<User>(STORAGE_KEYS.USERS)
    const newUser: User = {
      ...userData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    }
    users.push(newUser)
    saveToStorage(STORAGE_KEYS.USERS, users)
    return newUser
  },

  getAll: (): User[] => getFromStorage<User>(STORAGE_KEYS.USERS),

  getById: (id: string): User | undefined => {
    const users = getFromStorage<User>(STORAGE_KEYS.USERS)
    return users.find((user) => user.id === id)
  },

  getByEmail: (email: string): User | undefined => {
    const users = getFromStorage<User>(STORAGE_KEYS.USERS)
    return users.find((user) => user.email === email)
  },

  setCurrentUser: (user: User): void => {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))
  },

  getCurrentUser: (): User | null => {
    if (typeof window === "undefined") return null
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
    return data ? JSON.parse(data) : null
  },

  clearCurrentUser: (): void => {
    if (typeof window === "undefined") return
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
  },
}

// Product management
export const productStorage = {
  create: (productData: Omit<Product, "id" | "createdAt">): Product => {
    const products = getFromStorage<Product>(STORAGE_KEYS.PRODUCTS)
    const newProduct: Product = {
      ...productData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    }
    products.push(newProduct)
    saveToStorage(STORAGE_KEYS.PRODUCTS, products)
    return newProduct
  },

  getAll: (): Product[] => getFromStorage<Product>(STORAGE_KEYS.PRODUCTS),

  getByBusinessId: (businessId: string): Product[] => {
    const products = getFromStorage<Product>(STORAGE_KEYS.PRODUCTS)
    return products.filter((product) => product.businessId === businessId)
  },

  getById: (id: string): Product | undefined => {
    const products = getFromStorage<Product>(STORAGE_KEYS.PRODUCTS)
    return products.find((product) => product.id === id)
  },

  update: (id: string, updates: Partial<Product>): Product | undefined => {
    const products = getFromStorage<Product>(STORAGE_KEYS.PRODUCTS)
    const index = products.findIndex((product) => product.id === id)
    if (index !== -1) {
      products[index] = { ...products[index], ...updates }
      saveToStorage(STORAGE_KEYS.PRODUCTS, products)
      return products[index]
    }
    return undefined
  },

  delete: (id: string): boolean => {
    const products = getFromStorage<Product>(STORAGE_KEYS.PRODUCTS)
    const filteredProducts = products.filter((product) => product.id !== id)
    if (filteredProducts.length !== products.length) {
      saveToStorage(STORAGE_KEYS.PRODUCTS, filteredProducts)
      return true
    }
    return false
  },
}

// Badge management
export const badgeStorage = {
  create: (badgeData: Omit<Badge, "id" | "createdAt">): Badge => {
    const badges = getFromStorage<Badge>(STORAGE_KEYS.BADGES)
    const newBadge: Badge = {
      ...badgeData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    }
    badges.push(newBadge)
    saveToStorage(STORAGE_KEYS.BADGES, badges)
    return newBadge
  },

  getAll: (): Badge[] => getFromStorage<Badge>(STORAGE_KEYS.BADGES),

  getByBusinessId: (businessId: string): Badge[] => {
    const badges = getFromStorage<Badge>(STORAGE_KEYS.BADGES)
    return badges.filter((badge) => badge.businessId === businessId)
  },

  getById: (id: string): Badge | undefined => {
    const badges = getFromStorage<Badge>(STORAGE_KEYS.BADGES)
    return badges.find((badge) => badge.id === id)
  },

  update: (id: string, updates: Partial<Badge>): Badge | undefined => {
    const badges = getFromStorage<Badge>(STORAGE_KEYS.BADGES)
    const index = badges.findIndex((badge) => badge.id === id)
    if (index !== -1) {
      badges[index] = { ...badges[index], ...updates }
      saveToStorage(STORAGE_KEYS.BADGES, badges)
      return badges[index]
    }
    return undefined
  },

  delete: (id: string): boolean => {
    const badges = getFromStorage<Badge>(STORAGE_KEYS.BADGES)
    const filteredBadges = badges.filter((badge) => badge.id !== id)
    if (filteredBadges.length !== badges.length) {
      saveToStorage(STORAGE_KEYS.BADGES, filteredBadges)
      return true
    }
    return false
  },
}

// Campaign management
export const campaignStorage = {
  create: (campaignData: Omit<Campaign, "id" | "createdAt" | "participants">): Campaign => {
    const campaigns = getFromStorage<Campaign>(STORAGE_KEYS.CAMPAIGNS)
    const newCampaign: Campaign = {
      ...campaignData,
      id: generateId(),
      participants: [],
      createdAt: new Date().toISOString(),
    }
    campaigns.push(newCampaign)
    saveToStorage(STORAGE_KEYS.CAMPAIGNS, campaigns)
    return newCampaign
  },

  getAll: (): Campaign[] => getFromStorage<Campaign>(STORAGE_KEYS.CAMPAIGNS),

  getByBusinessId: (businessId: string): Campaign[] => {
    const campaigns = getFromStorage<Campaign>(STORAGE_KEYS.CAMPAIGNS)
    return campaigns.filter((campaign) => campaign.businessId === businessId)
  },

  getActiveForCustomer: (): Campaign[] => {
    const campaigns = getFromStorage<Campaign>(STORAGE_KEYS.CAMPAIGNS)
    const now = new Date()
    return campaigns.filter(
      (campaign) =>
        campaign.status === "active" && new Date(campaign.startDate) <= now && new Date(campaign.endDate) >= now,
    )
  },

  getById: (id: string): Campaign | undefined => {
    const campaigns = getFromStorage<Campaign>(STORAGE_KEYS.CAMPAIGNS)
    return campaigns.find((campaign) => campaign.id === id)
  },

  update: (id: string, updates: Partial<Campaign>): Campaign | undefined => {
    const campaigns = getFromStorage<Campaign>(STORAGE_KEYS.CAMPAIGNS)
    const index = campaigns.findIndex((campaign) => campaign.id === id)
    if (index !== -1) {
      campaigns[index] = { ...campaigns[index], ...updates }
      saveToStorage(STORAGE_KEYS.CAMPAIGNS, campaigns)
      return campaigns[index]
    }
    return undefined
  },

  addParticipant: (campaignId: string, customerId: string): boolean => {
    const campaigns = getFromStorage<Campaign>(STORAGE_KEYS.CAMPAIGNS)
    const campaign = campaigns.find((c) => c.id === campaignId)
    if (campaign && !campaign.participants.includes(customerId)) {
      campaign.participants.push(customerId)
      saveToStorage(STORAGE_KEYS.CAMPAIGNS, campaigns)
      return true
    }
    return false
  },

  delete: (id: string): boolean => {
    const campaigns = getFromStorage<Campaign>(STORAGE_KEYS.CAMPAIGNS)
    const filteredCampaigns = campaigns.filter((campaign) => campaign.id !== id)
    if (filteredCampaigns.length !== campaigns.length) {
      saveToStorage(STORAGE_KEYS.CAMPAIGNS, filteredCampaigns)
      return true
    }
    return false
  },
}

// Customer progress management
export const progressStorage = {
  create: (progressData: Omit<CustomerProgress, "id">): CustomerProgress => {
    const progress = getFromStorage<CustomerProgress>(STORAGE_KEYS.CUSTOMER_PROGRESS)
    const newProgress: CustomerProgress = {
      ...progressData,
      id: generateId(),
    }
    progress.push(newProgress)
    saveToStorage(STORAGE_KEYS.CUSTOMER_PROGRESS, progress)
    return newProgress
  },

  getByCustomerId: (customerId: string): CustomerProgress[] => {
    const progress = getFromStorage<CustomerProgress>(STORAGE_KEYS.CUSTOMER_PROGRESS)
    return progress.filter((p) => p.customerId === customerId)
  },

  getByCampaignId: (campaignId: string): CustomerProgress[] => {
    const progress = getFromStorage<CustomerProgress>(STORAGE_KEYS.CUSTOMER_PROGRESS)
    return progress.filter((p) => p.campaignId === campaignId)
  },

  getByCustomerAndCampaign: (customerId: string, campaignId: string): CustomerProgress | undefined => {
    const progress = getFromStorage<CustomerProgress>(STORAGE_KEYS.CUSTOMER_PROGRESS)
    return progress.find((p) => p.customerId === customerId && p.campaignId === campaignId)
  },

  update: (id: string, updates: Partial<CustomerProgress>): CustomerProgress | undefined => {
    const progress = getFromStorage<CustomerProgress>(STORAGE_KEYS.CUSTOMER_PROGRESS)
    const index = progress.findIndex((p) => p.id === id)
    if (index !== -1) {
      progress[index] = { ...progress[index], ...updates }
      saveToStorage(STORAGE_KEYS.CUSTOMER_PROGRESS, progress)
      return progress[index]
    }
    return undefined
  },
}

// Rewards management
export const rewardStorage = {
  create: (rewardData: Omit<Reward, "id" | "createdAt">): Reward => {
    const rewards = getFromStorage<Reward>(STORAGE_KEYS.REWARDS)
    const newReward: Reward = {
      ...rewardData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    }
    rewards.push(newReward)
    saveToStorage(STORAGE_KEYS.REWARDS, rewards)
    return newReward
  },

  getByCustomerId: (customerId: string): Reward[] => {
    const rewards = getFromStorage<Reward>(STORAGE_KEYS.REWARDS)
    return rewards.filter((reward) => reward.customerId === customerId)
  },

  getAvailableByCustomerId: (customerId: string): Reward[] => {
    const rewards = getFromStorage<Reward>(STORAGE_KEYS.REWARDS)
    return rewards.filter((reward) => reward.customerId === customerId && !reward.claimed)
  },

  claimReward: (id: string): boolean => {
    const rewards = getFromStorage<Reward>(STORAGE_KEYS.REWARDS)
    const reward = rewards.find((r) => r.id === id)
    if (reward && !reward.claimed) {
      reward.claimed = true
      reward.claimedAt = new Date().toISOString()
      saveToStorage(STORAGE_KEYS.REWARDS, rewards)
      return true
    }
    return false
  },
}

// Initialize with sample data if empty
export const initializeSampleData = () => {
  if (typeof window === "undefined") return

  // Check if data already exists
  const users = getFromStorage<User>(STORAGE_KEYS.USERS)
  if (users.length > 0) return

  // Create sample business user
  const businessUser = userStorage.create({
    email: "business@example.com",
    name: "Coffee Corner",
    type: "business",
  })

  // Create sample customer user
  const customerUser = userStorage.create({
    email: "customer@example.com",
    name: "John Doe",
    type: "customer",
  })

  // Create sample products
  const products = [
    {
      name: "Premium Coffee Blend",
      price: 24.99,
      description: "Rich and aromatic coffee blend",
      category: "Beverages",
    },
    { name: "Artisan Pastries", price: 8.99, description: "Freshly baked pastries", category: "Food" },
    { name: "Coffee Mug Set", price: 19.99, description: "Beautiful ceramic mug set", category: "Accessories" },
    { name: "Gift Card $50", price: 50.0, description: "$50 gift card", category: "Gift Cards" },
  ]

  products.forEach((product) => {
    productStorage.create({
      ...product,
      businessId: businessUser.id,
    })
  })

  // Create sample badges
  const badges = [
    { name: "Coffee Lover", icon: "☕", description: "For true coffee enthusiasts" },
    { name: "Frequent Buyer", icon: "🛍️", description: "Regular customer badge" },
    { name: "VIP Member", icon: "⭐", description: "Exclusive VIP status" },
    { name: "Early Bird", icon: "🌅", description: "Morning coffee lover" },
  ]

  badges.forEach((badge) => {
    badgeStorage.create({
      ...badge,
      businessId: businessUser.id,
    })
  })
}
