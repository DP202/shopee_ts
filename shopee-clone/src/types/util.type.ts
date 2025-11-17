// Những interface tiện ích

export interface SuccessResponse<Data> {
  message: string
  data: Data
}

export interface ErrorResponse<Data> {
  message: string
  data?: Data
}

// cú pháp -? : loại bỏ key optional(vd: handle?:)
export type NoUndefinedField<T> = {
  [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>>
}
