import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
<<<<<<< HEAD
  title: 'Classroom Collaboration Tool',
  description: 'Interactive classroom collaboration platform',
=======
  title: 'CoLab Classroom',
  description: 'Interactive classroom collaboration platform',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🌐</text></svg>',
  },
>>>>>>> master
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
<<<<<<< HEAD


=======
>>>>>>> master
