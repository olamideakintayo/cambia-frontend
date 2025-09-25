export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  avatar?: string
  emailVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface Vendor {
  id: string
  userId: string
  businessName: string
  businessType: string
  description?: string
  address: {
    street: string
    city: string
    state: string
    country: string
    postalCode: string
  }
  phone: string
  email: string
  website?: string
  logo?: string
  verified: boolean
  verificationStatus: "pending" | "approved" | "rejected"
  documents: VendorDocument[]
  rating: number
  totalReviews: number
  createdAt: string
  updatedAt: string
}

export interface VendorDocument {
  id: string
  type: "business_registration" | "tax_certificate" | "food_license" | "identity"
  fileName: string
  fileUrl: string
  status: "pending" | "approved" | "rejected"
  uploadedAt: string
}

export interface Product {
  id: string
  vendorId: string
  name: string
  description: string
  category: string
  region: string
  price: number
  currency: string
  stock: number
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
  images: ProductImage[]
  shelfLife?: string
  ingredients?: string
  nutritionInfo?: string
  status: "draft" | "pending" | "active" | "inactive" | "out_of_stock"
  rating: number
  totalReviews: number
  totalSales: number
  createdAt: string
  updatedAt: string
  vendor?: Vendor
}

export interface ProductImage {
  id: string
  url: string
  alt?: string
  isPrimary: boolean
  order: number
}

export interface Order {
  id: string
  orderNumber: string
  customerId: string
  vendorId: string
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded"
  items: OrderItem[]
  subtotal: number
  shippingCost: number
  tax: number
  total: number
  currency: string
  shippingAddress: Address
  billingAddress: Address
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  paymentMethod: string
  escrowStatus: "locked" | "released" | "disputed"
  trackingNumber?: string
  estimatedDelivery?: string
  notes?: string
  createdAt: string
  updatedAt: string
  customer?: User
  vendor?: Vendor
}

export interface OrderItem {
  id: string
  productId: string
  quantity: number
  price: number
  total: number
  product?: Product
}

export interface Address {
  id?: string
  firstName: string
  lastName: string
  company?: string
  street: string
  street2?: string
  city: string
  state: string
  country: string
  postalCode: string
  phone?: string
  isDefault?: boolean
}

export interface Payment {
  id: string
  orderId: string
  amount: number
  currency: string
  method: "card" | "bank_transfer" | "wallet" | "crypto"
  status: "pending" | "processing" | "completed" | "failed" | "cancelled" | "refunded"
  transactionId?: string
  gatewayResponse?: any
  escrowStatus: "locked" | "released" | "disputed"
  createdAt: string
  updatedAt: string
}

export interface Shipment {
  id: string
  orderId: string
  carrier: string
  trackingNumber: string
  status: "pending" | "picked_up" | "in_transit" | "out_for_delivery" | "delivered" | "failed"
  estimatedDelivery: string
  actualDelivery?: string
  trackingEvents: TrackingEvent[]
  createdAt: string
  updatedAt: string
}

export interface TrackingEvent {
  id: string
  status: string
  description: string
  location?: string
  timestamp: string
}

export interface Review {
  id: string
  productId?: string
  vendorId?: string
  customerId: string
  rating: number
  title?: string
  comment?: string
  images?: string[]
  verified: boolean
  helpful: number
  createdAt: string
  updatedAt: string
  customer?: User
  product?: Product
  vendor?: Vendor
}

export interface Notification {
  id: string
  userId: string
  type: "order" | "payment" | "shipping" | "review" | "system"
  title: string
  message: string
  data?: any
  read: boolean
  createdAt: string
}

export interface DashboardStats {
  totalProducts: number
  activeOrders: number
  totalRevenue: number
  pendingPayments: number
  totalCustomers: number
  averageRating: number
  recentOrders: Order[]
  topProducts: Product[]
  salesChart: {
    labels: string[]
    data: number[]
  }
}

// Request/Response types
export interface LoginRequest {
  email: string
  password: string
  remember?: boolean
}

export interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
  acceptTerms: boolean
}

export interface VendorRegistrationRequest {
  businessName: string
  businessType: string
  description?: string
  address: Omit<Address, "id" | "isDefault">
  phone: string
  email: string
  website?: string
}

export interface ProductCreateRequest {
  name: string
  description: string
  category: string
  region: string
  price: number
  stock: number
  weight?: number
  shelfLife?: string
  ingredients?: string
  nutritionInfo?: string
  images?: File[]
}

export interface OrderCreateRequest {
  items: {
    productId: string
    quantity: number
  }[]
  shippingAddress: Omit<Address, "id">
  billingAddress?: Omit<Address, "id">
  paymentMethod: string
  notes?: string
}

export interface ShippingRateRequest {
  origin: {
    country: string
    state: string
    city: string
    postalCode: string
  }
  destination: {
    country: string
    state: string
    city: string
    postalCode: string
  }
  items: {
    weight: number
    dimensions?: {
      length: number
      width: number
      height: number
    }
  }[]
}

export interface ShippingRate {
  carrier: string
  service: string
  cost: number
  estimatedDays: number
  description: string
}
