import type React from "react"
import Image from "next/image"
import { getImagePath } from "@/app/utils/image-path"

interface ImageComponentProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  fill?: boolean
  sizes?: string
  quality?: number
  style?: React.CSSProperties
  onLoad?: () => void
  onError?: () => void
}

export function ImageComponent({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  fill = false,
  sizes,
  quality,
  style,
  onLoad,
  onError,
  ...props
}: ImageComponentProps &
  Omit<React.HTMLProps<HTMLImageElement>, "src" | "alt" | "width" | "height" | "loading" | "ref">) {
  // 使用工具函数获取正确的图片路径
  const correctedPath = getImagePath(src)

  return (
    <Image
      src={correctedPath || "/placeholder.svg"}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      fill={fill}
      sizes={sizes}
      quality={quality}
      style={style}
      onLoad={onLoad}
      onError={onError}
      {...props}
    />
  )
}
