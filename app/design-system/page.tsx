import type { Metadata } from "next"
import { DesignSystem } from "@/app/components/ui/design-system"

export const metadata: Metadata = {
  title: "言语云³集成中心系统 - 设计系统",
  description: "统一的UI设计系统，确保整个应用保持一致的视觉风格",
}

export default function DesignSystemPage() {
  return <DesignSystem />
}
