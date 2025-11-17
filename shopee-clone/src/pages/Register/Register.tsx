import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { schema, Schema } from '../../ultils/rules'
import Input from '../../components/Input'
import authApi from '../../apis/auth.api'
import { omit, type Omit } from 'lodash'
import { error } from 'console'
import { isAxiosUnprocessableEntityError } from '../../ultils/util'
import type { ErrorResponse } from '../../types/util.type'
import { useContext } from 'react'
import { AppContext } from '../../components/context/app.context'
import Button from '../../components/Button'
// import { rule } from 'postcss'

// interface FormData {
//   email: string
//   password: string
//   confirm_password: string
// }

type FormData = Pick<Schema, 'email' | 'password' | 'confirm_password'>
const registerSchema = schema.pick(['email', 'password', 'confirm_password'])

export default function Register() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    // watch,
    // getValues,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(registerSchema)
  })
  // const rules = getRules(getValues)

  const registerAccountMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => authApi.registerAccount(body)
  })

  const onSubmit = handleSubmit(
    (data) => {
      const body = omit(data, ['confirm_password'])
      registerAccountMutation.mutate(body, {
        onSuccess: (data) => {
          setIsAuthenticated(true)
          setProfile(data.data.data.user)
          navigate('/login')
        },
        onError: (error) => {
          if (isAxiosUnprocessableEntityError<ErrorResponse<Omit<FormData, 'confirm_password'>>>(error)) {
            console.log('error : ', error)
            const formError = error.response?.data.data
            if (formError?.email) {
              setError('email', {
                message: formError.email,
                type: 'Server'
              })
            }

            if (formError?.password) {
              setError('password', {
                message: formError.password,
                type: 'Server'
              })
            }
          }
        }
      })
    }
    // (data) => {
    //   // Khi mà nhấn submit mà cái form nó ko có đúng -> thì function này nó không có chạy
    //   // Xử lý khi cái form nó không có đúng
    //   const password = getValues('password')
    //   console.log('password : ', data, password) // khi nhấn submit form thì nó log
    // }
  )
  // console.log('errors : ', errors)

  // watch -> watch() -> nếu không truyền gì vào thì nó sẽ re-render lại mỗi khi click vào input
  // Còn nếu -> watch('password') -> thì nó chỉ onChange khi click vào password
  // const password = watch('password')

  // getValues -> get dựa vào 1 cái sự kiện nào đấy
  // VD : khi nhấn submit hoặc khi nhấn button nào đó -> thì muốn getValue của password

  // register -> Cung cấp thông tin cho react-hook-form

  return (
    <div className='bg-orange-600'>
      <div className=' container'>
        <div className='grid grid-cols-1 lg:grid-cols-5 lg:py-32 lg:pr-10 py-12'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='p-10 rounded shadow-sm bg-white' onSubmit={onSubmit} noValidate>
              <div className='text-2xl'>Đăng ký</div>
              <div className='mt-3 '>
                <Input
                  name='email'
                  placeholder='Email'
                  type='email'
                  register={register}
                  errorMessage={errors.email?.message}
                  className='mt-4'
                />
                {/* <input
                  type='text'
                  className='p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                  placeholder='Email'
                  {...register('email', rules.email)}
                /> 
                <div className='mt-1 text-red-600 min-h-[1.25rem] text-sm'>{errors.email?.message}</div>
                */}
              </div>
              {/* <div className='mt-2'>
                <input
                  type='password'
                  className='p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                  placeholder='Password'
                  autoComplete='on'
                  {...register('password', rules.password)}
                />
                <div className='mt-1 text-red-600 min-h-[1.25rem] text-sm'>{errors.password?.message}</div>
              </div> */}

              <Input
                name='password'
                placeholder='Password'
                type='password'
                register={register}
                errorMessage={errors.password?.message}
                className='mt-4'
                autoComplete='on'
              />

              <Input
                name='confirm_password'
                placeholder='Confirm Password'
                type='password'
                register={register}
                errorMessage={errors.confirm_password?.message}
                className='mt-4'
                autoComplete='on'
              />

              <div className='mt-2'>
                <Button
                  type='submit'
                  className='w-full py-4 px-2 uppercase bg-red-500 text-white text-sm hover:bg-red-600 cursor-pointer
                  flex justify-center items-center
                  '
                  isLoading={registerAccountMutation.isPending}
                  disabled={registerAccountMutation.isPending}
                >
                  Đăng ký
                </Button>
              </div>

              <div className='mt-8 flex items-center justify-center'>
                <span className='text-gray-400'>Bạn đã có tải khoản chưa ?</span>
                <Link className='text-red-500 ml-1' to='/login'>
                  Đăng nhập
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
