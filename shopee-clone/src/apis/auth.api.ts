import type { AuthResponse } from '../types/auth.type'
import http from '../ultils/http'

// export const registerAccount = (body: { email: string; password: string }) => http.post<AuthResponse>('/register', body)

// export const loginAccount = (body: { email: string; password: string }) => http.post<AuthResponse>('/login', body)

// export const logout = () => http.post('/logout')

// Có thể viết như dưới đây

const authApi = {
  registerAccount(body: { email: string; password: string }) {
    return http.post<AuthResponse>('/register', body)
  },

  login(body: { email: string; password: string }) {
    return http.post<AuthResponse>('/login', body)
  },

  logout() {
    return http.post('/logout')
  }
}

export default authApi
