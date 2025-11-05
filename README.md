# LinkedIn Safe Co-Pilot

> AI-powered resume optimization Chrome extension for LinkedIn profiles

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-green.svg)](https://developer.chrome.com/docs/extensions/)
[![React](https://img.shields.io/badge/React-19.1-61dafb.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)

---

## 📋 Project Overview

**LinkedIn Safe Co-Pilot** is a browser extension that fully complies with Chrome Web Store privacy and security policies. It leverages **Google Gemini API** to securely analyze users' resumes and target job descriptions on the client side, providing high-quality AI optimization suggestions to help users stand out in job hunting.

### Core Features

- 🔒 **Privacy First**: PDF resumes processed locally, never uploaded
- 🎯 **AI Powered**: Google Gemini 2.5 Flash provides intelligent optimization
- ✅ **Fully Compliant**: Meets Chrome Store policies and Manifest V3
- 🚀 **Google Ecosystem**: Firebase AI Logic securely proxies API keys
- 💼 **STAR Method**: Professional career advisor-level optimization suggestions
- 🔄 **Flexible AI Options**: Switch between different AI providers in settings

---

## ✨ Features

### 1. 📋 Three Input Modes

#### 🟢 Manual Input (Recommended)
- The safest and most compliant method
- Directly paste resume content
- Suitable for all scenarios

#### 🔵 PDF Upload (Safe)
- Client-side PDF file parsing (using PDF.js)
- Real-time parsing progress display
- Supports files up to 5MB
- Fully local processing, no upload

#### 🟡 LinkedIn Snapshot (Experimental)
- ⚠️ **For demonstration purposes only**
- Analyzes screenshots using Gemini Vision API
- Automatic OCR for page content recognition
- **Requires explicit disclaimer consent**
- Not recommended for production environment

### 2. 🤖 AI Intelligent Optimization
- **STAR Method** (Situation, Task, Action, Result)
- Quantifiable achievement-oriented
- Job description keyword matching
- Professional verb and terminology optimization
- 3-5 refined optimization suggestions

### 3. 🔧 Customizable AI Settings
- **Multiple AI Provider Support**: Switch between different AI services
- **Custom API Configuration**: Use your own API keys for various AI platforms
- **Flexible Model Selection**: Choose from different AI models based on your needs
- **Settings Management**: Easy-to-use interface for managing AI provider preferences
- Compatible with:
  - Google Gemini (default)
  - OpenAI GPT
  - Anthropic Claude
  - Other compatible AI services

### 4. 🔐 Privacy Protection
- Prominent disclosure before first use
- User consent mechanism
- Data only sent to selected AI API
- Completely transparent privacy terms
- Additional disclaimer for screenshot function

### 5. 💎 Excellent Experience
- LinkedIn-style UI design
- One-click copy optimization results
- Elegant loading animations
- Smart status indicators (success/error/waiting)
- Responsive layout
- Intelligent multi-mode switching

---

## 🛠️ Tech Stack

### Frontend Framework
- **React 19.1.1** - Latest UI library
- **TypeScript 5.9.3** - Type safety
- **Tailwind CSS 4.1.16** - Modern styling
- **Vite 7.1.7** - Lightning-fast build tool

### Chrome Extension
- **Manifest V3** - Latest extension specification
- **@crxjs/vite-plugin 2.2.1** - Automated build and hot reload

### AI Services
- **Firebase 12.4.0** - Firebase AI SDK
- **Google Gemini 2.5 Flash** - Latest AI model (default)
- **Firebase AI Logic** - Secure API proxy
- **Multi-provider Support** - OpenAI, Anthropic, and more

### Utility Libraries
- **PDF.js** - Client-side PDF parsing
- **@types/chrome** - Chrome extension type definitions

---

## 🚀 Quick Start

### Requirements

- Node.js >= 18.0.0
- npm >= 9.0.0
- Chrome/Chromium browser

### Installation Steps

1. **Clone the project**
```bash
git clone https://github.com/zkkken/linkedin-copilot.git
cd linkedin-copilot
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure Firebase**

Fill in your Firebase configuration in `src/firebase.ts`:
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

4. **Development mode**
```bash
npm run dev
```

5. **Load extension**
   - Visit `chrome://extensions`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the project's `dist/` folder

### Production Build

```bash
npm run build
```

The build output is in the `dist/` directory, ready to be packaged and uploaded to Chrome Web Store.

---

## 📁 Project Structure

```
linkedin-copilot/
├── src/
│   ├── components/                 # React components
│   │   ├── FileUpload.tsx          # PDF upload component
│   │   ├── PrivacyConsent.tsx      # AI privacy consent dialog
│   │   ├── ScreenshotDisclaimer.tsx # Screenshot disclaimer dialog
│   │   ├── InputModeSelector.tsx   # Input mode selector
│   │   ├── SectionSelector.tsx     # Field type selector
│   │   ├── CopyButton.tsx          # Copy button
│   │   ├── LoadingSpinner.tsx      # Loading animation
│   │   ├── CharacterCount.tsx      # Character counter
│   │   └── UserGuide.tsx           # User guide
│   ├── utils/
│   │   ├── pdfParser.ts            # PDF parsing utility
│   │   ├── screenshotCapture.ts    # Screenshot capture utility
│   │   ├── promptTemplates.ts      # AI prompt templates
│   │   └── sectionConfigs.ts       # Section configurations
│   ├── types/
│   │   └── index.ts                # TypeScript type definitions
│   ├── App.tsx                     # Main application component
│   ├── firebase.ts                 # Firebase + Vision API configuration
│   ├── main.tsx                    # Application entry point
│   └── index.css                   # Global styles
├── public/
│   └── pdf.worker.min.mjs          # PDF.js Worker
├── .claude/
│   └── CLAUDE.md                   # Complete development guide
├── manifest.json                   # Chrome extension config (Manifest V3)
├── vite.config.ts                  # Vite build configuration
├── tailwind.config.js              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript configuration
└── package.json                    # Project dependencies
```

---

## 📖 User Guide

### Choose Input Mode

After opening the extension, first select one of three input modes:

#### Mode 1: 🟢 Manual Input (Recommended)

1. Select "Manual Input" mode
2. Paste your resume content in the text box
3. (Optional) Add target job description
4. Click "✨ Optimize with Gemini AI"
5. Copy optimized results to LinkedIn

#### Mode 2: 🔵 PDF Upload (Safe)

1. Select "PDF Upload" mode
2. Click "Upload PDF Resume" button
3. Select your resume file (max 5MB)
4. Wait for automatic parsing to complete
5. (Optional) Add target job description
6. Click "✨ Optimize with Gemini AI"
7. Copy optimized results to LinkedIn

#### Mode 3: 🟡 LinkedIn Snapshot (Experimental)

⚠️ **Important Notice**: This feature is for technical demonstration only, not recommended for actual use.

1. Select "LinkedIn Snapshot" mode
2. Open your LinkedIn profile page
3. Click "📸 Capture LinkedIn Page"
4. Read and agree to the disclaimer
5. Wait for Gemini Vision API to analyze the screenshot
6. View OCR recognition results and optimization suggestions

**Must Read Before Use**:
- ⚠️ May violate LinkedIn Terms of Service
- ⚠️ Only use on your own page
- ⚠️ Do not use for commercial purposes
- ⚠️ We are not responsible for account issues
- ✅ Manual input or PDF upload recommended

### Configure AI Settings

Access the settings to customize your AI provider:

1. Click the settings icon in the extension
2. Choose from available AI providers:
   - Google Gemini (default)
   - OpenAI GPT
   - Anthropic Claude
   - Custom API endpoint
3. Enter your API key for the selected provider
4. Save and start using your preferred AI service

### Privacy Consent

When using any AI feature for the first time, a privacy consent window will appear. Please read carefully and click "I Agree".

---

## ⚠️ Disclaimer

### Screenshot Function (LinkedIn Snapshot)

**This feature is for educational and technical demonstration purposes only.**

#### Risk Warning

1. **Terms of Service Risk**
   - Using screenshot feature may violate LinkedIn's Terms of Service
   - LinkedIn prohibits using automated tools to access or scrape their service
   - Although screenshots are user-initiated, there's still a gray area

2. **Account Security**
   - We are not responsible for account issues caused by using this feature
   - LinkedIn has the right to suspend or terminate accounts violating their terms
   - Recommend only using in test environments or personal pages

3. **Data Privacy**
   - Screenshots will include all visible information on the page
   - Data will be sent to selected AI Vision API via secure proxy
   - While not stored, it will be processed during transmission

#### Recommended Usage

✅ **Hackathon Demo Review**: As a technical capability showcase
✅ **Local Development Testing**: Testing in developer mode
✅ **Educational Purposes**: Learning Vision API integration
❌ **Production Environment**: Do not use in actual job hunting
❌ **Others' Pages**: Do not capture others' LinkedIn pages
❌ **Commercial Use**: Do not use for any commercial purposes

#### Legal Statement

By using the screenshot feature, you:
- Have read and understand the above risks
- Agree to bear all usage risks
- Confirm use only for demonstration and educational purposes
- Understand this feature is not suitable for production environment

---

## 🔐 Privacy & Security

### Data Processing Flow

1. **PDF Files**: 100% processed in local browser, never uploaded to any server
2. **Text Content**: Only sent to selected AI API for analysis
3. **Screenshot Data**: Only sent to AI Vision API (requires additional consent)
4. **API Keys**: Securely proxied through configured service, not exposed in frontend
5. **Storage**: Only stores user consent status (chrome.storage.local)

### Chrome Store Compliance

- ✅ Manifest V3 specification
- ✅ Prominent Disclosure
- ✅ Principle of least privilege
- ✅ Privacy policy link
- ✅ User consent mechanism
- ✅ Data transparency
- ⚠️ Screenshot feature requires additional declaration

---

## 🧪 Development Guide

### Available Scripts

```bash
# Development mode (hot reload)
npm run dev

# Production build
npm run build

# Code linting
npm run lint

# Preview build
npm run preview
```

### Code Standards

- **TypeScript**: Strict mode, complete type definitions
- **ESLint**: Code quality checking
- **Prettier**: Code formatting (recommended)
- **Component-based**: Single responsibility principle

### Directory Description

- `src/components/` - Reusable UI components
- `src/utils/` - Utility functions
- `.claude/` - Development documentation and guides
- `public/` - Static assets

---

## 🐛 Troubleshooting

### PDF Parsing Failed

**Issue**: "Failed to fetch worker"

**Solution**:
1. Ensure `public/pdf.worker.min.mjs` file exists
2. Check `web_accessible_resources` in `manifest.json`
3. Rebuild and reload extension

### AI Call Failed

**Issue**: "API quota exhausted"

**Solution**:
1. Check API quota in your provider's console
2. Wait for quota reset (usually a few minutes)
3. Upgrade plan if needed

### Privacy Dialog Not Showing

**Issue**: Already consented but want to retest

**Solution**:
```javascript
// Execute in developer tools console
chrome.storage.local.remove(['privacyConsentGiven', 'consentTimestamp']);
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork this repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Commit Convention

Use Conventional Commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation update
- `style:` Code formatting
- `refactor:` Refactoring
- `test:` Testing
- `chore:` Build/tools

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Google Gemini](https://ai.google.dev/) - AI model support
- [Firebase](https://firebase.google.com/) - Backend services
- [PDF.js](https://mozilla.github.io/pdf.js/) - PDF parsing
- [React](https://reactjs.org/) - UI framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework
- [Vite](https://vitejs.dev/) - Build tool

---

## 📞 Contact

- **Project URL**: [GitHub](https://github.com/zkkken/linkedin-copilot)
- **Issue Tracker**: [Issues](https://github.com/zkkken/linkedin-copilot/issues)
- **Email**: zkken0329@gmail.com

<p align="center">
  Made with ❤️ for Google Hackathon
</p>

<p align="center">
  <strong>LinkedIn Safe Co-Pilot</strong> - Make Your Resume Stand Out ✨
</p>
