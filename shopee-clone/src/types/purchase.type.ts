// cho kiểu trả về

import type { Product } from './product.type'

export type PurchaseStatus = -1 | 1 | 2 | 3 | 4 | 5

export type PurchaseListStatus = PurchaseStatus | 0 // list -> có status là 0

export interface Purchase {
  _id: string
  buy_count: number
  price: number
  price_before_discount: number
  status: PurchaseStatus // mỗi purchases có mỗi status riêng
  user: string
  product: Product
  createdAt: string
  updatedAt: string
}
