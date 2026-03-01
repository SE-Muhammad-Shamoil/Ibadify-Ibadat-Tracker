import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Ibadah Tracker – Track Your Daily Worship',
  description: 'A private, reflective tracker for your daily acts of worship. Log prayers, Quran recitation, zikr, and good deeds. Track streaks and progress.',
  keywords: ['ibadah', 'prayer tracker', 'islam', 'muslim', 'worship', 'quran', 'zikr'],
  authors: [{ name: 'Ibadah Tracker' }],
  robots: 'index, follow',
  openGraph: {
    title: 'Ibadah Tracker',
    description: 'Track your daily acts of worship privately and consistently.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
