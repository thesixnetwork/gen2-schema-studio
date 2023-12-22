// "use server"
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from "./providers";
import { ThemeProvider } from "@/components/theme-provider";
import Layout from "@/components/Layout";
// import { SessionProvider } from "next-auth/react"

const inter = Inter({ subsets: ['latin'] })

// export const metadata: Metadata = {
//   title: 'Gen2 Studio',
//   description: 'SIX Protocol NFT Generator',
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // <SessionProvider>
    <html lang="en">
      <head>
        <title>Gen2 Studio</title>
      </head>
      <body className={inter.className}>
        {/* <ThemeProvider attribute="class" defaultTheme="dark" enableSystem> */}
        {/* <SessionProvider> */}
        <Providers>
            <Layout>
              {children}
            </Layout>
        </Providers>
        {/* </SessionProvider> */}
        {/* </ThemeProvider> */}
      </body>
    </html>
    // </SessionProvider>
  )
}
