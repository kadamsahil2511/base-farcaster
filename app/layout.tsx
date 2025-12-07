import type { Metadata } from 'next'

import { Providers } from '@/components/providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'Helix Hunter - Genome Battle Game',
  description: 'A retro pixel-art genome battle game on Farcaster',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="bg-pixel-navy text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
