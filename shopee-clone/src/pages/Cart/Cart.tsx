import { useMutation, useQuery } from '@tanstack/react-query'
import purchaseApi from '../../apis/purchase.api'
import { purchaseStatus } from '../../constant/purchase'
import { Link } from 'react-router-dom'
import { formatCurrency } from '../../ultils/util'
import QuantityController from '../../components/QuantityController'
import React, { useEffect, useState } from 'react'
import type { Purchase } from '../../types/purchase.type'
import { produce } from 'immer'
import { keyBy } from 'lodash'

interface ExtendedPurchase extends Purchase {
  disable: boolean
  checked: boolean
}

function Cart() {
  // Tạo state cho cart  -> state mở rộng
  const [extendedPurchases, setExtendedPurchases] = useState<ExtendedPurchase[]>([])

  const { data: purchasesIncartData, refetch } = useQuery({
    queryKey: ['purchases', { status: purchaseStatus.inCart }],
    queryFn: () => purchaseApi.getPurchases({ status: purchaseStatus.inCart })
  })

  const updatePurchaseMutation = useMutation({
    mutationFn: purchaseApi.updatePurchase,
    onSuccess: () => {
      // Có nghĩa là khi gọi api update thành công thì cho thằng getPurchase này nó gọi lại
      // để có thể reset cái checked và disable
      refetch()
    }
  })

  const purchasesIncart = purchasesIncartData?.data.data
  // Tạo 1 biến chọn tất cả
  // every là hàm kiểm tra tất cả các phần tử trong mảng có thỏa mảng điều kiện hay không
  const isAllChecked = extendedPurchases.every((purchase) => purchase.checked) // nếu có 1 item bị false thì cả cái này dừng lại

  // Khi vừa vào trang cart thì useQuery nó gọi api xong
  // thì chúng ta set vào state -> useEffect
  useEffect(() => {
    setExtendedPurchases((prev) => {
      const extendedPurchasesObject = keyBy(prev, '_id')
      console.log('extendedPurchasesObject : ', extendedPurchasesObject)
      return (
        purchasesIncart?.map((purchase) => ({
          ...purchase,
          disable: false,
          checked: Boolean(extendedPurchasesObject[purchase._id]?.checked)
          // nghĩa là keyBy nó giúp ta tìm được là vị trí nào đang checked
        })) || []
      )
    })
  }, [purchasesIncart])

  const handleChecked = (purchaseIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    // Cách 1: Dùng map để tìm đúng thèn index -> sau đó change cái checked
    // Cách 2: Sử dụng thư viên immer để xử lý onChange
    // Cách nhanh nhất để change cái state extendedPurchases mà không cần phải dùng map để tìm index
    // => reduce của immer

    // produce nó có 1 cái callback
    setExtendedPurchases(
      produce((draft) => {
        // draft đại diện cho extendedPurchasesPrev
        // lấy thằng purchaseIndex -> thay đổi thằng checked
        draft[purchaseIndex].checked = event.target.checked
      })
    )
  }

  // const handleChecked = (productIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setExtendedPurchases((prev) =>
  //     produce(prev, (draft) => {
  //       const purchase = draft[productIndex]
  //       if (purchase) {
  //         purchase.checked = event.target.checked
  //       }  //     })
  //   )
  // }

  const handleCheckAll = () => {
    setExtendedPurchases(
      // chọn tất cả
      (prev) =>
        prev.map((purchase) => ({
          ...purchase,
          checked: !isAllChecked
        }))
    )
  }

  const handleQuantity = (purchaseIndex: number, value: number, enable: boolean) => {
    if (enable) {
      // purchaseIndex : để biết được là đang ấn vào + hay - -> dựa vào index
      const purchase = extendedPurchases[purchaseIndex] // lấy ra được cái purchase
      // khi tăng giảm thì có cái value
      setExtendedPurchases(
        produce((draft) => {
          draft[purchaseIndex].disable = true //disable cái thằng input không cho ng dùng tăng bởi vì nó đang gọi api
        })
      )
      updatePurchaseMutation.mutate({ product_id: purchase.product._id, buy_count: value })
    }
  }

  const handleTypeQuantity = (purchaseIndex: number) => (value: number) => {
    // value này là từ onType && onType(_value)
    setExtendedPurchases(
      produce((draft) => {
        draft[purchaseIndex].buy_count = value
      })
    )
  }

  return (
    <div className='bg-neutral-100 py-16'>
      <div className='container mx-auto'>
        <div className='overflow-auto'>
          <div className='min-w-[1000px]'>
            <div className='grid grid-cols-12 rounded-sm bg-white py-5 px-9 capitalize text-gray-500 shadow'>
              <div className='col-span-6 '>
                <div className='flex items-center'>
                  <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                    <input type='checkbox' className='h-5 w-5' checked={isAllChecked} onChange={handleCheckAll} />
                  </div>
                  <div className='flex-grow text-black'>Sản phẩm</div>
                </div>
              </div>
              <div className='col-span-6'>
                <div className='grid grid-cols-5 text-center items-center'>
                  <div className='col-span-2'>Đơn giá</div>
                  <div className='col-span-1'>Số lượng</div>
                  <div className='col-span-1'>Số tiền</div>
                  <div className='col-span-1'>Thao tác</div>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className='my-3 rounded-sm bg-white p-5 shadow'>
              {extendedPurchases?.map((purchaseItem, index) => {
                return (
                  <div
                    key={purchaseItem.id}
                    className='first:mt-0 mb-5 grid grid-cols-12 text-center rounded-sm border border-gray-200 bg-white py-5 px-5 text-sm text-gray-500'
                  >
                    <div className='col-span-6'>
                      <div className='flex'>
                        <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                          <input
                            type='checkbox'
                            className='h-5 w-5'
                            checked={purchaseItem.checked}
                            onChange={handleChecked(index)}

                            // Mỗi lần onChange thì phải biết được vị trí item index đó nó ở vị trí nào
                            // để ta còn set lại cái state của index đó => function phải nhận vào 1 cái index
                          />
                        </div>
                        <div className='flex-grow '>
                          <div className='flex'>
                            <Link className='h-20 w-20 flex-shrink-0' to={`/product/${purchaseItem.product._id}`}>
                              <img alt={purchaseItem.product.name} src={purchaseItem.product.image} />
                            </Link>
                            <div className='flex-grow px-5 pt-1 pb-2'>
                              <Link to={`/product/${purchaseItem.product._id}`} className='ext-left line-clamp-2'>
                                {purchaseItem.product.name}
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className='col-span-6 mt-5'>
                      <div className='grid grid-cols-5 items-center text-center'>
                        {/* 1. ĐƠN GIÁ */}
                        <div className='col-span-2'>
                          <div className='flex items-center justify-center gap-3'>
                            <span className='text-gray-400 line-through text-[15px]'>
                              đ{formatCurrency(purchaseItem.product.price_before_discount)}
                            </span>
                            <span className='text-[17px] font-medium text-black'>
                              đ{formatCurrency(purchaseItem.product.price)}
                            </span>
                          </div>
                        </div>
                        {/* 2. SỐ LƯỢNG */}
                        <div className='col-span-1'>
                          <QuantityController
                            value={purchaseItem.buy_count}
                            max={purchaseItem.product.quantity}
                            classNameWrapper='flex items-center'
                            onIncrease={(value) => handleQuantity(index, value, value <= purchaseItem.product.quantity)}
                            onDecrease={(value) => handleQuantity(index, value, value >= 1)}
                            onFocusOut={(value) => {
                              handleQuantity(
                                index,
                                value,
                                value >= 1 &&
                                  value <= purchaseItem.product.quantity &&
                                  value !== (purchasesIncart as Purchase[])[index].buy_count
                              )
                            }}
                            onType={handleTypeQuantity(index)}
                            disabled={purchaseItem.disable}
                          />
                        </div>
                        {/* 3. SỐ TIỀN */}
                        <div className='col-span-1'>
                          <span className='text-orange-500 text-[17px]'>
                            đ{formatCurrency(purchaseItem.product.price * purchaseItem.buy_count)}
                          </span>
                        </div>
                        {/* 4. THAO TÁC */}
                        <div className='col-span-1 cursor-pointer'>
                          <button className='text-black transition-colors hover:text-orange-500 cursor-pointer'>
                            Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        {/* FOOTER - TỔNG TIỀN */}
        <div
          className='sticky bottom-0 z-10 mt-8 flex sm:items-center rounded-sm bg-white p-5 shadow border border-gray-100
        flex-col sm:flex-row
        '
        >
          {/* Chọn tất cả */}

          <div className='flex items-center'>
            <div className='flex items-center'>
              <input
                type='checkbox'
                className='h-5 w-5 accent-orange'
                checked={isAllChecked}
                onChange={handleCheckAll}
              />
              <button className='ml-3 text-gray-700' onClick={handleCheckAll}>
                Chọn tất cả({extendedPurchases.length}){' '}
              </button>
              <button className='mx-5 text-gray-600 hover:text-orange-500 transition'>Xóa</button>
            </div>
          </div>

          {/* Tổng tiền - đẩy sang phải */}
          <div className='ml-auto flex items-center'>
            <div className='text-right'>
              <div className='flex items-center justify-end'>
                <span className='text-gray-600'>Tổng thanh toán (0 sản phẩm):</span>
                <span className='ml-4 text-2xl text-orange-500'>
                  đ{formatCurrency(0)} {/* Sau này thay bằng tổng thực tế */}
                </span>
              </div>
              <div className='mt-1 text-sm'>
                <span className='text-gray-500'>Tiết kiệm</span>
                <span className='ml-4 text-orange-500'>đ111</span>
              </div>
            </div>

            {/* Nút mua hàng */}
            <button className='ml-8 rounded-sm bg-orange-500 px-10 py-3 text-white hover:bg-orange-600 transition uppercase font-medium'>
              Mua hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
