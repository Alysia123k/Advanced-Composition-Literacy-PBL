import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Classroom Collaboration Tool',
  description: 'Interactive classroom collaboration platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}


