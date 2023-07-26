import './globals.css'
import { Inter } from 'next/font/google'
import React from "react";
import AppTheme from "./AppTheme";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Node-Crawler',
  description: 'Node-Crawler is a highly customizable, Node-based web application for creating web crawlers and further processing and transforming the retrieved data.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
        <AppTheme >
            <body className={inter.className}>
                {children}
            </body>
        </AppTheme>
    </html>
  )
}
