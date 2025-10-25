'use client'

import { usePathname } from "next/navigation"
import Header from "./Header"
import Footer from "./Footer"

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  const isMapPage = pathname === '/maps'

  return (
    <>
      {!isMapPage && <Header />}
      {children}
      {!isMapPage && <Footer />}
    </>
  )
}
