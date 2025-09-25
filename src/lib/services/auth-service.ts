import { apiClient, type ApiResponse } from "../api-client"
import { API_CONFIG } from "../api-config"
import type { User, LoginRequest, RegisterRequest } from "../api-types"

export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
  expiresIn: number
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordResetConfirmRequest {
  token: string
  password: string
  confirmPassword: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface UpdateProfileRequest {
  firstName?: string
  lastName?: string
  phone?: string
  avatar?: File
}

export interface EmailVerificationRequest {
  token: string
}

class AuthService {
  // Login user
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<AuthResponse>(API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials)

    if (response.success && response.data) {
      // Store auth token
      apiClient.setAuthToken(response.data.token, credentials.remember || false)
    }

    return response
  }

  // Register new user
  async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<AuthResponse>(API_CONFIG.ENDPOINTS.AUTH.REGISTER, userData)

    if (response.success && response.data) {
      // Store auth token
      apiClient.setAuthToken(response.data.token, false)
    }

    return response
  }

  // Logout user
  async logout(): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.post<void>(API_CONFIG.ENDPOINTS.AUTH.LOGOUT)
      return response
    } finally {
      // Always remove token from storage
      apiClient.removeAuthToken()
    }
  }

  // Refresh auth token
  async refreshToken(): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<AuthResponse>(API_CONFIG.ENDPOINTS.AUTH.REFRESH)

    if (response.success && response.data) {
      // Update stored token
      apiClient.setAuthToken(response.data.token, true)
    }

    return response
  }

  // Get current user profile
  async getProfile(): Promise<ApiResponse<User>> {
    return apiClient.get<User>(API_CONFIG.ENDPOINTS.AUTH.PROFILE)
  }

  // Update user profile
  async updateProfile(data: UpdateProfileRequest): Promise<ApiResponse<User>> {
    if (data.avatar) {
      // Handle file upload separately
      const formData = new FormData()
      formData.append("avatar", data.avatar)

      // Add other fields
      Object.entries(data).forEach(([key, value]) => {
        if (key !== "avatar" && value !== undefined) {
          formData.append(key, String(value))
        }
      })

      return apiClient.post<User>(API_CONFIG.ENDPOINTS.AUTH.PROFILE, formData)
    }

    return apiClient.put<User>(API_CONFIG.ENDPOINTS.AUTH.PROFILE, data)
  }

  // Send password reset email
  async forgotPassword(data: PasswordResetRequest): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>(API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD, data)
  }

  // Reset password with token
  async resetPassword(data: PasswordResetConfirmRequest): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>(API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD, data)
  }

  // Change password (authenticated user)
  async changePassword(data: ChangePasswordRequest): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>(API_CONFIG.ENDPOINTS.AUTH.PROFILE + "/change-password", data)
  }

  // Verify email address
  async verifyEmail(data: EmailVerificationRequest): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>(API_CONFIG.ENDPOINTS.AUTH.VERIFY_EMAIL, data)
  }

  // Resend email verification
  async resendEmailVerification(): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>(API_CONFIG.ENDPOINTS.AUTH.VERIFY_EMAIL + "/resend")
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return apiClient.getAuthToken() !== null
  }

  // Get stored auth token
  getAuthToken(): string | null {
    return apiClient.getAuthToken()
  }

  // Manually set auth token
  setAuthToken(token: string, remember = false): void {
    apiClient.setAuthToken(token, remember)
  }

  // Remove auth token
  removeAuthToken(): void {
    apiClient.removeAuthToken()
  }
}

// Export singleton instance
export const authService = new AuthService()
