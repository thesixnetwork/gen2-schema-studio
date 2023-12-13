// app/providers.tsx
'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider } from '@chakra-ui/react'
import theme from "@/styles/theme";
import { SessionProvider} from "next-auth/react"
import { Session } from 'inspector';


export function Providers({ 
    children 
  }: { 
  children: React.ReactNode 
  }) {
  return (
    <SessionProvider>
    <CacheProvider>
      <ChakraProvider theme={theme}>
        {children}
      </ChakraProvider>
    </CacheProvider>
    </SessionProvider>
  )
}