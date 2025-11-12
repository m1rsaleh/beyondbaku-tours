import type { ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'
import WhatsAppButton from '../WhatsAppButton'
import ScrollToTop from '../ScrollToTop'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20">{children}</main>
      <Footer />
      <WhatsAppButton />
      <ScrollToTop />
    </div>
  )
}
