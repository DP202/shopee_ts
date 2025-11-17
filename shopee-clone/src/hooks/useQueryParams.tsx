import React from 'react'
import { useSearchParams } from 'react-router-dom'

// Hook này dùng để lấy param
export default function useQueryParams() {
  const [searchParams] = useSearchParams()
  return Object.fromEntries([...searchParams]) // Object.fromEntries chuyển các [key,value] thành object thường
}
