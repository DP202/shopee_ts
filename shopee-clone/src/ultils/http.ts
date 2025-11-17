import axios, { type AxiosInstance } from 'axios'
import HttpStatusCode from '../constant/httpStatusCode.enum'
import { toast } from 'react-toastify'
import type { AuthResponse } from '../types/auth.type'
import { clearLocalStorage, getAccessTokenFromLS, setAccesTokenLocalStorage, setProfileLocalStorage } from './auth'

// Dùng interceptor để hiển thị lỗi

// Xử lý vấn đề mà chúng ta gửi lên thì dùng request
class Http {
  instance: AxiosInstance
  private acessToken: string
  constructor() {
    this.acessToken = getAccessTokenFromLS()
    this.instance = axios.create({
      baseURL: 'https://api-ecom.duthanhduoc.com/',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    // LogIn Và Logout xong -> Xử lý cái intercepter đối với request với các api
    // cần có header token -> thì phải truyền lên -> nên là xử lý tại đây
    this.instance.interceptors.request.use(
      (config) => {
        if (this.acessToken && config.headers) {
          // Nếu có accessToken thì gán vào header
          // authorization -> là key truyền lên trên server
          // yêu cầu truyền accessToken lên bằng cái header với name là authorization
          config.headers.authorization = this.acessToken
          // Vì api này có sẵn Bearer  nên ko truyền
          return config
        }
        // Nếu có accessToken thì gắn vào header còn không có thì thôi
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    //

    // Hiển thị lỗi trả về là dùng response
    // Lấy đoạn code này trên trang interceptos
    this.instance.interceptors.response.use(
      (response) => {
        // lấy acess_token thành công thì làm trong này

        // console.log('response : ', response) // Khi log ra thì trong config nó có url :'/login'

        // Nên là xét nó
        const { url } = response.config // response.config.url
        if (url === '/login' || url === '/register') {
          const data = response.data as AuthResponse
          this.acessToken = data.data.access_token
          // Lưu vào localstorage
          setAccesTokenLocalStorage(this.acessToken)
          // set lại profile để khi f5 nó vẫn lưu
          setProfileLocalStorage(data.data.user)
        } else if (url === '/logout') {
          // logout
          this.acessToken = ''
          clearLocalStorage()
        }
        return response
      },
      function (error) {
        // Xử lý lỗi chỗ này
        // console.log('error : ', error)
        if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data: any | undefined = error.response?.data
          const message = data.message || error.message
          toast.error(message)
        }
        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance

export default http
