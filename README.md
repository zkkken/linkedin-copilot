# LinkedIn Safe Co-Pilot

> AI-powered resume optimization Chrome extension for LinkedIn profiles

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-green.svg)](https://developer.chrome.com/docs/extensions/)
[![React](https://img.shields.io/badge/React-19.1-61dafb.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)

---

## 📋 项目概览

**LinkedIn Safe Co-Pilot** 是一个完全符合 Chrome 网上应用店隐私和安全政策的浏览器扩展。它利用 **Google Gemini API**，在客户端安全地分析用户的简历和目标职位描述，提供高质量的 AI 优化建议，帮助用户在求职中脱颖而出。

### 核心特点

- 🔒 **隐私优先**: PDF 简历在本地处理，绝不上传
- 🎯 **AI 驱动**: Google Gemini 2.5 Flash 提供智能优化
- ✅ **完全合规**: 符合 Chrome 商店政策和 Manifest V3
- 🚀 **谷歌生态**: Firebase AI Logic 安全代理 API 密钥
- 💼 **STAR 方法**: 专业的职业顾问级别优化建议

---

## ✨ 功能特性

### 1. 📋 三种输入模式

#### 🟢 手动输入（推荐）
- 最安全、最合规的方式
- 直接粘贴简历内容
- 适用于所有场景

#### 🔵 PDF 上传（安全）
- 客户端 PDF 文件解析（使用 PDF.js）
- 实时解析进度显示
- 支持最大 5MB 文件
- 完全本地处理，不上传

#### 🟡 LinkedIn 快照（实验性）
- ⚠️ **仅用于演示目的**
- 使用 Gemini Vision API 分析截图
- 自动 OCR 识别页面内容
- **需要明确同意免责声明**
- 不推荐用于生产环境

### 2. 🤖 AI 智能优化
- **STAR 方法**（Situation, Task, Action, Result）
- 可量化成就导向
- 职位描述关键词匹配
- 专业动词和术语优化
- 3-5 条精炼的优化建议

### 3. 🔐 隐私保护
- 首次使用前显著披露（Prominent Disclosure）
- 用户同意机制
- 数据仅发送至 Gemini API
- 完全透明的隐私条款
- 截图功能额外免责声明

### 4. 💎 优秀体验
- LinkedIn 风格 UI 设计
- 一键复制优化结果
- 优雅的加载动画
- 智能状态提示（成功/错误/等待）
- 响应式布局
- 多模式智能切换

---

## 🛠️ 技术栈

### 前端框架
- **React 19.1.1** - 最新 UI 库
- **TypeScript 5.9.3** - 类型安全
- **Tailwind CSS 4.1.16** - 现代化样式
- **Vite 7.1.7** - 闪电般的构建工具

### Chrome 扩展
- **Manifest V3** - 最新扩展规范
- **@crxjs/vite-plugin 2.2.1** - 自动化构建和热更新

### AI 服务
- **Firebase 12.4.0** - Firebase AI SDK
- **Google Gemini 2.5 Flash** - 最新 AI 模型
- **Firebase AI Logic** - 安全 API 代理

### 工具库
- **PDF.js** - 客户端 PDF 解析
- **@types/chrome** - Chrome 扩展类型定义

---

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0
- Chrome/Chromium 浏览器

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/zkkken/linkedin-copilot.git
cd linkedin-copilot
```

2. **安装依赖**
```bash
npm install
```

3. **配置 Firebase**

在 `src/firebase.ts` 中填入你的 Firebase 配置：
```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

4. **开发模式**
```bash
npm run dev
```

5. **加载扩展**
   - 访问 `chrome://extensions`
   - 启用"开发者模式"
   - 点击"加载已解压的扩展程序"
   - 选择项目的 `dist/` 文件夹

### 生产构建

```bash
npm run build
```

构建产物在 `dist/` 目录，可直接打包上传到 Chrome 商店。

---

## 📁 项目结构

```
linkedin-copilot/
├── src/
│   ├── components/                 # React 组件
│   │   ├── FileUpload.tsx          # PDF 上传组件
│   │   ├── PrivacyConsent.tsx      # AI 隐私同意弹窗
│   │   ├── ScreenshotDisclaimer.tsx # 截图免责声明弹窗
│   │   ├── InputModeSelector.tsx   # 输入模式选择器
│   │   ├── SectionSelector.tsx     # 字段类型选择器
│   │   ├── CopyButton.tsx          # 复制按钮
│   │   ├── LoadingSpinner.tsx      # 加载动画
│   │   ├── CharacterCount.tsx      # 字符计数
│   │   └── UserGuide.tsx           # 用户引导
│   ├── utils/
│   │   ├── pdfParser.ts            # PDF 解析工具
│   │   ├── screenshotCapture.ts    # 截图捕获工具
│   │   ├── promptTemplates.ts      # AI 提示词模板
│   │   └── sectionConfigs.ts       # 字段配置
│   ├── types/
│   │   └── index.ts                # TypeScript 类型定义
│   ├── App.tsx                     # 主应用组件
│   ├── firebase.ts                 # Firebase + Vision API 配置
│   ├── main.tsx                    # 应用入口
│   └── index.css                   # 全局样式
├── public/
│   └── pdf.worker.min.mjs          # PDF.js Worker
├── .claude/
│   └── CLAUDE.md                   # 完整开发指南
├── manifest.json                   # Chrome 扩展配置（Manifest V3）
├── vite.config.ts                  # Vite 构建配置
├── tailwind.config.js              # Tailwind CSS 配置
├── tsconfig.json                   # TypeScript 配置
└── package.json                    # 项目依赖
```

---

## 📖 使用指南

### 选择输入模式

打开扩展后，首先选择三种输入模式之一：

#### 模式 1: 🟢 手动输入（推荐）

1. 选择"手动输入"模式
2. 在文本框中粘贴你的简历内容
3. （可选）添加目标职位描述
4. 点击"✨ 使用 Gemini AI 优化"
5. 复制优化结果到 LinkedIn

#### 模式 2: 🔵 PDF 上传（安全）

1. 选择"PDF上传"模式
2. 点击"上传 PDF 简历"按钮
3. 选择你的简历文件（最大 5MB）
4. 等待自动解析完成
5. （可选）添加目标职位描述
6. 点击"✨ 使用 Gemini AI 优化"
7. 复制优化结果到 LinkedIn

#### 模式 3: 🟡 LinkedIn 快照（实验性）

⚠️ **重要声明**：此功能仅用于技术演示，不推荐实际使用。

1. 选择"LinkedIn快照"模式
2. 打开你的 LinkedIn 个人资料页面
3. 点击"📸 捕获 LinkedIn 页面"
4. 阅读并同意免责声明
5. 等待 Gemini Vision API 分析截图
6. 查看 OCR 识别结果和优化建议

**使用前必读**：
- ⚠️ 可能违反 LinkedIn 服务条款
- ⚠️ 仅在你自己的页面使用
- ⚠️ 不要用于商业目的
- ⚠️ 我们不对账号问题负责
- ✅ 推荐使用手动输入或 PDF 上传

### 隐私同意

首次使用任何 AI 功能时会弹出隐私同意窗口，请仔细阅读并点击"我同意"。

---

## ⚠️ 免责声明

### 截图功能（LinkedIn 快照）

**本功能仅供教育和技术演示目的。**

#### 风险提示

1. **服务条款风险**
   - 使用截图功能可能违反 LinkedIn 的服务条款
   - LinkedIn 禁止使用自动化工具访问或抓取其服务
   - 虽然截图是用户主动操作，但仍存在灰色地带

2. **账号安全**
   - 我们不对因使用此功能导致的账号问题负责
   - LinkedIn 有权暂停或终止违反其条款的账号
   - 建议仅在测试环境或个人页面使用

3. **数据隐私**
   - 截图会包含页面上的所有可见信息
   - 数据将通过 Firebase AI Logic 发送至 Google Gemini Vision API
   - 虽然不存储，但会在传输过程中处理

#### 推荐使用方式

✅ **Hackathon 评审演示**：作为技术能力展示
✅ **本地开发测试**：在开发者模式下测试
✅ **教育目的**：学习 Vision API 集成
❌ **生产环境**：不要在实际求职中使用
❌ **他人页面**：不要截取他人的 LinkedIn 页面
❌ **商业用途**：不要用于任何商业目的

#### 法律声明

使用截图功能即表示您：
- 已阅读并理解上述风险
- 同意自行承担所有使用风险
- 确认仅用于演示和教育目的
- 理解此功能不适合生产环境

---

## 🔐 隐私与安全

### 数据处理流程

1. **PDF 文件**: 100% 在本地浏览器中处理，不上传任何服务器
2. **文本内容**: 仅发送到 Google Gemini API 进行分析
3. **截图数据**: 仅发送至 Gemini Vision API（需额外同意）
4. **API 密钥**: 通过 Firebase AI Logic 安全代理，不暴露在前端
5. **存储**: 仅存储用户同意状态（chrome.storage.local）

### Chrome 商店合规

- ✅ Manifest V3 规范
- ✅ Prominent Disclosure（显著披露）
- ✅ 最小权限原则
- ✅ 隐私政策链接
- ✅ 用户同意机制
- ✅ 数据透明度
- ⚠️ 截图功能需额外声明

---

## 🎨 截图

### 主界面
![主界面](screenshots/main-interface.png)

### PDF 上传
![PDF上传](screenshots/pdf-upload.png)

### 隐私同意
![隐私同意](screenshots/privacy-consent.png)

### AI 优化结果
![优化结果](screenshots/optimization-result.png)

---

## 🧪 开发指南

### 可用脚本

```bash
# 开发模式（热更新）
npm run dev

# 生产构建
npm run build

# 代码检查
npm run lint

# 预览构建
npm run preview
```

### 代码规范

- **TypeScript**: 严格模式，完整类型定义
- **ESLint**: 代码质量检查
- **Prettier**: 代码格式化（推荐）
- **组件化**: 单一职责原则

### 目录说明

- `src/components/` - 可复用 UI 组件
- `src/utils/` - 工具函数
- `.claude/` - 开发文档和指南
- `public/` - 静态资源

---

## 📚 文档

详细文档请查看：

- [完整开发指南](.claude/claude.md)
- [PDF 解析功能](PDF_FEATURE.md)
- [隐私同意功能](PRIVACY_CONSENT.md)
- [第二天完成总结](DAY2_COMPLETION.md)

---

## 🐛 问题排查

### PDF 解析失败

**问题**: "Failed to fetch worker"

**解决**:
1. 确保 `public/pdf.worker.min.mjs` 文件存在
2. 检查 `manifest.json` 中的 `web_accessible_resources`
3. 重新构建并重新加载扩展

### AI 调用失败

**问题**: "API 配额已用完"

**解决**:
1. 检查 Firebase 控制台的 API 配额
2. 等待配额重置（通常几分钟）
3. 升级 Firebase 计划（如需要）

### 隐私弹窗不显示

**问题**: 已同意但想重新测试

**解决**:
```javascript
// 在开发者工具控制台执行
chrome.storage.local.remove(['privacyConsentGiven', 'consentTimestamp']);
```

---

## 🤝 贡献指南

欢迎贡献！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 提交规范

使用 Conventional Commits：
- `feat:` 新功能
- `fix:` 修复 bug
- `docs:` 文档更新
- `style:` 代码格式
- `refactor:` 重构
- `test:` 测试
- `chore:` 构建/工具

---

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

---

## 🙏 致谢

- [Google Gemini](https://ai.google.dev/) - AI 模型支持
- [Firebase](https://firebase.google.com/) - 后端服务
- [PDF.js](https://mozilla.github.io/pdf.js/) - PDF 解析
- [React](https://reactjs.org/) - UI 框架
- [Tailwind CSS](https://tailwindcss.com/) - 样式框架
- [Vite](https://vitejs.dev/) - 构建工具

---

## 📞 联系方式

- **项目地址**: [GitHub](https://github.com/yourusername/linkedin-copilot)
- **问题反馈**: [Issues](https://github.com/yourusername/linkedin-copilot/issues)
- **邮箱**: your.email@example.com

---

## 📊 项目状态

- **版本**: 2.0.0
- **状态**: ✅ 核心功能全部完成（含截图功能）
- **下一步**: 演示视频制作 + Devpost 提交

---

## 🗓️ 开发日志

### 第一天 ✅
- [x] 项目初始化（Vite + React + TypeScript）
- [x] Firebase AI Logic 集成
- [x] Gemini 2.5 Flash 模型接入
- [x] 基础 UI 实现
- [x] 端到端测试

### 第二天 ✅
- [x] PDF 客户端解析功能（PDF.js）
- [x] 隐私同意弹窗（Prominent Disclosure）
- [x] 高级提示工程（STAR 方法）
- [x] UI 改进（复制按钮、加载动画、字符计数）
- [x] 多字段类型支持（Headline/About/Experience/Skills）
- [x] 用户引导系统

### 第三天 ✅（当前）
- [x] **截图功能实现**
  - [x] 截图捕获工具（screenshotCapture.ts）
  - [x] Gemini Vision API 集成
  - [x] 输入模式选择器（三种模式）
  - [x] 截图免责声明弹窗
  - [x] LinkedIn 页面检测
  - [x] OCR 识别和分析
- [x] **完整的免责声明**
- [x] **构建测试通过**
- [x] **README 文档更新**

### 待完成 📅
- [ ] 录制演示视频（3分钟）
  - [ ] 演示三种输入模式
  - [ ] 展示截图功能（核心亮点）
  - [ ] 说明技术架构
- [ ] Devpost 提交
  - [ ] 项目描述
  - [ ] 技术说明
  - [ ] 演示视频链接
  - [ ] GitHub 仓库链接

---

<p align="center">
  Made with ❤️ for Google Hackathon
</p>

<p align="center">
  <strong>LinkedIn Safe Co-Pilot</strong> - 让你的简历脱颖而出 ✨
</p>
