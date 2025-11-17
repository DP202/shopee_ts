import classNames from 'classnames'
import { sortBy, order as orderConstant } from '../../../constant/product'

import type { ProductListConfig } from '../../../types/product.type'
import type { QueryConfig } from '../ProducList'
import { createSearchParams, Link, useNavigate } from 'react-router-dom'
import path from '../../../constant/path'
import { omit } from 'lodash'

interface Props {
  queryConfig: QueryConfig
  pageSize: number
}

const SortProductList = ({ queryConfig, pageSize }: Props) => {
  const page = Number(queryConfig.page)

  // Dựa vào queryConfig truyền vào  để biết được button nó có đang active -> lấy sort
  // console.log('queryConfig : ', queryConfig)
  const { sort_by = sortBy.createdAt, order } = queryConfig
  const navigate = useNavigate()

  // Tạo 1 function check active và bán chạy
  const isActiveSortBy = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
    return sort_by === sortByValue
  }

  const handleSort = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
    navigate({
      pathname: path.home,
      search: createSearchParams(
        omit(
          {
            ...queryConfig,
            sort_by: sortByValue
          },
          ['order']
        )
      ).toString()
    })
  }

  const handlePriceOrderChange = (orderValue: Exclude<ProductListConfig['order'], undefined>) => {
    navigate({
      // orderValue chứa asc và desc
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        sort_by: sortBy.price, // sort theo giá
        order: orderValue
      }).toString()
    })
  }

  return (
    <div className='bg-gray-300/40 py-4 px-3 '>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div className='flex items-center flex-wrap gap-2'>
          <div>Sắp xếp theo</div>
          <button
            className={classNames('cursor-pointer h-8 px-4 text-center text-sm capitalize ', {
              'bg-orange-500 text-black  hover:bg-orange/80': isActiveSortBy(sortBy.view),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.view)
            })}
            onClick={() => handleSort(sortBy.view)}
          >
            Phổ biến
          </button>

          <button
            className={classNames('cursor-pointer h-8 px-4 text-center text-sm capitalize ', {
              'bg-orange-500 text-black  hover:bg-orange/80': isActiveSortBy(sortBy.createdAt),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.createdAt)
            })}
            onClick={() => handleSort(sortBy.createdAt)}
          >
            Mới nhất
          </button>

          <button
            className={classNames('cursor-pointer h-8 px-4 text-center text-sm capitalize ', {
              'bg-orange-500 text-black  hover:bg-orange/80': isActiveSortBy(sortBy.sold),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.sold)
            })}
            onClick={() => handleSort(sortBy.sold)}
          >
            Bán chạy
          </button>

          <select
            className={classNames('outline-none h-8 px-4 capitalize  text-sm text-left', {
              'bg-white text-black  hover:bg-orange/80': isActiveSortBy(sortBy.price),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.price)
            })}
            value={order || ''}
            onChange={(e) => handlePriceOrderChange(e.target.value as 'asc' | 'desc')}
          >
            <option value='' disabled>
              Giá
            </option>
            <option value={orderConstant.asc}>Giá thấp đến cao</option>
            <option value={orderConstant.desc}>Giá cao đến thấp</option>
          </select>
        </div>

        {/* Phân trang */}
        <div className='flex items-center'>
          <div>
            <span className='text-orange-500'>{page}</span>
            <span>/{pageSize}</span>
          </div>
          <div className='ml-2 flex'>
            {page === 1 ? (
              <span className='flex h-8 w-9 cursor-not-allowed items-center justify-center rounded-tl-sm rounded-bl-sm bg-white/60  shadow hover:bg-slate-100'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-3 w-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
                </svg>
              </span>
            ) : (
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    page: (page - 1).toString()
                  }).toString()
                }}
                className='flex h-8 w-9  items-center justify-center rounded-tl-sm rounded-bl-sm bg-white  shadow hover:bg-slate-100'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-3 w-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
                </svg>
              </Link>
            )}

            {page === pageSize ? (
              <span className='flex h-8 w-9 cursor-not-allowed items-center justify-center rounded-tl-sm rounded-bl-sm bg-white/60  shadow hover:bg-slate-100'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-3 w-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
                </svg>
              </span>
            ) : (
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    page: (page + 1).toString()
                  }).toString()
                }}
                className='flex h-8 w-9  items-center justify-center rounded-tl-sm rounded-bl-sm bg-white  shadow hover:bg-slate-100'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-3 w-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SortProductList
