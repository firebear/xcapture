# 📸 XCapture 素材制作完整指南

## 📋 素材清单

| 素材类型 | 尺寸 | 数量 | 文件名 | 状态 |
|---------|------|------|--------|------|
| 截图 1 | 1280x800 | 1张 | screenshot-1-main.png | ⏳ 待制作 |
| 截图 2 | 1280x800 | 1张 | screenshot-2-modal.png | ⏳ 待制作 |
| 截图 3 | 1280x800 | 1张 | screenshot-3-features.png | ⏳ 待制作 |
| 小宣传图 | 440x280 | 1张 | promo-small.png | ⏳ 待制作 |
| 大宣传图 | 920x680 | 1张 | promo-large.png | ⏳ 待制作 |

---

## 🎯 第一步：制作截图（使用模拟页面）

### 截图 1：主界面展示

**用途：** 展示推文操作栏中的相机按钮
**文件：** `mock-tweet.html`

**步骤：**
1. 在 Chrome 中打开 `store-assets/mock-tweet.html`
2. 按 `F12` 或 `⌘+Ctrl+F` 全屏浏览器
3. 按 `⌘+Shift+5` 打开截图工具
4. 选择 "Capture Selected Portion"（捕获选定部分）
5. 选择整个推文区域（包含操作栏）
6. 截图自动保存到桌面

**优化：**
- 使用 Chrome DevTools 设置精确尺寸：
  - 按 `⌘+Option+I` 打开开发者工具
  - 按 `⌘+Shift+M` 切换设备工具栏
  - 设置尺寸为 1280x800
  - 截图

### 截图 2：模态框预览

**用途：** 展示截图预览界面
**文件：** `mock-modal.html`

**步骤：**
1. 在 Chrome 中打开 `store-assets/mock-modal.html`
2. 全屏浏览器
3. 使用截图工具捕获模态框
4. 保存为 `screenshot-2-modal.png`

### 截图 3：功能展示

**用途：** 展示扩展的核心功能
**文件：** `mock-features.html`

**步骤：**
1. 在 Chrome 中打开 `store-assets/mock-features.html`
2. 全屏浏览器
3. 截取整个页面
4. 保存为 `screenshot-3-features.png`

---

## 🎨 第二步：制作宣传图（使用 Canva）

### 小宣传图（440x280）

**访问 Canva：**
1. 打开 https://www.canva.com
2. 登录或注册（免费）
3. 点击 "Create a design"（创建设计）
4. 选择 "Custom dimensions"（自定义尺寸）
5. 输入 `440` 宽度，`280` 高度
6. 点击 "Create new design"（创建新设计）

**设计内容：**

**英文版（主要）：**
```
主标题：📸 XCapture
副标题：X.com Tweet Screenshot Tool
描述：One-click capture • Preserve styling • Easy to share

[左侧] 扩展图标（使用你已有的 icon128.png）
[右侧] 小尺寸截图预览（使用截图 1 的缩略图）
```

**中文版（辅助）：**
```
主标题：📸 XCapture
副标题：X.com 推文截图工具
描述：一键截图 · 保持样式 · 轻松分享

[左侧] 扩展图标
[右侧] 小尺寸截图预览
```

**设计要点：**
- 使用白色背景
- 主色调：#1da1f2（X.com 蓝色）
- 辅助色：#14171a（深灰）
- 字体：Inter, San Francisco, 或系统默认字体
- 简洁明了，文字少而精

**导出：**
1. 点击右上角 "Share"（分享）
2. 选择 "Download"（下载）
3. 选择 PNG 格式
4. 保存为 `promo-small.png`

---

### 大宣传图（920x680）

**创建新设计：**
1. 在 Canva 首页点击 "Create a design"
2. 选择 "Custom dimensions"
3. 输入 `920` 宽度，`680` 高度
4. 点击 "Create new design"

**设计内容：**

