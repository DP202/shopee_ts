import type { UseFormGetValues } from 'react-hook-form'
import * as yup from 'yup'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getRules = (getValues?: UseFormGetValues<any>) => ({
  email: {
    required: {
      value: true,
      message: 'Email là bắt buộc'
    },
    pattern: {
      value: /^\S+@\S+\.\S+$/,
      message: 'Email không đúng định dạng'
    },
    maxLength: {
      value: 160,
      message: 'Độ dài từ 5 đến 160 ký tự'
    },
    minLength: {
      value: 5,
      message: 'Độ dài tối thiểu là 5 ký tự'
    }
  },

  password: {
    required: {
      value: true,
      message: 'Mật khẩu bắt buộc nhập'
    },

    maxLength: {
      value: 160,
      message: 'Độ dài từ 6 đến 160 ký tự'
    },
    minLength: {
      value: 6,
      message: 'Độ dài tối thiểu là 5 ký tự'
    }
  },
  confirm_password: {
    required: {
      value: true,
      message: 'Nhập lại mật khẩu là bắt buộc nhập'
    },
    maxLength: {
      value: 160,
      message: 'Độ dài từ 6 đến 160 ký tự'
    },
    minLength: {
      value: 6,
      message: 'Độ dài tối thiểu là 5 ký tự'
    },
    // Này là lúc người dùng có thể truyền vào hoặc không truyền vào getValues
    validate:
      typeof getValues === 'function'
        ? (value: string) => value === getValues('password') || 'Nhập lại password không khớp'
        : undefined
  }
})

export const schema = yup.object({
  email: yup
    .string()
    .required('Email là bắt buộc')
    .email('Email không đúng định dạng')
    .min(5, 'Độ dài từ 5 - 160 ký tự')
    .max(160, 'Độ dài từ 5 - 160 ký tự'),
  password: yup
    .string()
    .required('Password là bắt buộc')
    .min(6, 'Độ dài từ 6 - 160 ký tự')
    .max(160, 'Độ dài từ 6 - 160 ký tự'),
  confirm_password: yup
    .string()
    .required('Nhập lại password là bắt buộc')
    .min(6, 'Độ dài từ 6 - 160 ký tự')
    .max(160, 'Độ dài từ 6 - 160 ký tự')
    .oneOf([yup.ref('password')], 'Nhập lại password không khớp'), // là nó match với password
  price_min: yup.string().test({
    // test để custom lại validate
    // trong test thì có 1 cái name -> name này là 1 cái rules để test
    name: 'price-not-allowed',
    message: 'Giá không phù hợp',
    test: function (value) {
      // test trong test này là 1 cái function -> nhận 1 cái value -> lấy ra được value của price_min
      const price_min = value
      // this.parent -> nó lấy ra được cái object cha của thèn price_min -> nên có price_max
      const { price_max } = this.parent
      if (price_min !== '' && price_max !== '') {
        // nếu có 2 thèn này
        return Number(price_max) >= Number(price_min)
      }
      return price_min !== '' || price_max !== ''
    }
  }),
  price_max: yup.string().test({
    name: 'price-not-allowed',
    message: 'Giá không phù hợp',
    test: function (value) {
      // test trong test này là 1 cái function -> nhận 1 cái value -> lấy ra được value của price_min
      const price_max = value
      // this.parent -> nó lấy ra được cái object cha của thèn price_min -> nên có price_max
      const { price_min } = this.parent
      if (price_min !== '' && price_max !== '') {
        // nếu có 2 thèn này
        return Number(price_max) >= Number(price_min)
      }
      return price_min !== '' || price_max !== ''
    }
  }),
  name: yup.string().trim().required('Tên sản phẩm là bắt buộc')
})

const schemaLogin = schema.omit(['confirm_password'])
type LoginChema = yup.InferType<typeof schemaLogin>

export type Schema = yup.InferType<typeof schema>
