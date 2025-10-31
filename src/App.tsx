import { useState, useEffect } from 'react';
// 1. 从我们刚刚更新的 firebase.ts 文件中导入 'model' 实例和截图分析函数
import { model, analyzeScreenshot } from './firebase';
import { FileUpload } from './components/FileUpload';
import { PrivacyConsent } from './components/PrivacyConsent';
import { CopyButton } from './components/CopyButton';
import { LoadingSpinner } from './components/LoadingSpinner';
import { SectionSelector } from './components/SectionSelector';
import { CharacterCount } from './components/CharacterCount';
import { UserGuide } from './components/UserGuide';
import { InputModeSelector, type InputMode } from './components/InputModeSelector';
import { ScreenshotDisclaimer } from './components/ScreenshotDisclaimer';
import { OptimizationResult } from './components/OptimizationResult';
import { generatePrompt, detectSectionType } from './utils/promptTemplates';
import { generateStructuredPrompt, parseStructuredResponse } from './utils/structuredPrompts';
import { getSectionConfig } from './utils/sectionConfigs';
import { captureCurrentTab, isLinkedInPage } from './utils/screenshotCapture';
import type { SectionType } from './types';

function App() {
  // 状态管理 (用于您的项目)
  const [resumeContent, setResumeContent] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [optimizedText, setOptimizedText] = useState('等待 AI 优化...');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');

  // 多字段支持状态
  const [currentSection, setCurrentSection] = useState<SectionType>('general');

  // 结构化优化结果状态
  const [structuredResult, setStructuredResult] = useState<any>(null);
  const useStructuredOutput = true; // 总是使用结构化输出

  // 隐私同意状态
  const [hasConsent, setHasConsent] = useState<boolean | null>(null); // null = 未检查, false = 未同意, true = 已同意
  const [showConsentModal, setShowConsentModal] = useState(false);

  // 用户引导状态
  const [showUserGuide, setShowUserGuide] = useState(false);

  // 输入模式状态
  const [inputMode, setInputMode] = useState<InputMode>('manual');

  // 截图功能状态
  const [showScreenshotDisclaimer, setShowScreenshotDisclaimer] = useState(false);
  const [isLinkedIn, setIsLinkedIn] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  // 检查用户是否是首次使用
  useEffect(() => {
    const hasSeenGuide = localStorage.getItem('hasSeenUserGuide');
    if (!hasSeenGuide) {
      // 首次使用，显示引导
      setShowUserGuide(true);
    }
  }, []);

  // 关闭用户引导并记录状态
  const handleCloseUserGuide = () => {
    setShowUserGuide(false);
    localStorage.setItem('hasSeenUserGuide', 'true');
  };

  // 处理 PDF 文本提取
  const handlePDFTextExtracted = (text: string, fileName: string) => {
    setResumeContent(text);
    setUploadedFileName(fileName);
    // 智能检测内容类型
    const detectedType = detectSectionType(text);
    setCurrentSection(detectedType);
    // 重置优化结果
    setOptimizedText('PDF 已解析，请点击优化按钮...');
  };

  // 处理字段类型变更
  const handleSectionChange = (newSection: SectionType) => {
    setCurrentSection(newSection);
    // 重置优化结果
    if (optimizedText && !optimizedText.includes('等待') && !optimizedText.includes('PDF')) {
      setOptimizedText('字段类型已更改，请重新优化...');
    }
  };

  // 处理隐私同意
  const handleConsentResponse = (agreed: boolean) => {
    setHasConsent(agreed);
    setShowConsentModal(false);

    if (agreed) {
      // 用户同意后，立即执行 AI 优化
      performOptimization();
    } else {
      // 用户拒绝
      setOptimizedText('您需要同意隐私条款才能使用 AI 优化功能。');
    }
  };

  // 执行 AI 优化（实际的 AI 调用）- 使用结构化提示
  const performOptimization = async () => {
    setIsLoading(true);
    const sectionConfig = getSectionConfig(currentSection);
    setOptimizedText(`正在为 ${sectionConfig.label} 生成优化建议...`);
    setStructuredResult(null);

    try {
      // 使用结构化prompt（返回JSON）
      const prompt = useStructuredOutput
        ? generateStructuredPrompt(currentSection, resumeContent, jobDescription)
        : generatePrompt(currentSection, resumeContent, jobDescription);

      console.log('使用的prompt类型:', useStructuredOutput ? '结构化' : '传统');

      // 使用导入的 'model' 实例调用 generateContent
      const result = await model.generateContent(prompt);

      // 从响应中获取优化的文本
      const response = result.response;
      const text = response.text();

      console.log('AI原始响应:', text);

      if (useStructuredOutput) {
        // 解析结构化JSON响应
        const parsedData = parseStructuredResponse(text, currentSection);
        console.log('解析后的数据:', parsedData);

        setStructuredResult(parsedData);
        setOptimizedText(''); // 清空旧的文本格式

      } else {
        // 传统文本格式
        const formattedText = text
          .trim()
          .split('\n')
          .filter(line => line.trim())
          .map(line => line.trim())
          .join('\n');

        setOptimizedText(formattedText || text);
        setStructuredResult(null);
      }

    } catch (error) {
      console.error("AI Logic 调用失败:", error);
      setStructuredResult(null);

      if (error instanceof Error) {
        if (error.message.includes('quota') || error.message.includes('429')) {
          setOptimizedText('⚠️ API 配额已用完，请稍后再试。\n\n如果您刚刚创建 Firebase 项目，请等待几分钟后重试。');
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          setOptimizedText('⚠️ 网络连接失败，请检查网络连接后重试。');
        } else {
          setOptimizedText(`⚠️ AI 优化失败: ${error.message}\n\n请确保您已在 Firebase 控制台中启用了 AI Logic 服务。`);
        }
      } else {
        setOptimizedText('⚠️ AI 优化失败。请确保您已在 Firebase 控制台中启用了 AI Logic 服务，并检查网络连接。');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 核心调用函数 (已更新 - 检查同意状态)
  const handleOptimize = async () => {
    if (!resumeContent.trim()) {
      alert('请输入简历内容！');
      return;
    }

    // 检查是否已同意隐私条款
    if (hasConsent === true) {
      // 已同意，直接执行优化
      performOptimization();
    } else {
      // 未同意或未检查，显示同意弹窗
      setShowConsentModal(true);
    }
  };

  // 处理截图按钮点击
  const handleScreenshotClick = async () => {
    // 检查是否在 LinkedIn 页面
    const isOnLinkedIn = await isLinkedInPage();
    setIsLinkedIn(isOnLinkedIn);

    // 显示免责声明
    setShowScreenshotDisclaimer(true);
  };

  // 处理截图免责声明的同意结果
  const handleScreenshotConsent = async (agreed: boolean) => {
    setShowScreenshotDisclaimer(false);

    if (!agreed) {
      setOptimizedText('您已取消截图功能。建议使用手动输入或 PDF 上传模式。');
      return;
    }

    // 用户同意，开始截图和分析
    await performScreenshotCapture();
  };

  // 执行截图捕获和分析
  const performScreenshotCapture = async () => {
    setIsCapturing(true);
    setIsLoading(true);
    setOptimizedText('正在捕获截图...');

    try {
      // 1. 捕获截图
      const captureResult = await captureCurrentTab();
      setOptimizedText('截图已捕获，正在通过 Gemini Vision API 分析...');

      // 2. 生成分析提示词
      const visionPrompt = `
请仔细分析这张 LinkedIn 个人资料页面的截图。

任务：
1. 使用 OCR 技术识别图片中的所有文字内容
2. 提取关键的个人资料信息，包括：
   - 标题/职位 (Headline)
   - 关于/简介 (About)
   - 工作经验 (Experience)
   - 技能 (Skills)
3. 识别当前展示的主要部分是什么

请按以下格式输出（如果某个部分不可见，则省略）：

**识别的内容类型**: [标题/关于/经验/技能]

**提取的文本**:
[原文内容]

**优化建议**:
[针对该内容的 3-5 条具体优化建议，使用 STAR 方法]

注意：
- 请尽可能准确地识别文字
- 如果图片模糊或无法识别，请明确说明
- 优化建议要具体、可操作
`;

      // 3. 调用 Vision API 分析
      const analysisResult = await analyzeScreenshot(captureResult.dataUrl, visionPrompt);

      // 4. 显示结果
      setOptimizedText(analysisResult);

      // 5. 可选：尝试提取文本到输入框
      // 这里可以添加逻辑将识别的文本填充到 resumeContent
      // 暂时先显示在结果区域

    } catch (error) {
      console.error('截图分析失败:', error);
      if (error instanceof Error) {
        if (error.message.includes('权限')) {
          setOptimizedText('⚠️ 截图失败：缺少必要权限。\n\n请确保已授予扩展"捕获可见标签页"的权限。');
        } else if (error.message.includes('quota') || error.message.includes('429')) {
          setOptimizedText('⚠️ API 配额已用完，请稍后再试。');
        } else {
          setOptimizedText(`⚠️ 截图分析失败: ${error.message}\n\n建议使用手动输入或 PDF 上传模式。`);
        }
      } else {
        setOptimizedText('⚠️ 截图分析失败。建议使用手动输入或 PDF 上传模式。');
      }
    } finally {
      setIsCapturing(false);
      setIsLoading(false);
    }
  };

  // 处理输入模式切换
  const handleInputModeChange = (mode: InputMode) => {
    setInputMode(mode);

    if (mode === 'screenshot') {
      // 切换到截图模式，清空之前的内容提示
      setOptimizedText('请点击下方「📸 捕获 LinkedIn 页面」按钮开始分析...');
    } else if (mode === 'manual') {
      setOptimizedText('请输入或粘贴简历内容，然后点击优化按钮...');
    } else if (mode === 'pdf') {
      setOptimizedText('请上传 PDF 文件或手动输入内容...');
    }
  };

  // 您的 UI 保持不变，因为它符合您的项目需求
  return (
    <>
      {/* 用户引导弹窗 */}
      {showUserGuide && <UserGuide onClose={handleCloseUserGuide} />}

      {/* 隐私同意弹窗 */}
      {showConsentModal && <PrivacyConsent onConsent={handleConsentResponse} />}

      {/* 截图免责声明弹窗 */}
      {showScreenshotDisclaimer && (
        <ScreenshotDisclaimer
          onConsent={handleScreenshotConsent}
          isLinkedInPage={isLinkedIn}
        />
      )}

      <div className="p-5 w-[420px] font-sans max-h-[600px] overflow-y-auto bg-gradient-to-b from-white to-gray-50">
        {/* 头部 - LinkedIn 风格 */}
        <div className="mb-6 pb-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">LinkedIn Safe Co-Pilot</h1>
                <p className="text-xs text-gray-500">AI-powered resume optimization</p>
              </div>
            </div>
            {/* 帮助按钮 */}
            <button
              onClick={() => setShowUserGuide(true)}
              className="p-2 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all"
              title="查看使用指南"
              aria-label="查看使用指南"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>

      {/* 输入模式选择器 */}
      <InputModeSelector
        selectedMode={inputMode}
        onModeChange={handleInputModeChange}
        disabled={isLoading}
      />

      {/* 根据输入模式显示不同的输入方式 */}
      {inputMode === 'pdf' && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              📄 上传 PDF 简历
            </label>
            <span className="text-xs text-green-600 font-semibold">✓ 安全</span>
          </div>
          <p className="text-xs text-gray-500 mb-2">
            文件在本地解析，数据不会上传。上传后将自动提取文本，AI会智能识别内容类型
          </p>
          <FileUpload
            onTextExtracted={handlePDFTextExtracted}
            disabled={isLoading}
          />
        </div>
      )}

      {inputMode === 'screenshot' && (
        <div className="mb-4">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-purple-900 flex items-center">
                <span className="text-2xl mr-2">📸</span>
                LinkedIn 页面截图分析
              </h3>
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-bold">
                实验性
              </span>
            </div>

            <p className="text-xs text-purple-700 mb-3">
              使用 Gemini Vision API 直接分析您的 LinkedIn 页面截图，自动提取内容并提供优化建议。
            </p>

            <button
              onClick={handleScreenshotClick}
              disabled={isLoading || isCapturing}
              className={`w-full py-3 px-4 rounded-lg text-sm font-semibold transition-all shadow-md flex items-center justify-center space-x-2 ${
                isLoading || isCapturing
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 active:scale-98'
              }`}
            >
              {isCapturing ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>分析中...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>📸 捕获 LinkedIn 页面</span>
                </>
              )}
            </button>

            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
              ⚠️ 使用前请阅读免责声明。推荐在您自己的 LinkedIn 个人资料页面使用。
            </div>
          </div>
        </div>
      )}

      {inputMode === 'manual' && (
        <div className="mb-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-xs text-green-800 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <strong>推荐模式</strong> - 最安全、最合规的输入方式
            </p>
          </div>
        </div>
      )}

      {/* 字段类型选择器 */}
      <SectionSelector
        selectedSection={currentSection}
        onSectionChange={handleSectionChange}
        disabled={isLoading}
      />

      {/* 动态内容输入框 */}
      {(() => {
        const config = getSectionConfig(currentSection);
        return (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                {config.icon} {config.label}
                {uploadedFileName && <span className="text-xs text-green-600 ml-2">(已从 PDF 提取)</span>}
              </label>
            </div>
            <p className="text-xs text-gray-500 mb-2">{config.description}</p>
            <textarea
              value={resumeContent}
              onChange={(e) => setResumeContent(e.target.value)}
              rows={config.rows}
              maxLength={config.maxLength}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder={config.placeholder}
            />
            {/* 字符计数 */}
            <CharacterCount content={resumeContent} sectionType={currentSection} />
          </div>
        );
      })()}

      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            🎯 目标职位描述
          </label>
          <span className="text-xs text-gray-500">可选 - 推荐添加</span>
        </div>
        <p className="text-xs text-gray-500 mb-2">
          添加职位描述后，AI 将提取关键词并融入优化建议，提升 ATS 匹配度
        </p>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          placeholder="例如：我们正在寻找一位经验丰富的软件工程师，熟练掌握 React、TypeScript、Node.js..."
        />
      </div>

      {/* 常规优化按钮 - 仅在手动输入和PDF模式下显示 */}
      {inputMode !== 'screenshot' && (
        <button
          onClick={handleOptimize}
          disabled={isLoading || !resumeContent.trim()}
          className={`w-full mt-6 py-3 px-4 rounded-lg text-sm font-semibold transition-all shadow-md ${
            isLoading || !resumeContent.trim()
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 active:scale-98 shadow-blue-200'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              优化中...
            </span>
          ) : (
            '✨ 使用 Gemini AI 优化'
          )}
        </button>
      )}

      {/* 截图模式提示 */}
      {inputMode === 'screenshot' && (
        <div className="mt-6 p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
          <p className="text-sm text-purple-800 text-center font-semibold">
            💡 截图模式下，点击上方「📸 捕获 LinkedIn 页面」按钮即可分析
          </p>
        </div>
      )}

      {/* 优化结果区域 - 使用新的结构化组件 */}
      <div className="mt-6">
        {isLoading ? (
          <div className="p-8 rounded-lg border-2 border-blue-200 bg-blue-50">
            <LoadingSpinner />
            <p className="text-center text-sm text-blue-800 mt-3">
              {optimizedText}
            </p>
          </div>
        ) : structuredResult ? (
          // 展示结构化结果
          <div className="space-y-4">
            <OptimizationResult
              sectionType={currentSection}
              data={structuredResult}
            />

            {/* 操作提示 */}
            <div className="mt-4 space-y-2">
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-xs text-green-800 font-medium flex items-start mb-2">
                  <svg className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  优化完成！使用说明：
                </p>
                <ol className="text-xs text-green-700 ml-6 space-y-1">
                  <li>1. 每个字段右上角都有独立的复制按钮</li>
                  <li>2. 点击复制按钮，然后粘贴到LinkedIn对应字段</li>
                  <li>3. 所有字段都已自动限制在LinkedIn字符数内</li>
                  <li>4. 请根据实际情况微调内容</li>
                </ol>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-xs text-blue-800 flex items-start">
                  <svg className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  💡 提示：AI 建议仅供参考，请确保内容真实准确后再更新到 LinkedIn。
                </p>
              </div>
            </div>
          </div>
        ) : optimizedText ? (
          // 展示传统文本结果或等待/错误信息
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-gray-900 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                优化结果
              </h2>
              {!optimizedText.includes('⚠️') && !optimizedText.includes('等待') && !optimizedText.includes('PDF') && (
                <CopyButton text={optimizedText} disabled={isLoading} />
              )}
            </div>

            <div className={`p-4 rounded-lg border-2 min-h-[120px] ${
              optimizedText.includes('⚠️')
                ? 'bg-red-50 border-red-200'
                : optimizedText.includes('等待') || optimizedText.includes('PDF')
                ? 'bg-blue-50 border-blue-200'
                : 'bg-white border-gray-200 shadow-sm'
            }`}>
              <div className={`text-sm leading-relaxed ${
                optimizedText.includes('⚠️')
                  ? 'text-red-800'
                  : optimizedText.includes('等待') || optimizedText.includes('PDF')
                  ? 'text-blue-800'
                  : 'text-gray-800'
              }`}>
                {optimizedText.split('\n').map((line, index) => (
                  <p key={index} className={`${line.startsWith('•') ? 'ml-2 mb-3' : 'mb-2'}`}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
      </div>
    </>
  );
}

export default App;