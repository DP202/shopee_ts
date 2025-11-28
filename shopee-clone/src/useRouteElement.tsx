import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import ProductList from './pages/ProductList'
import Login from './pages/Login'
import Register from './pages/Register'
import RegisterLayout from './layouts/RegisterLayout'
import MainLayout from './layouts/MainLayout'
import Profile from './pages/Profile'
import { useContext } from 'react'
import { AppContext } from './components/context/app.context'
import path from './constant/path'
import ProductDetail from './pages/ProductDetail'

function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext)

  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
}

// Khi người dùng login rồi thì không cho ng dùng login nữa
function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
}

function useRouteElement() {
  const routeElements = useRoutes([
    {
      path: '',
      index: true,
      element: (
        <MainLayout>
          <ProductList />
        </MainLayout>
      )
    },

    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          path: path.profile,
          element: (
            <MainLayout>
              <Profile />
            </MainLayout>
          )
        }
      ]
    },
    {
      path: path.productDetail,

      element: (
        <MainLayout>
          <ProductDetail />
        </MainLayout>
      )
    },
    {
      path: '',
      element: <RejectedRoute />,
      children: [
        {
          path: path.login,
          element: (
            <RegisterLayout>
              <Login />
            </RegisterLayout>
          )
        },
        {
          path: path.register,
          element: (
            <RegisterLayout>
              <Register />
            </RegisterLayout>
          )
        }
      ]
    }
  ])
  return routeElements
}

export default useRouteElement

// hooks/useRouteElement.ts
// import { useRoutes, Navigate, Outlet } from 'react-router-dom'
// import ProductList from './pages/ProductList'
// import Login from './pages/Login'
// import Register from './pages/Register'
// import RegisterLayout from './layouts/RegisterLayout'
// import MainLayout from './layouts/MainLayout'
// import Profile from './pages/Profile'
// import ProductDetail from './pages/ProductDetail'
// import path from './constant/path'
// import { useContext } from 'react'
// import { AppContext } from './components/context/app.context'

// // Chỉ bảo vệ những route NHẤT ĐỊNH PHẢI ĐĂNG NHẬP mới vào được
// function ProtectedRoute() {
//   const { isAuthenticated } = useContext(AppContext)
//   return isAuthenticated ? <Outlet /> : <Navigate to='/login' replace />
// }

// // BỎ HOÀN TOÀN RejectedRoute → ai cũng vào được /login, /register kể cả đã login

// function useRouteElement() {
//   return useRoutes([
//     // Trang chủ
//     {
//       path: '/',
//       element: (
//         <MainLayout>
//           <ProductList />
//         </MainLayout>
//       )
//     },

//     // Chi tiết sản phẩm - ai cũng vào được
//     {
//       path: path.productDetail,
//       element: (
//         <MainLayout>
//           <ProductDetail />
//         </MainLayout>
//       )
//     },

//     // Các route BẮT BUỘC phải đăng nhập
//     {
//       element: <ProtectedRoute />,
//       children: [
//         {
//           path: path.profile,
//           element: (
//             <MainLayout>
//               <Profile />
//             </MainLayout>
//           )
//         }
//         // thêm /order, /cart, v.v. ở đây nếu cần bảo vệ
//       ]
//     },

//     // Login & Register - AI CŨNG VÀO ĐƯỢC (kể cả đã login)
//     {
//       path: path.login,
//       element: (
//         <RegisterLayout>
//           <Login />
//         </RegisterLayout>
//       )
//     },
//     {
//       path: path.register,
//       element: (
//         <RegisterLayout>
//           <Register />
//         </RegisterLayout>
//       )
//     },

//     // 404
//     {
//       path: '*',
//       element: <Navigate to='/' replace />
//     }
//   ])
// }

// export default useRouteElement
