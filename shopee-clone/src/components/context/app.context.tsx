import { createContext, useState } from 'react'
import { getAccessTokenFromLS, getProfileLocalStorage } from '../../ultils/auth'
import type { User } from '../../types/user.type'

interface AppContextInterface {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  profile: User | null
  setProfile: React.Dispatch<React.SetStateAction<User | null>>
}

const initialAppContext: AppContextInterface = {
  // Giá trị ban đầu
  isAuthenticated: Boolean(getAccessTokenFromLS()), // Nếu mà có token thì là true
  setIsAuthenticated: () => null, // nó ko thực hiện gì cả
  profile: getProfileLocalStorage(),
  setProfile: () => null
}

// Bước 1 : tạo context -> createContext
export const AppContext = createContext<AppContextInterface>(initialAppContext)

// Tạo Provider
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAppContext.isAuthenticated)
  const [profile, setProfile] = useState<User | null>(initialAppContext.profile)

  // Tiếp theo
  return (
    <AppContext.Provider value={{ isAuthenticated, setIsAuthenticated, profile, setProfile }}>
      {children}
    </AppContext.Provider>
  )
}
