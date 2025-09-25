export const API_CONFIG = {
  // Base URLs - replace these with your actual backend URLs
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api",

  // API Endpoints
  ENDPOINTS: {
    // Authentication
    AUTH: {
      LOGIN: "/auth/login",
      REGISTER: "/auth/register",
      LOGOUT: "/auth/logout",
      REFRESH: "/auth/refresh",
      VERIFY_EMAIL: "/auth/verify-email",
      FORGOT_PASSWORD: "/auth/forgot-password",
      RESET_PASSWORD: "/auth/reset-password",
      PROFILE: "/auth/profile",
    },

    // Vendor Management
    VENDORS: {
      REGISTER: "/vendors/register",
      PROFILE: "/vendors/profile",
      UPDATE_PROFILE: "/vendors/profile",
      DASHBOARD_STATS: "/vendors/dashboard/stats",
      VERIFICATION: "/vendors/verification",
      DOCUMENTS: "/vendors/documents",
    },

    // Product Management
    PRODUCTS: {
      LIST: "/products",
      CREATE: "/products",
      GET: "/products/:id",
      UPDATE: "/products/:id",
      DELETE: "/products/:id",
      SEARCH: "/products/search",
      CATEGORIES: "/products/categories",
      VENDOR_PRODUCTS: "/vendors/:vendorId/products",
      UPLOAD_IMAGES: "/products/:id/images",
    },

    // Order Management
    ORDERS: {
      CREATE: "/orders",
      LIST: "/orders",
      GET: "/orders/:id",
      UPDATE_STATUS: "/orders/:id/status",
      CANCEL: "/orders/:id/cancel",
      VENDOR_ORDERS: "/vendors/orders",
      CUSTOMER_ORDERS: "/customers/orders",
      TRACKING: "/orders/:id/tracking",
    },

    // Shipping & Logistics
    SHIPPING: {
      CALCULATE_RATES: "/shipping/calculate",
      CREATE_SHIPMENT: "/shipping/create",
      TRACK_SHIPMENT: "/shipping/track/:trackingNumber",
      UPDATE_ADDRESS: "/shipping/address",
      DELIVERY_OPTIONS: "/shipping/delivery-options",
      SHIPPING_ZONES: "/shipping/zones",
    },

    // Payment & Escrow
    PAYMENTS: {
      CREATE_PAYMENT: "/payments/create",
      VERIFY_PAYMENT: "/payments/verify",
      ESCROW_LOCK: "/payments/escrow/lock",
      ESCROW_RELEASE: "/payments/escrow/release",
      REFUND: "/payments/refund",
      PAYMENT_METHODS: "/payments/methods",
      TRANSACTION_HISTORY: "/payments/history",
    },

    // Notifications
    NOTIFICATIONS: {
      LIST: "/notifications",
      MARK_READ: "/notifications/:id/read",
      MARK_ALL_READ: "/notifications/mark-all-read",
      PREFERENCES: "/notifications/preferences",
    },

    // Reviews & Ratings
    REVIEWS: {
      CREATE: "/reviews",
      LIST: "/reviews",
      GET: "/reviews/:id",
      UPDATE: "/reviews/:id",
      DELETE: "/reviews/:id",
      PRODUCT_REVIEWS: "/products/:productId/reviews",
      VENDOR_REVIEWS: "/vendors/:vendorId/reviews",
    },

    // Analytics & Reports
    ANALYTICS: {
      VENDOR_STATS: "/analytics/vendor/:vendorId",
      SALES_REPORT: "/analytics/sales",
      PRODUCT_PERFORMANCE: "/analytics/products",
      CUSTOMER_INSIGHTS: "/analytics/customers",
    },
  },

  // Request timeout in milliseconds
  TIMEOUT: 30000,

  // Default headers
  DEFAULT_HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
}

// Helper function to build URLs with parameters
export function buildUrl(endpoint: string, params?: Record<string, string | number>): string {
  let url = API_CONFIG.BASE_URL + endpoint

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, String(value))
    })
  }

  return url
}
