/**
 * 获取正确的图片路径
 * 在Next.js中，public目录下的文件应该直接从根路径引用，不包含'public'前缀
 */
export function getImagePath(path: string): string {
  // 如果路径以/public开头，则移除/public前缀
  if (path.startsWith("/public/")) {
    return path.substring(7) // 移除'/public/'
  }

  // 如果路径以public/开头，则移除public/前缀
  if (path.startsWith("public/")) {
    return path.substring(6) // 移除'public/'
  }

  // 如果路径已经是正确格式，则直接返回
  return path
}
