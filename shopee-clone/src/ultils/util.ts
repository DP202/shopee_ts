// Xử lý các lỗi -> không phải 422 của đăng ký
// Check lỗi có chính xác không

import axios, { AxiosError } from 'axios'
import HttpStatusCode from '../constant/httpStatusCode.enum'

export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  return axios.isAxiosError(error)
}

// check 1 function có phải là axios error 422 ko
// UnprocessableEntity -> là lỗi 422
export function isAxiosUnprocessableEntityError<FormError>(error: unknown): error is AxiosError<FormError> {
  return isAxiosError(error) ? error?.response?.status === HttpStatusCode.UnprocessableEntity : false
}

export function formatCurrency(currency: number) {
  return new Intl.NumberFormat('de-DE').format(currency)
}

export function formatNumberToSocialStyle(value: number) {
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1
  })
    .format(value)
    .replace(',', '.')
    .toUpperCase()
}

// tạo function tính % giảm giá
// round 4.4 -> 4 , 4.5 -> 5
export const rateSale = (original: number, sale: number): string => {
  if (original === 0) return '0%'
  return Math.round(((original - sale) / original) * 100) + '%'
}
