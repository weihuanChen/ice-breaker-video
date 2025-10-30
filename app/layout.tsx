import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Analytics } from '@vercel/analytics/next'

export const metadata = {
  metadataBase: new URL('https://icebreakgames.video'),
  title: {
    default: 'Icebreak Games - Fun Video Resources for Teams & Classrooms',
    template: '%s | Icebreak Games',
  },
  description:
    'Discover engaging icebreaker game videos to energize your team, classroom, or event. From quick activities to in-depth tutorials.',
  keywords: [
    'icebreaker games',
    'team building',
    'classroom activities',
    'group games',
    'team energizers',
    'educational games',
  ],
  authors: [{ name: 'Icebreak Games' }],
  creator: 'Icebreak Games',
  icons: {
    icon: '/ice.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://icebreakgames.video',
    title: 'Icebreak Games - Fun Video Resources for Teams & Classrooms',
    description:
      'Discover engaging icebreaker game videos to energize your team, classroom, or event.',
    siteName: 'Icebreak Games',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Icebreak Games - Fun Video Resources for Teams & Classrooms',
    description:
      'Discover engaging icebreaker game videos to energize your team, classroom, or event.',
  },
}

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Header />
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
