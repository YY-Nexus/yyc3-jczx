import type React from "react"
import "./globals.css"
// 添加正确的设计系统CSS导入
import "./styles/design-system.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { FavoritesProvider } from "./context/favorites-context"
import { AuthProvider } from "./context/auth-context"
import { EncryptionProvider } from "./context/encryption-context"
import { integrations } from "./data/integrations"
import { Toaster } from "@/components/ui/toaster"
import { ErrorBoundary } from "./components/error-handling/error-boundary"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "言语云³集成中心系统 | YanYu Yun³ Integration Center System",
  description: "发现、连接并管理强大的集成应用，提升您的业务效率",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <ErrorBoundary>
            <AuthProvider>
              <EncryptionProvider>
                <FavoritesProvider integrations={integrations}>
                  {children}
                  <Toaster />
                </FavoritesProvider>
              </EncryptionProvider>
            </AuthProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  )
}
