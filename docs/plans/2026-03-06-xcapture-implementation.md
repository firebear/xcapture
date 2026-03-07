# XCapture 实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 创建一个 Chrome 扩展，将 X.com 推文转换为图片，支持预览、复制和下载功能。

**Architecture:** 使用 Chrome Extension Manifest V3，通过 Content Script 注入按钮到推文操作栏，使用 html-to-image 库将 DOM 转换为图片，通过预览模态框提供用户交互。

**Tech Stack:** TypeScript, Chrome Extension Manifest V3, html-to-image, Vite

---

## Task 1: 项目初始化和配置

**Files:**
- Create: `package.json`
- Create: `manifest.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `.gitignore`

**Step 1: 初始化 npm 项目**

```bash
npm init -y
```

**Step 2: 安装依赖**

```bash
npm install --save-dev typescript vite @types/chrome
npm install html-to-image
```

**Step 3: 创建 manifest.json**

```json
{
  "manifest_version": 3,
  "name": "XCapture - X.com Tweet Screenshot",
  "version": "1.0.0",
  "description": "Capture X.com tweets as images with original styling",
  "permissions": ["activeTab", "clipboardWrite"],
  "host_permissions": ["https://x.com/*", "https://twitter.com/*"],
  "content_scripts": [
    {
      "matches": ["https://x.com/*", "https://twitter.com/*"],
      "js": ["dist/content.js"],
      "css": ["dist/styles.css"],
      "run_at": "document_idle"
    }
  ],
  "icons": {
    "16": "assets/icon16.png",
    "48": "assets/icon48.png",
    "128": "assets/icon128.png"
  }
}
```

**Step 4: 创建 tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Step 5: 创建 vite.config.ts**

```typescript
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        content: resolve(__dirname, 'src/content/index.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      },
    },
  },
});
```

**Step 6: 创建 .gitignore**

```
node_modules/
dist/
*.log
.DS_Store
```

**Step 7: 创建目录结构**

```bash
mkdir -p src/content src/ui src/utils assets
```

**Step 8: 提交初始配置**

```bash
git add package.json manifest.json tsconfig.json vite.config.ts .gitignore
git commit -m "chore: initialize project with configuration files"
```

---

## Task 2: 创建 DOM 辅助工具

**Files:**
- Create: `src/utils/dom-helpers.ts`

**Step 1: 创建 DOM 辅助函数**

```typescript
export function waitForElement(
  selector: string,
  timeout = 5000
): Promise<Element | null> {
  return new Promise((resolve) => {
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }

    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    setTimeout(() => {
      observer.disconnect();
      resolve(null);
    }, timeout);
  });
}

export function inlineStyles(element: HTMLElement): void {
  const computed = window.getComputedStyle(element);
  const properties = [
    'color',
    'background-color',
    'font-size',
    'font-weight',
    'font-family',
    'line-height',
    'padding',
    'margin',
    'border',
    'border-radius',
    'display',
    'flex-direction',
    'gap',
    'width',
    'height',
  ];

  properties.forEach((prop) => {
    element.style.setProperty(prop, computed.getPropertyValue(prop));
  });
}

export function cloneElementWithStyles(element: HTMLElement): HTMLElement {
  const clone = element.cloneNode(true) as HTMLElement;
  
  const allElements = clone.querySelectorAll('*');
  allElements.forEach((el) => {
    if (el instanceof HTMLElement) {
      inlineStyles(el);
    }
  });
  
  inlineStyles(clone);
  
  return clone;
}
```

**Step 2: 提交 DOM 辅助工具**

```bash
git add src/utils/dom-helpers.ts
git commit -m "feat: add DOM helper utilities"
```

---

## Task 3: 创建图片处理工具

**Files:**
- Create: `src/utils/image-helpers.ts`

**Step 1: 创建图片处理函数**

```typescript
export async function copyImageToClipboard(dataUrl: string): Promise<boolean> {
  try {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob }),
    ]);
    return true;
  } catch (error) {
    console.error('Failed to copy image to clipboard:', error);
    return false;
  }
}

export function downloadImage(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function generateFilename(): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `xcapture-${timestamp}.png`;
}
```

**Step 2: 提交图片处理工具**

```bash
git add src/utils/image-helpers.ts
git commit -m "feat: add image helper utilities"
```

---

## Task 4: 实现推文检测器

**Files:**
- Create: `src/content/tweet-detector.ts`

**Step 1: 创建推文检测器**

```typescript
import { waitForElement } from '../utils/dom-helpers';

export class TweetDetector {
  private observer: MutationObserver | null = null;
  private processedTweets = new Set<HTMLElement>();

