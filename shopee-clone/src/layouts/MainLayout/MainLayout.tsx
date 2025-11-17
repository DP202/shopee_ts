import React from 'react'
import MainHeader from '../../components/MainHeader'
import Footer from '../../components/Footer'

interface Props {
  children?: React.ReactNode
}

export default function MainLayout({ children }: Props) {
  return (
    <div>
      <MainHeader />
      {children}
      <Footer />
    </div>
  )
}
