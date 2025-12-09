import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">页面未找到</h2>
      <p className="text-gray-500 max-w-md mb-8">您访问的页面不存在或已被移除。请检查URL是否正确，或返回首页。</p>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/">返回首页</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/contact">联系我们</Link>
        </Button>
      </div>
    </div>
  )
}