  async start(callback: (tweet: HTMLElement) => void): Promise<void> {
    await waitForElement('[data-testid="primaryColumn"]');
    
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            this.findTweets(node, callback);
          }
        });
      });
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    const existingTweets = document.querySelectorAll('[data-testid="tweet"]');
    existingTweets.forEach((tweet) => {
      if (tweet instanceof HTMLElement) {
        callback(tweet);
      }
    });
  }

  private findTweets(
    root: HTMLElement,
    callback: (tweet: HTMLElement) => void
  ): void {
    const tweets = root.querySelectorAll('[data-testid="tweet"]');
    tweets.forEach((tweet) => {
      if (
        tweet instanceof HTMLElement &&
        !this.processedTweets.has(tweet)
      ) {
        this.processedTweets.add(tweet);
        callback(tweet);
      }
    });
  }

  stop(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.processedTweets.clear();
  }
}
```

**Step 2: 提交推文检测器**

```bash
git add src/content/tweet-detector.ts
git commit -m "feat: add tweet detector with MutationObserver"
```

---

## Task 5: 实现按钮注入器

**Files:**
- Create: `src/content/button-injector.ts`

**Step 1: 创建按钮注入器**

```typescript
const BUTTON_ID = 'xcapture-button';

export class ButtonInjector {
  private injectedButtons = new Set<HTMLElement>();

  inject(tweet: HTMLElement, onClick: () => void): void {
    if (this.injectedButtons.has(tweet)) {
      return;
    }

    const actionBar = tweet.querySelector('[role="group"]');
    if (!actionBar) {
      return;
    }

    const button = this.createButton(onClick);
    actionBar.appendChild(button);
    this.injectedButtons.add(tweet);
  }

  private createButton(onClick: () => void): HTMLElement {
    const button = document.createElement('button');
    button.id = BUTTON_ID;
    button.innerHTML = this.getSVGIcon();
    button.style.cssText = `
      background-color: transparent;
      border: none;
      cursor: pointer;
      padding: 8px;
      border-radius: 9999px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s;
    `;

    button.addEventListener('mouseenter', () => {
      button.style.backgroundColor = 'rgba(29, 155, 240, 0.1)';
    });

    button.addEventListener('mouseleave', () => {
      button.style.backgroundColor = 'transparent';
    });

    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      onClick();
    });

    return button;
  }

  private getSVGIcon(): string {
    return `
      <svg viewBox="0 0 24 24" width="18" height="18" fill="rgb(113, 118, 123)">
        <path d="M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm2 0v14h14V5H5zm2 2h10v2H7V7zm0 4h10v2H7v-2zm0 4h7v2H7v-2z"/>
      </svg>
    `;
  }
}
```

**Step 2: 提交按钮注入器**

```bash
git add src/content/button-injector.ts
git commit -m "feat: add button injector for tweet action bar"
```

---

## Task 6: 实现截图核心功能

**Files:**
- Create: `src/content/screenshot.ts`

**Step 1: 创建截图功能**

```typescript
import { toPng } from 'html-to-image';
import { cloneElementWithStyles } from '../utils/dom-helpers';

export class ScreenshotCapture {
  async capture(tweet: HTMLElement): Promise<string> {
    const clone = this.prepareClone(tweet);
    
    const container = this.createContainer(clone);
    document.body.appendChild(container);
    
    try {
      const dataUrl = await toPng(container, {
        pixelRatio: 2,
        quality: 1.0,
      });
      
      return dataUrl;
    } finally {
      document.body.removeChild(container);
    }
  }

  private prepareClone(tweet: HTMLElement): HTMLElement {
    const clone = cloneElementWithStyles(tweet);
    
    this.removeUnwantedElements(clone);
    this.adjustStyles(clone);
    
    return clone;
  }

  private removeUnwantedElements(clone: HTMLElement): void {
    const selectorsToRemove = [
      '[role="group"]',
      '[data-testid="caret"]',
      'button',
      '[aria-label*="Reply"]',
      '[aria-label*="Retweet"]',
      '[aria-label*="Like"]',
      '[aria-label*="Share"]',
    ];

    selectorsToRemove.forEach((selector) => {
      clone.querySelectorAll(selector).forEach((el) => el.remove());
    });
  }

  private adjustStyles(clone: HTMLElement): void {
    clone.style.backgroundColor = 'white';
    clone.style.padding = '20px';
    clone.style.borderRadius = '12px';
    clone.style.maxWidth = '600px';
    clone.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
  }

