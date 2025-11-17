import type { User } from '../types/user.type'

//Lưu access_token vào localStorage
export const setAccesTokenLocalStorage = (access_token: string) => {
  localStorage.setItem('access_token', access_token)
}

// Xóa access_token vào localStorage
export const clearLocalStorage = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('profile')
}

// → **Lấy** access_token, nếu không có thì trả về chuỗi rỗng
export const getAccessTokenFromLS = () => localStorage.getItem('access_token') || ''

export const getProfileLocalStorage = () => {
  const result = localStorage.getItem('profile')
  return result ? JSON.parse(result) : null
}

export const setProfileLocalStorage = (profile: User) => {
  // Bởi vì profile này là 1 biến object -> nên cần JSON.stringify
  localStorage.setItem('profile', JSON.stringify(profile))
}
