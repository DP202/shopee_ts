// import React, { type InputHTMLAttributes } from 'react'
// import type { RegisterOptions, UseFormRegister } from 'react-hook-form'

// interface Props extends InputHTMLAttributes<HTMLInputElement> {
//   errorMessage?: string
//   classNameInput?: string
//   classNameError?: string
//   register?: UseFormRegister<any>
//   rules?: RegisterOptions
// }

// export default function Input({
//   type,
//   errorMessage,
//   placeholder,
//   className,
//   name,
//   register,
//   rules,
//   autoComplete,
//   classNameError = 'mt-1 text-red-600 min-h-[1.25rem] text-sm',
//   classNameInput = 'p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
// }: Props) {
//   const registerResult = register && name ? register(name, rules) : {}
//   return (
//     <div>
//       <div className='mt-3'>
//         <input
//           type={type}
//           className={classNameInput}
//           placeholder={placeholder}
//           {...registerResult}
//           autoComplete={autoComplete}
//         />
//         <div className={classNameError}>{errorMessage}</div>
//       </div>
//     </div>
//   )
// }

import React, { type InputHTMLAttributes } from 'react'
import type { RegisterOptions, UseFormRegister } from 'react-hook-form'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
  name: string
  register?: UseFormRegister<any>
  rules?: RegisterOptions
}

export default function Input({
  errorMessage,
  className,
  name,
  register,
  rules,
  classNameInput = 'p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm',
  classNameError = 'mt-1 text-red-600 min-h-[1.25rem] text-sm',
  ...rest
}: InputProps) {
  const registerResult = register && name ? register(name, rules) : null

  return (
    <div className={className}>
      <input className={classNameInput} {...registerResult} {...rest} />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
}