  private createContainer(content: HTMLElement): HTMLElement {
    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed;
      top: -9999px;
      left: -9999px;
      width: 600px;
      background: white;
      z-index: -9999;
    `;
    container.appendChild(content);
    return container;
  }
}
```

**Step 2: 提交截图功能**

```bash
git add src/content/screenshot.ts
git commit -m "feat: add screenshot capture using html-to-image"
```

---

## Task 7: 实现预览模态框

**Files:**
- Create: `src/ui/preview-modal.ts`
- Create: `src/ui/styles.css`

**Step 1: 创建预览模态框**

```typescript
import { copyImageToClipboard, downloadImage, generateFilename } from '../utils/image-helpers';

export class PreviewModal {
  private modal: HTMLElement | null = null;
  private shadow: ShadowRoot | null = null;

  show(imageDataUrl: string): void {
    this.modal = this.createModal(imageDataUrl);
    const shadowHost = document.createElement('div');
    this.shadow = shadowHost.attachShadow({ mode: 'closed' });
    this.shadow.appendChild(this.modal);
    document.body.appendChild(shadowHost);
  }

  close(): void {
    if (this.modal && this.modal.parentElement) {
      this.modal.parentElement.remove();
      this.modal = null;
      this.shadow = null;
    }
  }

  private createModal(imageDataUrl: string): HTMLElement {
    const modal = document.createElement('div');
    modal.className = 'xcapture-modal';
    
    modal.innerHTML = `
      <div class="xcapture-overlay"></div>
      <div class="xcapture-content">
        <div class="xcapture-header">
          <h2>截图预览</h2>
          <button class="xcapture-close">&times;</button>
        </div>
        <div class="xcapture-image-container">
          <img src="${imageDataUrl}" alt="Tweet Screenshot" />
        </div>
        <div class="xcapture-actions">
          <button class="xcapture-btn xcapture-copy">复制到剪贴板</button>
          <button class="xcapture-btn xcapture-download">下载图片</button>
        </div>
      </div>
    `;

    this.attachEventListeners(modal, imageDataUrl);
    this.injectStyles(modal);

    return modal;
  }

  private attachEventListeners(modal: HTMLElement, imageDataUrl: string): void {
    const closeBtn = modal.querySelector('.xcapture-close');
    const overlay = modal.querySelector('.xcapture-overlay');
    const copyBtn = modal.querySelector('.xcapture-copy');
    const downloadBtn = modal.querySelector('.xcapture-download');

    const handleClose = () => this.close();
    closeBtn?.addEventListener('click', handleClose);
    overlay?.addEventListener('click', handleClose);

    copyBtn?.addEventListener('click', async () => {
      const success = await copyImageToClipboard(imageDataUrl);
      if (success) {
        alert('图片已复制到剪贴板！');
        this.close();
      } else {
        alert('复制失败，请重试');
      }
    });

    downloadBtn?.addEventListener('click', () => {
      downloadImage(imageDataUrl, generateFilename());
      this.close();
    });
  }

  private injectStyles(modal: HTMLElement): void {
    const styles = `
      .xcapture-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      }

      .xcapture-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
      }

      .xcapture-content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border-radius: 16px;
        max-width: 90%;
        max-height: 90%;
        overflow: auto;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      }

      .xcapture-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
        border-bottom: 1px solid #e1e8ed;
      }

      .xcapture-header h2 {
        margin: 0;
        font-size: 20px;
        font-weight: 700;
      }

      .xcapture-close {
        background: none;
        border: none;
        font-size: 28px;
        cursor: pointer;
        color: #657786;
        padding: 0;
        line-height: 1;
      }

      .xcapture-close:hover {
        color: #1da1f2;
      }

      .xcapture-image-container {
        padding: 20px;
        max-height: 60vh;
        overflow: auto;
      }

      .xcapture-image-container img {
        max-width: 100%;
        height: auto;
        display: block;
      }

      .xcapture-actions {
        display: flex;
        gap: 12px;
        padding: 16px 20px;
        border-top: 1px solid #e1e8ed;
      }

      .xcapture-btn {
        flex: 1;
        padding: 12px 20px;
        border: none;
        border-radius: 9999px;
        font-size: 15px;
        font-weight: 700;
        cursor: pointer;
        transition: background-color 0.2s;
      }

      .xcapture-copy {
        background-color: #1da1f2;
        color: white;
      }

      .xcapture-copy:hover {
        background-color: #1a91da;
      }

      .xcapture-download {
        background-color: #14171a;
        color: white;
      }

      .xcapture-download:hover {
        background-color: #0f1316;
      }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    modal.appendChild(styleSheet);
  }
}
```

**Step 2: 创建样式文件**

```css
/* Styles for content script */
[data-testid="tweet"] {
  position: relative;
}
```

**Step 3: 提交预览模态框**

```bash
git add src/ui/preview-modal.ts src/ui/styles.css
git commit -m "feat: add preview modal with copy and download functionality"
```

---

## Task 8: 实现 Content Script 入口

**Files:**
- Create: `src/content/index.ts`

**Step 1: 创建 Content Script 入口**

```typescript
import { TweetDetector } from './tweet-detector';
import { ButtonInjector } from './button-injector';
import { ScreenshotCapture } from './screenshot';
import { PreviewModal } from '../ui/preview-modal';

