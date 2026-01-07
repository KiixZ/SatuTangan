import api from './api'

export interface RegisterData {
  fullName: string
  email: string
  phoneNumber: string
  password: string
}

export interface LoginData {
  email: string
  password: string
}

export interface User {
  id: string
  email: string
  fullName: string
  phoneNumber: string
  role: 'DONOR' | 'CREATOR' | 'ADMIN'
  isEmailVerified: boolean
}

export interface AuthResponse {
  success: boolean
  data: {
    user: User
    accessToken: string
  }
}

class AuthService {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data)
    return response.data
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', {
      email,
      password,
    })

    // Store token and user info
    if (response.data.success) {
      localStorage.setItem('accessToken', response.data.data.accessToken)
      localStorage.setItem('user', JSON.stringify(response.data.data.user))
    }

    return response.data
  }

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout')
    } finally {
      // Always clear local storage even if API call fails
      localStorage.removeItem('accessToken')
      localStorage.removeItem('user')
    }
  }

  async verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
    const response = await api.post(`/auth/verify-email/${token}`)
    return response.data
  }

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    const response = await api.post('/auth/forgot-password', { email })
    return response.data
  }

  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await api.post(`/auth/reset-password/${token}`, {
      password: newPassword,
    })
    return response.data
  }

  async getMe(): Promise<User> {
    const response = await api.get<{ success: boolean; data: User }>('/auth/me')
    return response.data.data
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user')
    if (!userStr) return null

    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken')
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken()
  }
}

export const authService = new AuthService()
export default authService
