import Link from "next/link"
import { VersionDisplay } from "./version-display"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">言语云³集成中心系统</h3>
            <p className="text-sm text-muted-foreground mb-4">发现、连接并管理强大的集成应用，提升您的业务效率</p>
            <div className="flex items-center">
              <VersionDisplay />
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-4">快速链接</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  首页
                </Link>
              </li>
              <li>
                <Link href="/integrations" className="text-muted-foreground hover:text-foreground transition-colors">
                  集成应用
                </Link>
              </li>
              <li>
                <Link href="/marketplace" className="text-muted-foreground hover:text-foreground transition-colors">
                  应用市场
                </Link>
              </li>
              <li>
                <Link href="/favorites" className="text-muted-foreground hover:text-foreground transition-colors">
                  我的收藏
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4">关于我们</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  关于我们
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  联系我们
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  隐私政策
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  服务条款
                </Link>
              </li>
              <li>
                <Link href="/about/version" className="text-muted-foreground hover:text-foreground transition-colors">
                  版本信息
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">© {currentYear} YanYu Cloud³. 保留所有权利。</p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Link href="mailto:china@0379.email" className="text-sm text-muted-foreground hover:text-foreground">
              china@0379.email
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
