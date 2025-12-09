# Vercel-Flare ✨

感谢上游项目 https://github.com/soulteary/docker-flare 提供的灵感与数据结构。本仓库为纯静态、只读的导航页，适配 Vercel/任意静态托管，不包含在线编辑或后台。

## 特性
- 数据全部来自 `app/*.yml`，构建时读入后导出静态站点
- 无后端依赖、无运行时写操作，默认内置所需 SVG 图标(按需在构建阶段拉取)
- 移动端两列布局自适应，空分类自动隐藏
- 已升级 Next.js 16.0.7 以覆盖已披露的高危漏洞（CVE-2025-66478）

## Vercel 部署（推荐）
1. 使用模板创建自己的项目(推荐选用private)
2. 准备配置（修改项目默认配置文件）  
   - `apps.yml`：`links` 列表，`name`/`link` 必填，可选 `icon`、`desc`
   - `bookmarks.yml`：`categories`（`id`、`title`），`links`（`name`、`link`，可选 `icon`、`category`）
   - `config.yml`：站点标题、是否显示时钟、是否新开标签、页脚开关与文案
3. 在Vercel选择自己的项目（项目已配置构建流程，无需额外配置，直接选择构建即可），开始构建

仓库根目录 `vercel.json` 已配置默认流程：
```
buildCommand: "cd frontend && npm install && npm run build"
outputDirectory: "frontend/out"
```
推送后自动重新构建；如需自定义环境变量或域名，请在 Vercel 控制台配置。

## 快速开始（本地）
1) 安装依赖  
   ```bash
   cd frontend
   npm install
   ```
2) 准备配置（修改项目默认配置文件）  
   - `apps.yml`：`links` 列表，`name`/`link` 必填，可选 `icon`、`desc`
   - `bookmarks.yml`：`categories`（`id`、`title`），`links`（`name`、`link`，可选 `icon`、`category`）
   - `config.yml`：站点标题、是否显示时钟、是否新开标签、页脚开关与文案
3) 本地开发  
   ```bash
   cd frontend
   npm run dev   # http://localhost:3000，实时读取 ../app 下 YAML
   ```
4) 生产构建与静态预览  
   ```bash
   cd frontend
   npm run lint
   npm run build    # 自动按需下载 YAML 中引用的图标到 frontend/public/icons
   npm run start    # serve frontend/out，默认 5005 端口
   ```
   `frontend/out` 可直接上传到任意静态空间。

## 目录约定
- `app/*.example.yml`：示例配置，请复制为同名无 `.example` 的文件后使用
- `frontend/public/icons`：构建时按需拉取的 SVG 图标，避免人为增删

## 授权
本项目基于 MIT License 发布，详见 `LICENSE`。
