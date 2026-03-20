# XCapture - X.com 推文截图工具

一个 Chrome 浏览器扩展，用于将 X.com (Twitter) 的推文转换为图片。

## 功能特性

- 📸 一键截图推文内容
- 🎨 保持原始样式和布局
- 🖼️ 支持多图网格布局
- 📋 复制到剪贴板
- 💾 下载到本地
- 🎯 自动注入到推文操作栏

## 安装

### 开发模式

1. 克隆仓库
```bash
git clone <repository-url>
cd xcapture
```

2. 安装依赖
```bash
npm install
```

3. 构建扩展
```bash
npm run build
```

4. 在 Chrome 中加载扩展
   - 打开 `chrome://extensions/`
   - 启用"开发者模式"
   - 点击"加载已解压的扩展程序"
   - 选择 `dist/` 目录

### 生产模式

1. 构建生产版本
```bash
npm run package:store
```

2. 打包扩展
   - 上传生成的 `xcapture-v1.0.2.zip` 到 Chrome 应用商店

## 使用方法

1. 访问 [x.com](https://x.com)
2. 在任意推文的操作栏中找到截图按钮（相机图标）
3. 点击按钮生成截图
4. 在预览模态框中选择：
   - 复制到剪贴板
   - 下载到本地

## 技术栈

- TypeScript
- Chrome Extension Manifest V3
- html-to-image
- Vite

## 开发

```bash
# 开发模式（监听文件变化）
npm run dev

# 构建
npm run build

# 生成 Chrome 应用商店 zip
npm run package:store

# 清理
npm run clean
```

## 许可证

MIT
