import { apiClient, type ApiResponse } from "../api-client"
import { API_CONFIG } from "../api-config"
import type { Product, ProductCreateRequest } from "../api-types"

export interface ProductUpdateRequest {
  name?: string
  description?: string
  category?: string
  region?: string
  price?: number
  stock?: number
  weight?: number
  shelfLife?: string
  ingredients?: string
  nutritionInfo?: string
  status?: "draft" | "active" | "inactive"
}

export interface ProductSearchParams {
  query?: string
  category?: string
  region?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  vendorId?: string
  sortBy?: "price" | "rating" | "sales" | "newest"
  sortOrder?: "asc" | "desc"
  page?: number
  limit?: number
}

export interface ProductListResponse {
  products: Product[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  filters: {
    categories: Array<{ name: string; count: number }>
    regions: Array<{ name: string; count: number }>
    priceRange: { min: number; max: number }
  }
}

class ProductService {
  // Create new product
  async createProduct(data: ProductCreateRequest): Promise<ApiResponse<Product>> {
    if (data.images && data.images.length > 0) {
      // Handle file upload
      const formData = new FormData()

      // Add images
      data.images.forEach((image, index) => {
        formData.append(`images[${index}]`, image)
      })

      // Add other fields
      Object.entries(data).forEach(([key, value]) => {
        if (key !== "images" && value !== undefined) {
          formData.append(key, String(value))
        }
      })

      return apiClient.post<Product>(API_CONFIG.ENDPOINTS.PRODUCTS.CREATE, formData)
    }

    return apiClient.post<Product>(API_CONFIG.ENDPOINTS.PRODUCTS.CREATE, data)
  }

  // Get product by ID
  async getProduct(productId: string): Promise<ApiResponse<Product>> {
    return apiClient.get<Product>(API_CONFIG.ENDPOINTS.PRODUCTS.GET, { id: productId })
  }

  // Update product
  async updateProduct(productId: string, data: ProductUpdateRequest): Promise<ApiResponse<Product>> {
    return apiClient.put<Product>(API_CONFIG.ENDPOINTS.PRODUCTS.UPDATE, data, { params: { id: productId } })
  }

  // Delete product
  async deleteProduct(productId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete<{ message: string }>(API_CONFIG.ENDPOINTS.PRODUCTS.DELETE, { id: productId })
  }

  // Get products list with filters
  async getProducts(params: ProductSearchParams = {}): Promise<ApiResponse<ProductListResponse>> {
    return apiClient.get<ProductListResponse>(API_CONFIG.ENDPOINTS.PRODUCTS.LIST, params)
  }

  // Search products
  async searchProducts(params: ProductSearchParams): Promise<ApiResponse<ProductListResponse>> {
    return apiClient.get<ProductListResponse>(API_CONFIG.ENDPOINTS.PRODUCTS.SEARCH, params)
  }

  // Get vendor's products
  async getVendorProducts(
    vendorId: string,
    params?: { page?: number; limit?: number },
  ): Promise<ApiResponse<ProductListResponse>> {
    return apiClient.get<ProductListResponse>(API_CONFIG.ENDPOINTS.PRODUCTS.VENDOR_PRODUCTS, {
      vendorId,
      ...params,
    })
  }

  // Get current vendor's products
  async getMyProducts(params?: { page?: number; limit?: number; status?: string }): Promise<
    ApiResponse<ProductListResponse>
  > {
    return apiClient.get<ProductListResponse>("/vendors/products", params)
  }

  // Upload product images
  async uploadProductImages(
    productId: string,
    images: File[],
  ): Promise<ApiResponse<{ images: Array<{ id: string; url: string }> }>> {
    const formData = new FormData()
    images.forEach((image, index) => {
      formData.append(`images[${index}]`, image)
    })

    return apiClient.post<{ images: Array<{ id: string; url: string }> }>(
      API_CONFIG.ENDPOINTS.PRODUCTS.UPLOAD_IMAGES,
      formData,
      { params: { id: productId } },
    )
  }

  // Delete product image
  async deleteProductImage(productId: string, imageId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete<{ message: string }>(`/products/${productId}/images/${imageId}`)
  }

  // Get product categories
  async getCategories(): Promise<ApiResponse<Array<{ name: string; count: number; description?: string }>>> {
    return apiClient.get<Array<{ name: string; count: number; description?: string }>>(
      API_CONFIG.ENDPOINTS.PRODUCTS.CATEGORIES,
    )
  }

  // Get featured products
  async getFeaturedProducts(limit = 12): Promise<ApiResponse<Product[]>> {
    return apiClient.get<Product[]>("/products/featured", { limit })
  }

  // Get trending products
  async getTrendingProducts(limit = 12): Promise<ApiResponse<Product[]>> {
    return apiClient.get<Product[]>("/products/trending", { limit })
  }

  // Get related products
  async getRelatedProducts(productId: string, limit = 6): Promise<ApiResponse<Product[]>> {
    return apiClient.get<Product[]>(`/products/${productId}/related`, { limit })
  }

  // Update product status
  async updateProductStatus(productId: string, status: "draft" | "active" | "inactive"): Promise<ApiResponse<Product>> {
    return apiClient.patch<Product>(`/products/${productId}/status`, { status })
  }

  // Bulk update products
  async bulkUpdateProducts(
    productIds: string[],
    updates: {
      status?: "draft" | "active" | "inactive"
      category?: string
      price?: number
    },
  ): Promise<ApiResponse<{ updated: number; message: string }>> {
    return apiClient.patch<{ updated: number; message: string }>("/products/bulk-update", {
      productIds,
      updates,
    })
  }

  // Get product analytics
  async getProductAnalytics(
    productId: string,
    period: "7d" | "30d" | "90d" | "1y" = "30d",
  ): Promise<
    ApiResponse<{
      views: number
      sales: number
      revenue: number
      conversionRate: number
      chartData: {
        labels: string[]
        views: number[]
        sales: number[]
        revenue: number[]
      }
    }>
  > {
    return apiClient.get(`/products/${productId}/analytics`, { period })
  }

  // Add product to wishlist
  async addToWishlist(productId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>(`/products/${productId}/wishlist`)
  }

  // Remove product from wishlist
  async removeFromWishlist(productId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete<{ message: string }>(`/products/${productId}/wishlist`)
  }

  // Get user's wishlist
  async getWishlist(params?: { page?: number; limit?: number }): Promise<ApiResponse<ProductListResponse>> {
    return apiClient.get<ProductListResponse>("/products/wishlist", params)
  }
}

// Export singleton instance
export const productService = new ProductService()
