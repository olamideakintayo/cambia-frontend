// TypeScript

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

// Utility function outside the class
function toProductQueryParams(params?: ProductSearchParams): Record<string, string | number> | undefined {
    if (!params) return undefined
    const query: Record<string, string | number> = {}
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            query[key] = value
        }
    })
    return query
}

class ProductService {
    async createProduct(data: ProductCreateRequest): Promise<ApiResponse<Product>> {
        if (data.images && data.images.length > 0) {
            const formData = new FormData()
            data.images.forEach((image, index) => {
                formData.append(`images[${index}]`, image)
            })
            Object.entries(data).forEach(([key, value]) => {
                if (key !== "images" && value !== undefined) {
                    formData.append(key, String(value))
                }
            })
            return apiClient.post<Product>(API_CONFIG.ENDPOINTS.PRODUCTS.CREATE, formData)
        }
        return apiClient.post<Product>(API_CONFIG.ENDPOINTS.PRODUCTS.CREATE, data)
    }

    async getProduct(productId: string): Promise<ApiResponse<Product>> {
        return apiClient.get<Product>(`${API_CONFIG.ENDPOINTS.PRODUCTS.GET}/${productId}`)
    }

    async searchProducts(params: ProductSearchParams): Promise<ApiResponse<ProductListResponse>> {
        return apiClient.get<ProductListResponse>(
            API_CONFIG.ENDPOINTS.PRODUCTS.SEARCH,
            toProductQueryParams(params)
        )
    }

    async updateProduct(productId: string, data: ProductUpdateRequest): Promise<ApiResponse<Product>> {
        return apiClient.put<Product>(API_CONFIG.ENDPOINTS.PRODUCTS.UPDATE, data, { params: { id: productId } })
    }

    async deleteProduct(productId: string): Promise<ApiResponse<{ message: string }>> {
        return apiClient.delete<{ message: string }>(API_CONFIG.ENDPOINTS.PRODUCTS.DELETE, { id: productId })
    }

    async addToWishlist(productId: string): Promise<ApiResponse<{ message: string }>> {
        return apiClient.post<{ message: string }>(`/products/${productId}/wishlist`)
    }

    async removeFromWishlist(productId: string): Promise<ApiResponse<{ message: string }>> {
        return apiClient.delete<{ message: string }>(`/products/${productId}/wishlist`)
    }

    async getProducts(params: ProductSearchParams = {}): Promise<ApiResponse<ProductListResponse>> {
        return apiClient.get<ProductListResponse>(
            API_CONFIG.ENDPOINTS.PRODUCTS.LIST,
            toProductQueryParams(params)
        )
    }

    async getVendorProducts(
        vendorId: string,
        params?: { page?: number; limit?: number },
    ): Promise<ApiResponse<ProductListResponse>> {
        return apiClient.get<ProductListResponse>(API_CONFIG.ENDPOINTS.PRODUCTS.VENDOR_PRODUCTS, {
            vendorId,
            ...params,
        })
    }

    async getMyProducts(params?: { page?: number; limit?: number; status?: string }): Promise<ApiResponse<ProductListResponse>> {
        return apiClient.get<ProductListResponse>("/vendors/products", params)
    }

    async uploadProductImages(
        productId: string,
        images: File[],
    ): Promise<ApiResponse<{ images: Array<{ id: string; url: string }> }>> {
        const formData = new FormData()
        images.forEach((image, index) => {
            formData.append(`images[${index}]`, image)
        })
        return apiClient.post<{ images: Array<{ id: string; url: string }> }>(
            `/products/${productId}/images`,
            formData
        )
    }

    async deleteProductImage(productId: string, imageId: string): Promise<ApiResponse<{ message: string }>> {
        return apiClient.delete<{ message: string }>(`/products/${productId}/images/${imageId}`)
    }

    async getCategories(): Promise<ApiResponse<Array<{ name: string; count: number; description?: string }>>> {
        return apiClient.get<Array<{ name: string; count: number; description?: string }>>(API_CONFIG.ENDPOINTS.PRODUCTS.CATEGORIES)
    }

    async getFeaturedProducts(limit = 12): Promise<ApiResponse<Product[]>> {
        return apiClient.get<Product[]>("/products/featured", { limit })
    }

    async getTrendingProducts(limit = 12): Promise<ApiResponse<Product[]>> {
        return apiClient.get<Product[]>("/products/trending", { limit })
    }

    async getRelatedProducts(productId: string, limit = 6): Promise<ApiResponse<Product[]>> {
        return apiClient.get<Product[]>(`/products/${productId}/related`, { limit })
    }

    async updateProductStatus(productId: string, status: "draft" | "active" | "inactive"): Promise<ApiResponse<Product>> {
        return apiClient.patch<Product>(`/products/${productId}/status`, { status })
    }

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

    // TypeScript
    async getProductAnalytics(
        productId: string,
        period: "7d" | "30d" | "90d" | "1y" = "30d",
    ): Promise<ApiResponse<{
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
    }>> {
        return apiClient.get(`/products/${productId}/analytics?period=${period}`)
    }


    async getWishlist(params?: { page?: number; limit?: number }): Promise<ApiResponse<ProductListResponse>> {
        return apiClient.get<ProductListResponse>("/products/wishlist", params)
    }
}

export const productService = new ProductService()
