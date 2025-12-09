import type React from "react"
import "./globals.css"
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
import { InstallPrompt } from "./components/pwa/install-prompt"
import { OfflineIndicator } from "./components/pwa/offline-indicator"
import { PWAUpdatePrompt } from "./components/pwa/pwa-update-prompt"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "言语云³集成中心系统 | YanYu Yun³ Integration Center System",
  description: "发现、连接并管理强大的集成应用，提升您的业务效率",
  generator: "v0.app",
  manifest: "/manifest.json",
  themeColor: "#3b82f6",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "YYC³ 集成中心",
  },
  formatDetection: {
    telephone: false,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/images/logo.png" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <ErrorBoundary>
            <AuthProvider>
              <EncryptionProvider>
                <FavoritesProvider integrations={integrations}>
                  {children}
                  <Toaster />
                  <InstallPrompt />
                  <OfflineIndicator />
                  <PWAUpdatePrompt />
                </FavoritesProvider>
              </EncryptionProvider>
            </AuthProvider>
          </ErrorBoundary>
        </ThemeProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('Service Worker registered:', registration.scope);
                    },
                    function(error) {
                      console.log('Service Worker registration failed:', error);
                    }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
