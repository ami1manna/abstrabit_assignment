import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import ReduxProvider from "@/src/providers/ReduxProvider"
import { ThemeProvider } from "@/src/providers/ThemeProvider"
import "./globals.css"

const _inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Smart Bookmark App",
  description:
    "Manage your private bookmarks with ease. Save, organize, and access your links from anywhere.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <ThemeProvider>
          <ReduxProvider>{children}</ReduxProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