**英文版（主要）：**
```
[顶部]
主标题：📸 XCapture - The Easiest Way to Capture Tweets
副标题：One-click screenshot tool for X.com (Twitter)

[左侧] 功能列表：
✓ One-click screenshot from action bar
✓ Preserve original tweet styling
✓ Copy to clipboard or download
✓ Support multi-image tweets
✓ Privacy first - No data collection

[右侧] 大尺寸截图展示：
（使用截图 1 或截图 2，放大显示）

[底部]
标语：Free • No Ads • Privacy First
版本：Version 1.0.0
```

**中文版（辅助）：**
```
[顶部]
主标题：📸 XCapture - 最简单的推文截图方式
副标题：X.com (Twitter) 一键截图工具

[左侧] 功能列表：
✓ 从操作栏一键截图
✓ 保持推文原始样式
✓ 复制到剪贴板或下载
✓ 支持多图推文
✓ 隐私优先 - 不收集数据

[右侧] 大尺寸截图展示

[底部]
标语：免费 · 无广告 · 隐私优先
版本：版本 1.0.0
```

**设计要点：**
- 使用渐变背景（可选）：
  - 从 #667eea 到 #764ba2
  - 或纯白色背景
- 主色调：#1da1f2
- 左右布局：左侧文字，右侧截图
- 功能列表使用 ✓ 符号（对勾）
- 底部标语使用圆点（•）分隔

**导出：**
1. 点击 "Share" > "Download"
2. 选择 PNG 格式
3. 保存为 `promo-large.png`

---

## 📝 第三步：准备文字内容

### 商店简短描述（132 字符内）

**英文版：**
```
Capture beautiful screenshots of X.com tweets with one click. Preserve original styling and share easily.
```
（114 字符）

**中文版：**
```
一键截图 X.com 推文，保持原始样式，轻松分享。免费、无广告、隐私优先。
```
（45 字符）

---

### 商店详细描述

**英文版（主要）：**

```markdown
# 📸 XCapture - The Easiest Way to Capture Tweets

Capture beautiful screenshots of any X.com tweet with just one click. Perfect for sharing, documentation, or archiving your favorite tweets.

## ✨ Key Features

• **One-click screenshot** - Click the camera icon in any tweet's action bar
• **Preserve styling** - Keeps the original tweet look and feel
• **Copy or download** - Your choice: copy to clipboard or save as PNG
• **Multi-image support** - Works with tweets containing multiple images
• **Privacy first** - No data collection, everything happens locally

## 🚀 How to Use

1. Install the extension
2. Visit x.com
3. Find the camera icon (📷) in any tweet's action bar
4. Click to capture
5. Preview your screenshot
6. Copy or download - your choice!

## 💡 Perfect For

- Saving memorable tweets
- Sharing content on other platforms
- Creating documentation or presentations
- Archiving important discussions
- Social media management

## 🔒 Privacy & Security

- ✅ No data collection
- ✅ No external servers
- ✅ No user tracking
- ✅ Everything happens locally in your browser
- ✅ Open source code

## 🎨 Technical Details

- Built with Manifest V3 (latest Chrome extension standard)
- TypeScript for reliability
- Uses html-to-image library
- Lightweight and fast

## 📋 Requirements

- Chrome browser (version 88 or higher)
- X.com (Twitter) account (optional)

## 💬 Support

Have questions or feedback? Contact us at [your-email]

## 📄 License

MIT License - Open source and free forever

---

Made with ❤️ for the X.com community
```

**中文版（辅助）：**

