// "use server"
"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { ThemeProvider } from "@/components/theme-provider";
import Layout from "@/components/Layout";
// import { SessionProvider } from "next-auth/react"
import { useSession, signIn } from "next-auth/react";

import NextNProgress from "nextjs-progressbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { StargateClient } from "@cosmjs/stargate";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: 'Gen2 Studio',
//   description: 'SIX Protocol NFT Generator',
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // console.log("session", session);
  return (
    <html lang="en">
      <head>
        <title>Gen2 Studio</title>
      </head>
      <body className={inter.className}>
        <Providers>
          <Layout>
            <NextNProgress
              options={{ showSpinner: false }}
              height={20}
              color="#209cee"
            />
            {children}
          </Layout>
        </Providers>
      </body>
    </html>
  );
}
