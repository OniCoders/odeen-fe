export interface User {
    id: string
    email: string
    public_id: string
    created_at: string
  }
  
  export interface Profile {
    id: string
    user_id: string
    public_id: string
    scanned_products: string[]
    claimed_badges: string[]
    created_at: string
  }
  
  export interface Campaign {
    id: string
    business_name: string
    title: string
    description: string
    rules: {
      type: "scan_count" | "visit_count" | "specific_products"
      target: number
      products?: string[]
    }
    badge: {
      id: string
      name: string
      description: string
      image: string
    }
    rewards?: {
      id: string
      type: "discount" | "gift" | "points"
      value: string
      description: string
    }[]
    is_active: boolean
    products: Product[]
  }
  
  export interface Product {
    id: string
    name: string
    campaign_id: string
    qr_code: string
    image: string
  }
  
  export interface Badge {
    id: string
    name: string
    description: string
    image: string
    claimed_at: string
    campaign_id: string
  }
  