class XCapture {
  private detector: TweetDetector;
  private injector: ButtonInjector;
  private capture: ScreenshotCapture;

  constructor() {
    this.detector = new TweetDetector();
    this.injector = new ButtonInjector();
    this.capture = new ScreenshotCapture();
  }

  async init(): Promise<void> {
    await this.detector.start((tweet) => {
      this.handleTweet(tweet);
    });
  }

  private handleTweet(tweet: HTMLElement): void {
    this.injector.inject(tweet, () => {
      this.handleScreenshot(tweet);
    });
  }

  private async handleScreenshot(tweet: HTMLElement): Promise<void> {
    try {
      const imageDataUrl = await this.capture.capture(tweet);
      const modal = new PreviewModal();
      modal.show(imageDataUrl);
    } catch (error) {
      console.error('Failed to capture screenshot:', error);
      alert('截图失败，请重试');
    }
  }
}

const xcapture = new XCapture();
xcapture.init();
```

**Step 2: 提交 Content Script 入口**

```bash
git add src/content/index.ts
git commit -m "feat: add content script entry point"
```

---

## Task 9: 创建构建脚本

**Files:**
- Modify: `package.json`

**Step 1: 添加构建脚本到 package.json**

在 `package.json` 的 `scripts` 部分添加：

```json
{
  "scripts": {
    "dev": "vite build --watch",
    "build": "vite build",
    "clean": "rm -rf dist"
  }
}
```

**Step 2: 测试构建**

```bash
npm run build
```

**Step 3: 提交构建配置**

```bash
git add package.json
git commit -m "chore: add build scripts"
```

---

## Task 10: 创建 README 文档

**Files:**
- Create: `README.md`

**Step 1: 创建 README**

```markdown
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
   - 选择项目的 `dist` 目录

### 生产模式

1. 构建生产版本
```bash
npm run build
```

2. 打包扩展
   - 在 `chrome://extensions/` 页面点击"打包扩展程序"
   - 选择 `dist` 目录

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

# 清理
npm run clean
```

## 许可证

MIT
```

**Step 2: 提交 README**

```bash
git add README.md
git commit -m "docs: add README with installation and usage instructions"
```

---

## Task 11: 创建占位图标

**Files:**
- Create: `assets/icon16.png`
- Create: `assets/icon48.png`
- Create: `assets/icon128.png`

**Step 1: 创建简单的占位图标**

```bash
# 使用 ImageMagick 创建简单的图标（如果已安装）
convert -size 16x16 xc:blue assets/icon16.png
convert -size 48x48 xc:blue assets/icon48.png
convert -size 128x128 xc:blue assets/icon128.png
```

或手动创建占位图标文件（临时使用任意图片）。

**Step 2: 提交图标**

```bash
git add assets/
git commit -m "chore: add placeholder icons"
```

---

## Task 12: 最终构建和测试

**Step 1: 清理并重新构建**

```bash
npm run clean
npm run build
```

**Step 2: 在 Chrome 中测试**

1. 打开 `chrome://extensions/`
2. 启用"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择 `dist` 目录
5. 访问 `https://x.com`
6. 测试功能：
   - 检查按钮是否正确显示
   - 点击按钮生成截图
   - 测试复制到剪贴板
   - 测试下载图片
   - 测试不同类型推文（纯文字、单图、多图）

**Step 3: 修复发现的问题**

记录并修复测试中发现的问题。

**Step 4: 最终提交**

```bash
git add -A
git commit -m "chore: final build and testing complete"
```

---

## 执行说明

按照上述任务顺序依次执行，每个任务完成后进行提交。遇到问题时，参考设计文档 `docs/plans/2026-03-06-xcapture-design.md`。

建议在开发过程中：
1. 使用 `npm run dev` 启动监听模式
2. 在 Chrome 扩展页面点击刷新按钮重新加载扩展
3. 刷新 x.com 页面测试更改
