const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

// 获取 package.json 中的版本
const packageJsonPath = path.join(__dirname, "..", "package.json")
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))
let version = packageJson.version

// 尝试获取 Git 信息
try {
  // 获取最新的 Git 标签
  const gitTag = execSync('git describe --tags --abbrev=0 2>/dev/null || echo ""').toString().trim()

  // 获取短 Git 提交哈希
  const gitHash = execSync("git rev-parse --short HEAD").toString().trim()

  // 如果有 Git 标签，使用它作为版本号
  if (gitTag && gitTag.startsWith("v")) {
    version = gitTag.substring(1) // 移除 'v' 前缀
  }

  // 添加 Git 哈希
  version = `${version}-${gitHash}`
} catch (error) {
  console.warn("无法获取 Git 信息，使用 package.json 中的版本号")
}

// 获取构建日期
const buildDate = new Date().toISOString()

// 创建或更新 .env.local 文件
const envPath = path.join(__dirname, "..", ".env.local")
let envContent = ""

// 如果文件已存在，读取内容
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, "utf8")
}

// 更新或添加环境变量
function updateEnvVar(content, key, value) {
  const regex = new RegExp(`^${key}=.*`, "m")
  const newLine = `${key}=${value}`

  if (content.match(regex)) {
    return content.replace(regex, newLine)
  } else {
    return content + (content ? "\n" : "") + newLine
  }
}

envContent = updateEnvVar(envContent, "NEXT_PUBLIC_APP_VERSION", version)
envContent = updateEnvVar(envContent, "NEXT_PUBLIC_BUILD_DATE", buildDate)

// 写入文件
fs.writeFileSync(envPath, envContent)
console.log(`已设置应用版本为 ${version}`)
console.log(`已设置构建日期为 ${buildDate}`)