```markdown
# 📸 XCapture - 最简单的推文截图方式

一键截图任何 X.com 推文，保持原始样式。适合分享、文档归档或保存喜欢的推文。

## ✨ 核心功能

• **一键截图** - 点击推文操作栏中的相机图标
• **保持样式** - 保留推文原始外观和感觉
• **复制或下载** - 复制到剪贴板或保存为 PNG
• **多图支持** - 支持包含多张图片的推文
• **隐私优先** - 不收集数据，一切在本地完成

## 🚀 如何使用

1. 安装扩展
2. 访问 x.com
3. 在推文操作栏找到相机图标（📷）
4. 点击截图
5. 预览截图
6. 复制或下载 - 你来选择！

## 💡 适用场景

- 保存难忘的推文
- 在其他平台分享内容
- 创建文档或演示
- 归档重要讨论
- 社交媒体管理

## 🔒 隐私与安全

- ✅ 不收集数据
- ✅ 不使用外部服务器
- ✅ 不跟踪用户
- ✅ 一切在浏览器本地完成
- ✅ 开源代码

## 🎨 技术细节

- 基于 Manifest V3（最新 Chrome 扩展标准）
- 使用 TypeScript 开发
- 使用 html-to-image 库
- 轻量级，速度快

## 📋 系统要求

- Chrome 浏览器（版本 88 或更高）
- X.com (Twitter) 账户（可选）

---

为 X.com 社区用心制作 ❤️
```

---

## ✅ 第四步：质量检查

### 截图检查清单

- [ ] 尺寸正确（1280x800 或 640x400）
- [ ] 文字清晰可读
- [ ] 颜色准确（X.com 深色主题）
- [ ] 相机按钮清晰可见
- [ ] 没有个人隐私信息

### 宣传图检查清单

- [ ] 尺寸正确（440x280 或 920x680）
- [ ] 文字拼写正确
- [ ] 颜色搭配和谐
- [ ] 图标清晰
- [ ] 整体风格简洁专业
- [ ] 中英文内容一致

---

## 📦 第五步：整理素材

### 文件命名规范

```
store-assets/
├── screenshots/
│   ├── screenshot-1-main.png         (1280x800)
│   ├── screenshot-2-modal.png        (1280x800)
│   └── screenshot-3-features.png     (1280x800)
├── promo/
│   ├── promo-small.png              (440x280)
│   └── promo-large.png              (920x680)
└── mock-pages/
    ├── mock-tweet.html
    ├── mock-modal.html
    └── mock-features.html
```

### 创建文件夹

```bash
mkdir -p store-assets/screenshots
mkdir -p store-assets/promo
```

---

## 🎯 第六步：验证最终素材

### 使用 macOS 预览验证

1. 打开 Finder
2. 导航到 `store-assets/screenshots/`
3. 选中所有截图
4. 按 `Space` 键预览
5. 检查尺寸和清晰度

### 使用 sips 验证尺寸

```bash
# 检查截图尺寸
sips -g pixelWidth -g pixelHeight store-assets/screenshots/*.png

# 检查宣传图尺寸
sips -g pixelWidth -g pixelHeight store-assets/promo/*.png
```

---

## 📋 完成清单

- [ ] 截图 1（主界面）已完成
- [ ] 截图 2（模态框）已完成
- [ ] 截图 3（功能展示）已完成
- [ ] 小宣传图已完成
- [ ] 大宣传图已完成
- [ ] 所有素材已验证尺寸
- [ ] 所有素材已检查质量
- [ ] 素材已整理到正确文件夹
- [ ] 已准备好上传到 Chrome 商店

---

## 🆘 需要帮助？

如果在制作过程中遇到问题：

1. **截图问题**：
   - 确保使用 Chrome 浏览器
   - 使用无痕模式避免插件干扰
   - 使用 DevTools 设置精确尺寸

2. **Canva 问题**：
   - 参考 Canva 官方教程
   - 使用模板快速开始
   - 导出时选择 PNG 格式

3. **设计问题**：
   - 保持简洁
   - 少即是多
   - 功能优先于装饰

---

## 🎉 完成后

一旦所有素材准备完毕：

1. 运行验证命令检查尺寸
2. 预览所有素材
3. 告诉我"素材已完成"
4. 我们将进入下一阶段：代码准备和版本发布

---

**预估时间：** 2-3 小时（不着急，慢慢做）

**提示：** 素材质量直接影响商店转化率，值得花时间做好！
