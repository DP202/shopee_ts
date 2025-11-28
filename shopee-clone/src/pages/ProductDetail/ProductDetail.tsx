import { useMutation, useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import productApi from '../../apis/product.api'
import ProductRating from '../../components/ProductRaiting'
import { formatCurrency, formatNumberToSocialStyle, rateSale } from '../../ultils/util'
import DOMPurify from 'dompurify'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { Product } from '../../types/product.type'
import QuantityController from '../../components/QuantityController'
import purchaseApi from '../../apis/purchase.api'

import { purchaseStatus } from '../../constant/purchase'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

function ProductDetail() {
  const [buyCount, setBuyCount] = useState(1)
  const { id } = useParams()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: productDetailData } = useQuery({
    queryKey: ['productDetail', id],
    queryFn: () => productApi.getProductDetail(id as string)
  })
  const queryClient = useQueryClient()
  const product = productDetailData?.data.data
  //   console.log('Data productDetail :', product)

  // Cart
  const addToCartMutation = useMutation({
    mutationFn: purchaseApi.addToCart
  })

  // Làm zoom
  const imageRef = useRef<HTMLImageElement>(null)

  const [currentIndexImages, setCurrentIndexImages] = useState([0, 5])
  const [activeImage, setActiveImage] = useState('')
  const currentImages = useMemo(
    // dùng useMemo để hạn chế tính toán
    // currentImages -> cho cái slide
    () => (product ? product.images.slice(...currentIndexImages) : []),
    [product, currentIndexImages]
  )

  useEffect(() => {
    // nếu mà có api thì -> cho activeImage chính là cái thằng image đầu tiên
    if (product && product.images.length > 0) {
      setActiveImage(product.images[0])
    }
  }, [product])

  const nextSlide = () => {
    if (currentIndexImages[1] < (product as Product).image.length) {
      setCurrentIndexImages((prev) => [prev[0] + 1, prev[1] + 1]) // khi next thì index [0,5] -> [1.6]
    }
  }

  const prevSlide = () => {
    if (currentIndexImages[0] > 0) {
      // lớn hơn 0 mới lui ảnh được
      setCurrentIndexImages((prev) => [prev[0] - 1, prev[1] - 1])
    }
  }

  const chooseActive = (img: string) => {
    setActiveImage(img)
  }

  const handleZoom = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // Lấy thông số của thẻ div (thẻ chứa) -> là thẻ div chứa hình zoom => getBoundingClientRect
    const rect = event.currentTarget.getBoundingClientRect()
    // console.log('rect : ', rect)

    const image = imageRef.current as HTMLImageElement
    // Lấy giá trị mặc định của bức hình (naturalHeight,naturalWidth)
    const { naturalHeight, naturalWidth } = image

    const { offsetX, offsetY } = event.nativeEvent
    // console.log('offsetX : ', offsetX, '  offsetY : ', offsetY)
    const top = offsetY * (1 - naturalHeight / rect.height)
    const left = offsetX * (1 - naturalWidth / rect.width)

    image.style.width = naturalWidth + 'px'
    image.style.height = naturalHeight + 'px'
    //reset max width khi hover vào để nó to ra
    image.style.maxWidth = 'unset'
    // Di chuyển position dễ nhìn
    // offsetY,offsetX : vị trí x,y con trỏ chuột trong element
    image.style.top = top + 'px'
    image.style.left = left + 'px'
  }

  const resetZoom = () => {
    imageRef.current?.removeAttribute('style')
  }

  const handleByCount = (value: number) => {
    setBuyCount(value)
  }

  const addToCart = () => {
    addToCartMutation.mutate(
      { buy_count: buyCount, product_id: product?._id as string },
      {
        // khi mà add thành công thì tham số thứ 2
        onSuccess: () => {
          toast.success('Thêm sản phẩm vào giỏ hàng thành công')
          queryClient.invalidateQueries({
            queryKey: ['purchases', { status: purchaseStatus.inCart }] // muốn invalidate cái purchases
          })
        }
      }
    )
  }

  if (!product) return null
  return (
    <div className='bg-gray-200 py-6'>
      <div className='container mx-auto'>
        <div className='bg-white p-4 shadow'>
          <div className='grid grid-cols-12 gap-9'>
            <div className='col-span-5'>
              <div
                className='relative w-full pt-[100%] shadow overflow-hidden cursor-zoom-in'
                onMouseMove={handleZoom}
                onMouseLeave={resetZoom}
              >
                <img
                  className='absolute top-0 left-0 bg-white w-full h-full object-cover  pointer-events-none '
                  src={activeImage}
                  alt={product.name}
                  ref={imageRef}
                />
              </div>
              {/* slider */}
              <div className='relative mt-4 grid grid-cols-5 gap-1'>
                <button
                  onClick={prevSlide}
                  className='absolute left-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='h-5 w-5 cursor-pointer'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5 8.25 12l7.5-7.5' />
                  </svg>
                </button>
                {/* render 5 bức hình */}
                {/*  {product.images.slice(0, 5).map((img, index) => { */}
                {currentImages.map((img) => {
                  const isActive = img === activeImage
                  return (
                    <div
                      className='relative w-full pt-[100%]'
                      key={img}
                      // hover vào hiện hình ảnh đã active lên onMouseEnter
                      onMouseEnter={() => chooseActive(img)}
                    >
                      <img
                        className='cursor-pointer absolute top-0 left-0 bg-white w-full h-full object-cover'
                        src={img}
                        alt={product.name}
                      />

                      {isActive && <div className='absolute inset-0 border-2 border-orange-500' />}
                    </div>
                  )
                })}

                <button
                  onClick={nextSlide}
                  className='absolute right-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'
                  disabled={currentIndexImages[1] >= product.images.length}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='h-5 w-5 cursor-pointer'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
                  </svg>
                </button>
              </div>
            </div>
            <div className='col-span-7'>
              <h1 className='text-xl font-medium uppercase'>{product.name}</h1>
              <div className='mt-8 flex items-center'>
                <div className='flex items-center'>
                  <span className=' mr-1 border-b border-b-orange-500 text-orange-500 font-bold'>{product.rating}</span>
                  <ProductRating
                    rating={product.rating}
                    activeClassname='fill-orange-500 text-orange-500 w-4 h-4'
                    nonActiveClassname='fill-gray-300 text-gray-300 h-4 w-4'
                  />
                </div>
                <div className='mx-4 h-6 w-px bg-gray-300'></div>
                <div>
                  <span>{formatNumberToSocialStyle(product.sold)}</span>
                  <span className='ml-2 text-gray-500'>Đã bán</span>
                </div>
              </div>

              <div className='mt-8 flex items-center bg-gray-50 px-5 py-4'>
                <div className='text-gray-500 line-through'>₫ {formatCurrency(product.price_before_discount)}</div>
                <div className='ml-3 text-3xl font-medium text-orange-500'>{formatCurrency(product.price)}</div>
                <div className='text-white ml-4 rounded-sm bg-orange-500 px-1 py-[2px] text-xs font-semibold '>
                  {rateSale(product.price_before_discount, product.price)} GIẢM
                </div>
              </div>
              <div className='mt-8 flex items-center'>
                <div className='capitalize text-gray-500'>Số lượng</div>

                <QuantityController
                  onDecrease={handleByCount}
                  onIncrease={handleByCount}
                  onType={handleByCount}
                  value={buyCount}
                  max={product.quantity}
                />

                <div className='ml-6 text-sm text-gray-500'>{product.quantity}</div>
                <span className='ml-2 text-sm'>Sản phẩm có sẵn</span>
              </div>

              <div className='mt-8 flex items-center'>
                <button
                  onClick={addToCart}
                  className='cursor-pointer flex h-12 items-center justify-center rounded-sm border border-orange-500 bg-orange/10 px-5 capitalize text-orange-600 shadow-sm hover:bg-orange/5'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-6 h-6 mr-2'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z'
                    />
                  </svg>
                  Thêm vào giỏ hàng
                </button>

                <button
                  className='cursor-pointer ml-4 flex h-12 min-w-[5rem] items-center justify-center
                bg-orange-500 px-5 capitalize text-white shadow-sm outline-none hover:bg-orange/90
                '
                >
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='container mx-auto'>
        <div className='mt-8 bg-white p-4 shadow'>
          <div className='rounded bg-gray-50 p-4 text-lg capitalize text-slate-700'>Mô tả sản phẩm</div>
          <div className='mx-4 mt-12 mb-4 text-sm leading-loose'>
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(product.description)
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
