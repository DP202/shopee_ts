import React from 'react'
import { Link } from 'react-router-dom'
import type { Product as ProductType } from '../../../types/product.type'
import { formatCurrency, formatNumberToSocialStyle } from '../../../ultils/util'
import ProductRating from '../../../components/ProductRaiting'
import path from '../../../constant/path'

interface Props {
  product: ProductType
}

function ProductItem({ product }: Props) {
  return (
    <Link to={`${path.home}${product._id}`}>
      <div
        className='bg-white shadow rounded-sm hover:translate-y-[-0.0.04rem] hover:shadow-md duration-100
      transition-transform overflow-hidden
      '
      >
        <div className='w-full pt-[100%] relative'>
          <img
            className='absolute top-0 left-0 bg-white w-full h-full object-cover'
            src={product.image}
            alt={product.name}
          />
        </div>
        <div className='p-2 overflow-hidden'>
          <div className='min-h-[2rem] line-clamp-2 text-xs '>{product.name}</div>
          <div className='flex items-center mt-3'>
            <div className='line-through max-w-[50%] text-gray-500 truncate'>
              <span className='text-xs'>đ</span>
              <span className='text-sm'>{formatCurrency(product.price_before_discount)}</span>
            </div>
            <div className='text-orange-500 truncate ml-1'>
              <span className='text-xs'>đ</span>
              <span className='text-sm'>{formatCurrency(product.price)}</span>
            </div>
          </div>

          {/* Raiting */}
          <div className='mt-3 flex items-center justify-end'>
            {/* Ngôi sao */}
            <ProductRating rating={product.rating} />
            <div className='ml-2 text-sm'>
              <span>{formatNumberToSocialStyle(product.sold)}</span>
              <span className='ml-1'>Đã bán</span>
              <span className='ml-1'>Đã bán</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductItem
