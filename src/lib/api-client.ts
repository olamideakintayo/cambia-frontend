import { API_CONFIG, buildUrl } from "./api-config"

import {OrderListParams} from "@/lib/services/order-service";
import {toQueryParams} from "@/lib/query-utils";

import {ProductSearchParams} from "@/lib/services/product-service";


export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  errors?: Record<string, string[]>
  meta?: {
    pagination?: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}

export interface ApiError {
  message: string
  status: number
  errors?: Record<string, string[]>
}

class ApiClient {
  private baseUrl: string
  private defaultHeaders: Record<string, string>

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL
    this.defaultHeaders = API_CONFIG.DEFAULT_HEADERS
  }

  // Get auth token from localStorage or cookies
  getAuthToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token")
    }
    return null
  }

  // Set auth token
  setAuthToken(token: string, remember = false): void {
    if (typeof window !== "undefined") {
      if (remember) {
        localStorage.setItem("auth_token", token)
      } else {
        sessionStorage.setItem("auth_token", token)
      }
    }
  }

  // Remove auth token
  removeAuthToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
      sessionStorage.removeItem("auth_token")
    }
  }

  // Build headers with auth token
  private buildHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const headers = { ...this.defaultHeaders, ...customHeaders }

    const token = this.getAuthToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    return headers
  }

  // Generic request method
  private async request<T>(
    method: string,
    endpoint: string,
    options: {
      params?: Record<string, string | number>
      data?: any
      headers?: Record<string, string>
      timeout?: number
    } = {},
  ): Promise<ApiResponse<T>> {
    const { params, data, headers: customHeaders, timeout = API_CONFIG.TIMEOUT } = options

    const url = buildUrl(endpoint, params)
    const headers = this.buildHeaders(customHeaders)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const config: RequestInit = {
        method,
        headers,
        signal: controller.signal,
      }

      if (data) {
        if (data instanceof FormData) {
          // Remove Content-Type for FormData to let browser set it with boundary
          delete headers["Content-Type"]
          config.body = data
        } else {
          config.body = JSON.stringify(data)
        }
      }

      const response = await fetch(url, config)
      clearTimeout(timeoutId)

      const responseData = await response.json()

      if (!response.ok) {
        throw {
          message: responseData.message || "Request failed",
          status: response.status,
          errors: responseData.errors,
        } as ApiError
      }

      return responseData as ApiResponse<T>
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw {
            message: "Request timeout",
            status: 408,
          } as ApiError
        }

        throw {
          message: error.message || "Network error",
          status: 0,
        } as ApiError
      }

      throw error
    }
  }

  // HTTP Methods
    async get<T>(
        endpoint: string,
        params?: OrderListParams,
        headers?: Record<string, string>,
    ): Promise<ApiResponse<T>> {
        return this.request<T>("GET", endpoint, { params: toQueryParams(params), headers })
    }


    async post<T>(
    endpoint: string,
    data?: any,
    options?: { params?: Record<string, string | number>; headers?: Record<string, string> },
  ): Promise<ApiResponse<T>> {
    return this.request<T>("POST", endpoint, { data, ...options })
  }

  async put<T>(
    endpoint: string,
    data?: any,
    options?: { params?: Record<string, string | number>; headers?: Record<string, string> },
  ): Promise<ApiResponse<T>> {
    return this.request<T>("PUT", endpoint, { data, ...options })
  }

  async patch<T>(
    endpoint: string,
    data?: any,
    options?: { params?: Record<string, string | number>; headers?: Record<string, string> },
  ): Promise<ApiResponse<T>> {
    return this.request<T>("PATCH", endpoint, { data, ...options })
  }

  async delete<T>(
    endpoint: string,
    params?: Record<string, string | number>,
    headers?: Record<string, string>,
  ): Promise<ApiResponse<T>> {
    return this.request<T>("DELETE", endpoint, { params, headers })
  }

  // File upload helper
  async uploadFile<T>(endpoint: string, file: File, additionalData?: Record<string, any>): Promise<ApiResponse<T>> {
    const formData = new FormData()
    formData.append("file", file)

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value))
      })
    }

    return this.post<T>(endpoint, formData)
  }

  // Multiple files upload helper
  async uploadFiles<T>(endpoint: string, files: File[], additionalData?: Record<string, any>): Promise<ApiResponse<T>> {
    const formData = new FormData()

    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file)
    })

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value))
      })
    }

    return this.post<T>(endpoint, formData)
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

