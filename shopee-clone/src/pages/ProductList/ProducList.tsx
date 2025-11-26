import AsideFilter from './AsideFilter'
import SortProductList from './SortProductList'
import ProductItem from './ProductItem'
import { useQuery } from '@tanstack/react-query'
import productApi from '../../apis/product.api'
import Pagination from '../../components/Pagination'
import CategoryApi from '../../apis/catgory.api'

import useQueryConfig from '../../hooks/useQueryConfig'
import type { ProductListConfig } from '../../types/product.type'

function ProductList() {
  const queryConfig = useQueryConfig()

  const { data: productData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => productApi.getProducts(queryConfig as ProductListConfig),
    placeholderData: (previousData) => previousData
  })

  // console.log('queryConfig : ', queryConfig)

  // gọi api lấy danh mục
  const { data: categoryData } = useQuery({
    queryKey: ['categories'], // lp cần truyền queryConfig vì nó truyền chỉ 1 lần
    queryFn: () => CategoryApi.getCategories()
  })

  return (
    <div className='bg-gray-200 py-6'>
      <div className='container mx-auto'>
        {productData && (
          <div className='grid grid-cols-12 gap-6'>
            <div className='col-span-3'>
              <AsideFilter queryConfig={queryConfig} categories={categoryData?.data.data || []} />
            </div>
            <div className='col-span-9'>
              <SortProductList queryConfig={queryConfig} pageSize={productData?.data.data.pagination.page_size} />
              <div className='mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3'>
                {productData?.data.data.products.map((product) => (
                  <div className='col-span-1' key={product.id}>
                    <ProductItem product={product} />
                  </div>
                ))}
              </div>

              <Pagination queryConfig={queryConfig} pageSize={productData?.data.data.pagination.page_size} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductList
