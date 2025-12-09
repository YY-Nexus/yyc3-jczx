import { Logo } from "@/app/components/ui/logo"
import { Button } from "@/components/ui/button"
import { Bell, Settings } from "lucide-react"
import { UserMenu } from "@/app/components/auth/user-menu"
import { SyncIndicator } from "@/app/components/sync/sync-indicator"
import { EncryptionStatus } from "@/app/components/encryption/encryption-status"
import Link from "next/link"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Logo />
        <div className="ml-auto flex items-center space-x-1">
          <EncryptionStatus className="mr-2" />
          <SyncIndicator className="mr-2" />
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/account/sync">
              <Settings className="h-5 w-5" />
            </Link>
          </Button>
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
