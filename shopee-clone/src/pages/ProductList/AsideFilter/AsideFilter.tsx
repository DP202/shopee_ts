import React from 'react'
import { createSearchParams, Link, useNavigate } from 'react-router-dom'
import path from '../../../constant/path'
import Input from '../../../components/Input'
import Button from '../../../components/Button'

import type { Category } from '../../../types/category.type'
import classNames from 'classnames'
import InputNumber from '../../../components/InputNumber'
import { useForm, Controller } from 'react-hook-form'
import { schema, type Schema } from '../../../ultils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import type { NoUndefinedField } from '../../../types/util.type'
import RatingStars from '../../../components/RatingStars'
import { omit } from 'lodash'
import type { QueryConfig } from '../../../hooks/useQueryConfig'

interface Props {
  queryConfig: QueryConfig
  categories: Category[]
}

// type FormData = {
//   price_min: string
//   price_max: string
// }
type FormData = NoUndefinedField<Pick<Schema, 'price_max' | 'price_min'>>

const priceShema = schema.pick(['price_min', 'price_max']) // pick là chọn ra

export default function AsideFilter({ queryConfig, categories }: Props) {
  const { category } = queryConfig // lấy category trên cái url
  // console.log('category : ', category)
  // console.log('categories : ', categories)

  const {
    control,
    handleSubmit,
    watch,
    trigger,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      price_min: '',
      price_max: ''
    },
    resolver: yupResolver(priceShema)
  })
  const valueForm = watch()

  const navigate = useNavigate()

  // console.log('valueForm : ', valueForm)
  // console.log('errors : ', errors)

  const onSubmit = handleSubmit((data) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        price_max: data.price_max,
        price_min: data.price_min
      }).toString()
    })
  })

  const deleteAll = () => {
    const { price_min, price_max, rating_filter, category, ...rest } = queryConfig

    navigate({
      pathname: path.home,
      search: createSearchParams(rest).toString()
    })
  }

  return (
    <div className='py-4 '>
      <Link
        to={path.home}
        className={classNames('flex items-center font-bold', {
          'text-orange-500': !category
        })}
      >
        <svg viewBox='0 0 12 10' className='w-3 h-4 mr-3 fill-current'>
          <g fill-rule='evenodd' stroke='none' stroke-width='1'>
            <g transform='translate(-373 -208)'>
              <g transform='translate(155 191)'>
                <g transform='translate(218 17)'>
                  <path d='m0 2h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z'></path>
                  <path d='m0 6h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z'></path>
                  <path d='m0 10h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z'></path>
                </g>
              </g>
            </g>
          </g>
        </svg>
        Tất cả danh mục
      </Link>
      <div className='bg-gray-300 h-[1px] my-4'></div>
      <ul>
        {categories.map((categoryItem) => {
          const isActive = category === categoryItem._id

          return (
            <li className='py-2 pl-2' key={categoryItem._id}>
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    category: categoryItem._id
                  }).toString()
                }}
                className={classNames({
                  'text-orange-500 font-semibold': isActive
                })}
              >
                {isActive && (
                  <svg viewBox='0 0 4 7' className='fill-orange-500 h-2 w-2 absolute top-1 left-[-10px]'>
                    <polygon points='4 3.5 0 0 0 7'></polygon>
                  </svg>
                )}
                {categoryItem.name}
              </Link>
            </li>
          )
        })}
      </ul>

      {/* Bộ lọc */}

      <Link to={path.home} className='flex items-center font-bold mt-4 uppercase'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='size-4 mr-3'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z'
          />
        </svg>
        Bộ lọc tìm kiếm
      </Link>

      <div className='bg-gray-300 h-[1px] my-4'></div>

      {/* Giá */}

      <div className='my-5'>
        <div>Khoảng giá</div>
        <form className='mt-2' onSubmit={onSubmit}>
          <div className='flex items-start'>
            <Controller
              control={control}
              name='price_min'
              render={({ field }) => {
                // field -> nó có onChange
                return (
                  <InputNumber
                    type='text'
                    className='grow'
                    classNameError='hidden'
                    name='from'
                    placeholder='đ TỪ'
                    classNameInput='p-1 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                    onChange={(event) => {
                      // ép nó validate
                      // trigger thì nó làm cho form nó validate lại
                      field.onChange(event)
                      trigger('price_max')
                    }}
                    value={field.value}
                    ref={field.ref}
                  />
                )
              }}
            />

            <div className='mx-2 mt-2 shrink-0 '>-</div>

            <Controller
              control={control}
              name='price_max'
              render={({ field }) => {
                return (
                  <InputNumber
                    type='text'
                    className='grow'
                    classNameError='hidden'
                    name='from'
                    placeholder='đ ĐẾN'
                    classNameInput='p-1 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                    onChange={(event) => {
                      // ép nó validate
                      // trigger thì nó làm cho form nó validate lại
                      field.onChange(event)
                      trigger('price_min')
                    }}
                    value={field.value}
                    ref={field.ref}
                  />
                )
              }}
            />
          </div>

          <div className='mt-1 text-red-600 min-h-[1.25rem] text-sm text-center'>{errors.price_min?.message}</div>

          <Button className='cursor-pointer w-full p-2 uppercase bg-orange-600 text-white text-sm hover:bg-orange/80 flex justify-center items-center'>
            Áp dụng
          </Button>
        </form>
      </div>

      <div className='bg-gray-300 h-[1px] my-4'></div>
      <div className='text-sm'>Đánh giá</div>
      <RatingStars queryConfig={queryConfig} />

      <div className='bg-gray-300 h-[1px] my-4'></div>
      <Button
        onClick={deleteAll}
        className='cursor-pointer w-full py-2 ppx-2 uppercase bg-orange-600 text-white text-sm'
      >
        Xóa tất cả
      </Button>
    </div>
  )
}
