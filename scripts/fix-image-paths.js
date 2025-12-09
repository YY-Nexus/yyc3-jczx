/**
 * 这个脚本用于修复项目中的图片路径
 * 将所有以/public/或public/开头的路径修正为正确的格式
 */

const fs = require("fs")
const path = require("path")

// 需要检查的文件扩展名
const extensions = [".tsx", ".ts", ".jsx", ".js"]

// 需要排除的目录
const excludeDirs = ["node_modules", ".next", "out", "build"]

// 递归遍历目录
function traverseDirectory(dir) {
  const files = fs.readdirSync(dir)

  for (const file of files) {
    const fullPath = path.join(dir, file)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory() && !excludeDirs.includes(file)) {
      traverseDirectory(fullPath)
    } else if (stat.isFile() && extensions.includes(path.extname(file))) {
      fixImagePaths(fullPath)
    }
  }
}

// 修复文件中的图片路径
function fixImagePaths(filePath) {
  let content = fs.readFileSync(filePath, "utf8")
  let modified = false

  // 查找并替换以/public/开头的路径
  const pattern1 = /(['"])\/public\/([^'"]+)(['"])/g
  if (pattern1.test(content)) {
    content = content.replace(pattern1, "$1/$2$3")
    modified = true
  }

  // 查找并替换以public/开头的路径
  const pattern2 = /(['"])public\/([^'"]+)(['"])/g
  if (pattern2.test(content)) {
    content = content.replace(pattern2, "$1/$2$3")
    modified = true
  }

  if (modified) {
    fs.writeFileSync(filePath, content, "utf8")
    console.log(`Fixed image paths in: ${filePath}`)
  }
}

// 开始处理
console.log("Starting to fix image paths...")
traverseDirectory("app")
traverseDirectory("components")
console.log("Finished fixing image paths.")
