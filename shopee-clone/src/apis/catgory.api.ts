import type { Category } from '../types/category.type'
import type { SuccessResponse } from '../types/util.type'
import http from '../ultils/http'

const URL = 'categories'
const CategoryApi = {
  getCategories() {
    return http.get<SuccessResponse<Category>>(URL)
  }
}

export default CategoryApi
