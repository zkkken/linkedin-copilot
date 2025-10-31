/**
 * Screenshot Disclaimer Component
 * 截图功能的免责声明和用户同意组件
 */

import { useState } from 'react';

interface ScreenshotDisclaimerProps {
  onConsent: (agreed: boolean) => void;
  isLinkedInPage: boolean;
}

export function ScreenshotDisclaimer({ onConsent, isLinkedInPage }: ScreenshotDisclaimerProps) {
  const [agreed, setAgreed] = useState(false);
  const [hasPreparedProfile, setHasPreparedProfile] = useState(false);

  const canProceed = agreed && hasPreparedProfile;

  const handleAgree = () => {
    if (canProceed) {
      onConsent(true);
    }
  };

  const handleCancel = () => {
    onConsent(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* 头部 */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-4 rounded-t-lg">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <svg className="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">⚠️ 重要声明</h2>
              <p className="text-sm text-orange-100">截图功能使用须知</p>
            </div>
          </div>
        </div>

        {/* 内容 */}
        <div className="p-6 space-y-4">
          {/* 实验性功能提示 */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <p className="text-sm font-semibold text-yellow-800 mb-2">
              🧪 这是一个实验性功能
            </p>
            <p className="text-xs text-yellow-700">
              此功能仅用于技术演示和教育目的，展示 Chrome AI 和 Gemini Vision API 的集成能力。
            </p>
          </div>

          {/* 截图前准备提示 */}
          <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded space-y-2">
            <h3 className="text-sm font-bold text-indigo-900 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              截图前请先完成以下准备
            </h3>
            <ol className="text-xs text-indigo-800 list-decimal list-inside space-y-1">
              <li>点击 LinkedIn 个人资料中的「编辑」按钮进入编辑视图，或将页面内容全部展开。</li>
              <li>确认需要分析的「关于」「经历」「技能」等模块已经完全显示在屏幕上。</li>
            </ol>
            <p className="text-[11px] text-indigo-700 bg-white bg-opacity-60 border border-indigo-200 rounded px-3 py-2">
              这是为了确保截图中包含完整信息，避免遗漏折叠的内容。
            </p>
          </div>

          {/* LinkedIn 页面检测 */}
          {isLinkedInPage ? (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
              <p className="text-sm font-semibold text-green-800 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                检测到 LinkedIn 页面
              </p>
              <p className="text-xs text-green-700 mt-1">
                您当前在 LinkedIn 页面，可以使用截图功能。
              </p>
            </div>
          ) : (
          <div className="bg-[#EAF3FF] border-l-4 border-[#0A66C2] p-4 rounded">
            <p className="text-sm font-semibold text-[#0A66C2] flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                未在 LinkedIn 页面
              </p>
            <p className="text-xs text-[#0A66C2] mt-1">
                截图功能可在任何页面使用，但建议在 LinkedIn 个人资料页面使用以获得最佳效果。
              </p>
            </div>
          )}

          {/* 功能说明 */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-2">📋 功能说明</h3>
            <ul className="text-xs text-gray-700 space-y-2">
              <li className="flex items-start">
                <span className="text-[#0A66C2] mr-2">✓</span>
                <span>截图将捕获当前浏览器标签页的可见区域</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#0A66C2] mr-2">✓</span>
                <span>图片将通过 Firebase AI Logic 安全传输至 Google Gemini Vision API</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#0A66C2] mr-2">✓</span>
                <span>AI 将进行 OCR 识别并提供优化建议</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#0A66C2] mr-2">✓</span>
                <span>数据不会被存储，仅用于生成建议</span>
              </li>
            </ul>
          </div>

          {/* 风险提示 */}
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
            <h3 className="text-sm font-bold text-red-800 mb-2">⚠️ 风险提示</h3>
            <ul className="text-xs text-red-700 space-y-1">
              <li>• 此功能可能违反 LinkedIn 服务条款</li>
              <li>• 仅在您自己的 LinkedIn 页面上使用</li>
              <li>• 不要用于商业用途或生产环境</li>
              <li>• 我们不对因使用此功能导致的账号问题负责</li>
            </ul>
          </div>

          {/* 推荐使用方式 */}
          <div className="bg-green-50 border border-green-200 p-4 rounded">
            <h3 className="text-sm font-bold text-green-800 mb-2">✅ 推荐使用</h3>
            <p className="text-xs text-green-700">
              我们推荐使用<strong>手动输入</strong>或<strong>PDF上传</strong>模式，这些方式完全合规且安全。
            </p>
          </div>

          {/* 数据隐私 */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-2">🔒 数据隐私</h3>
            <ul className="text-xs text-gray-700 space-y-1">
              <li>• 截图数据仅发送至 Google Gemini API</li>
              <li>• 不会存储或分享给第三方</li>
              <li>• 完全开源，代码可在 GitHub 审计</li>
            </ul>
          </div>

          {/* 同意复选框 */}
          <div className="border-t border-gray-200 pt-4 space-y-3">
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={hasPreparedProfile}
                onChange={(e) => setHasPreparedProfile(e.target.checked)}
                className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="ml-3 text-xs text-gray-700">
                我已在 LinkedIn 页面点击「编辑」按钮进入编辑视图，或已手动展开所有需要分析的内容模块。
              </span>
            </label>
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-4 h-4 text-[#0A66C2] border-gray-300 rounded focus:ring-[#0A66C2]"
              />
              <span className="ml-3 text-xs text-gray-700">
                我已阅读并理解以上所有声明。我明白此功能仅用于<strong>演示目的</strong>，
                可能违反 LinkedIn 服务条款，且仅应在自己的页面上使用。我同意自行承担使用风险。
              </span>
            </label>
          </div>
        </div>

        {/* 按钮 */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex space-x-3">
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleAgree}
            disabled={!canProceed}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              canProceed
                ? 'bg-[#0A66C2] text-white hover:bg-[#004182]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            我同意并继续
          </button>
        </div>
      </div>
    </div>
  );
}
