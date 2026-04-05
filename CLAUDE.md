# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 提供本仓库的工作指引。

## 项目简介

XCapture 是一个 Chrome 扩展（Manifest V3），在 x.com 的推文上添加截图按钮，将推文捕获为 PNG 图片，支持复制/下载/切割功能。唯一的运行时依赖是 `html-to-image`。

## 构建命令

```bash
npm run build:dev    # 开发构建，自动递增构建号（主要开发流程）
npm run build        # 生产构建，含发布验证
npm run clean        # 清除 dist/
npm run package:store # 创建 Chrome Web Store 压缩包
```

## 测试

使用 Node 内置测试运行器（无外部框架）：

```bash
node --test tests/*.test.js       # 运行所有测试
node --test tests/release-manifest.test.js  # 运行单个测试
```

## 版本规则

- 格式：`major.minor.patch.build`（如 `1.0.3.1`），定义在 `manifest.json` 中
- 开发构建：每次构建通过 `npm run build:dev` 递增最后一位（构建号）
- 正式发布：去掉构建号，保留 `major.minor.patch`（如 `1.0.3`）

## 架构

内容脚本入口：`src/content/index.ts` → `XCapture` 编排类。

**处理流水线：** TweetDetector（MutationObserver 查找 `[data-testid="tweet"]`）→ ButtonInjector（在 `[role="group"]` 操作栏添加相机按钮）→ ScreenshotCapture（克隆 DOM、内联图片、通过 html-to-image 以 2x 渲染）→ PreviewModal（Shadow DOM 模态框，支持复制/下载/切割）。

**核心模块：**

- `src/content/tweet-detector.ts` — 通过 MutationObserver 在 primaryColumn 上监听推文
- `src/content/button-injector.ts` — 使用 WeakSet/WeakMap 追踪已注入的操作栏，MutationObserver 处理动态内容
- `src/content/screenshot.ts` — DOM 克隆、样式规范化、图片内联、尺寸限制（最大 1200×12000）
- `src/ui/preview-modal.ts` — Shadow DOM 模态框；长图（高宽比 > 16:9）显示切割按钮
- `src/utils/image-helpers.ts` — 剪贴板复制、下载、16:9 比例图片切割、水印
- `src/i18n/` — 国际化模块，支持中英文，根据浏览器语言自动检测，模态框内可手动切换

**构建流水线：** Vite 打包 → `prepare-release.js` 重写 manifest 路径（去掉 `dist/` 前缀、复制资源）→ `validate-release.js` 检查所有引用文件是否存在。`dist/` 目录即为可加载的扩展。

## Agent 规则

- 每次完成任务后，打印时间戳：`date '+%Y-%m-%d %H:%M:%S'`
- 每次发布正式版本，都要把重要的变更信息，以中、英文分别添加到CHANGELOG.md和CHANGELOG.zh.md
- 每次发布正式版本，都要同步更新STORE_LISTING_BILINGUAL.md，并提示我如何更新Chrome Web Store中的软件描述
- 每次发布正式版本，都要在压缩包文件名体现版本号

## 语言

用户界面文本（按钮标签、提示消息、模态框标题）支持中英文国际化。
