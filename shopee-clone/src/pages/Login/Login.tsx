import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { schema, Schema } from '../../ultils/rules'
import { useMutation } from '@tanstack/react-query'
import authApi from '../../apis/auth.api'

import { isAxiosUnprocessableEntityError } from '../../ultils/util'
import type { ErrorResponse } from '../../types/util.type'
import Input from '../../components/Input'
import { useContext } from 'react'
import { AppContext } from '../../components/context/app.context'
import Button from '../../components/Button'

type FormData = Pick<Schema, 'email' | 'password'>

const loginSchema = schema.pick(['email', 'password'])

function Login() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema)
  })

  // console.log('error hook form : ', errors)

  const loginAccountMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => authApi.login(body)
  })

  const onSubmit = handleSubmit(
    (data) => {
      console.log('data : ', data)
      loginAccountMutation.mutate(data, {
        onSuccess: (data) => {
          // console.log('Data : ', data)
          // Login thành công
          setIsAuthenticated(true) // thành công thì true
          // Lấy profile
          setProfile(data.data.data.user)
          navigate('/')
        },
        onError: (error) => {
          if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
            const formError = error.response?.data.data
            if (formError) {
              Object.keys(formError).forEach((key) => {
                setError(key as keyof FormData, {
                  message: formError[key as keyof FormData],
                  type: 'Server'
                })
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

  return (
    <div className='bg-orange-600'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='grid grid-cols-1 lg:grid-cols-5 lg:py-32 lg:pr-10 py-12'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='p-10 rounded shadow-sm bg-white' noValidate onSubmit={onSubmit}>
              <div className='text-2xl'>Đăng nhập</div>
              <div className='mt-3'>
                <Input
                  name='email'
                  placeholder='Email'
                  type='email'
                  register={register}
                  errorMessage={errors.email?.message}
                  className='mt-4'
                />
              </div>
              <Input
                name='password'
                placeholder='Password'
                type='password'
                register={register}
                errorMessage={errors.password?.message}
                className='mt-4'
                autoComplete='on'
              />
              <div className='mt-3'>
                <Button
                  type='submit'
                  className='w-full py-4 px-2 uppercase bg-red-500 text-white text-sm hover:bg-red-600 cursor-pointer
                  flex justify-center items-center'
                  isLoading={loginAccountMutation.isPending}
                  disabled={loginAccountMutation.isPending}
                >
                  Đăng nhập
                </Button>
              </div>
              <div className='mt-8 flex items-center justify-center'>
                <span className='text-gray-400'>Bạn chưa có tải khoản ?</span>
                <Link className='text-red-500 ml-1' to='/register'>
                  Đăng ký
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
