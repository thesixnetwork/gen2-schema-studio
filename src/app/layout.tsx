import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Montserrat } from 'next/font/google'
import './globals.css'
import { Providers } from "./providers";
import { ThemeProvider } from "@/components/theme-provider";


const inter = Inter({ subsets: ['latin'] })

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Gen2 Studio',
  description: 'SIX Protocol NFT Generator',
}

export default function RootLayout({
  
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <Providers>
          {children}
        </Providers>
      </ThemeProvider>
      </body>
    </html>
  )
}
