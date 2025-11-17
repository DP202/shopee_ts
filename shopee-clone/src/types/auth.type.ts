import type { User } from './user.type'
import type { SuccessResponse } from './util.type'

export type AuthResponse = SuccessResponse<{
  access_token: string
  expires: string
  user: User
}>
