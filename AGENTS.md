# XCapture 项目开发规则

## 永久规则

### 1. 版本号 Build 号规则
- 版本号格式：`major.minor.patch.build`（例如：1.0.0.1）
- 每次构建时自动增加 build 号
- Build 号用于测试时确认浏览器是否加载了最新版本
- 位置：`manifest.json` 的 `version` 字段

### 2. 工作完成时间戳规则
- 每次完成一个工作（修复 bug、添加功能、重构等）后
- 必须在屏幕上打印当前系统时间
- 使用命令：`date '+%Y-%m-%d %H:%M:%S'`

## 构建流程
1. 运行 `npm run build:dev` - 自动增加 build 号并构建
2. 在 Chrome 扩展页面刷新扩展
3. 刷新 x.com 页面测试

## 版本管理
- Build 号从 1 开始，每次构建 +1
- 手动测试时可以运行 `npm run bump:build` 只增加 build 号
