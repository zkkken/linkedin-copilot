import { useState, useEffect } from 'react';

interface PrivacyConsentProps {
  onConsent: (agreed: boolean) => void;
}

export const PrivacyConsent: React.FC<PrivacyConsentProps> = ({ onConsent }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 检查用户是否已经同意过
    checkConsentStatus();
  }, []);

  const checkConsentStatus = async () => {
    try {
      // 使用 chrome.storage.local 检查同意状态
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.get(['privacyConsentGiven'], (result) => {
          if (!result.privacyConsentGiven) {
            // 如果没有同意过，显示弹窗
            setIsVisible(true);
          } else {
            // 已同意，直接允许使用
            onConsent(true);
          }
        });
      } else {
        // 开发环境回退：使用 localStorage
        const consent = localStorage.getItem('privacyConsentGiven');
        if (!consent) {
          setIsVisible(true);
        } else {
          onConsent(true);
        }
      }
    } catch (error) {
      console.error('检查同意状态失败:', error);
      // 出错时也显示弹窗，确保合规
      setIsVisible(true);
    }
  };

  const handleAgree = async () => {
    try {
      // 保存同意状态
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.set({
          privacyConsentGiven: true,
          consentTimestamp: new Date().toISOString()
        }, () => {
          setIsVisible(false);
          onConsent(true);
        });
      } else {
        // 开发环境回退
        localStorage.setItem('privacyConsentGiven', 'true');
        localStorage.setItem('consentTimestamp', new Date().toISOString());
        setIsVisible(false);
        onConsent(true);
      }
    } catch (error) {
      console.error('保存同意状态失败:', error);
      // 即使保存失败，也允许本次使用
      setIsVisible(false);
      onConsent(true);
    }
  };

  const handleDecline = () => {
    setIsVisible(false);
    onConsent(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <>
      {/* 遮罩层 */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />

      {/* 弹窗 */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 space-y-4">
          {/* 图标 */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-[#EAF3FF] rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-[#0A66C2]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>

          {/* 标题 */}
          <h2 className="text-xl font-bold text-gray-900 text-center">
            隐私提示
          </h2>

          {/* 内容 */}
          <div className="space-y-3 text-sm text-gray-700">
            <p className="leading-relaxed">
              为了提供 AI 优化建议，您输入的内容将通过{' '}
              <strong className="text-[#0A66C2]">Firebase AI Logic</strong>{' '}
              安全传输至{' '}
              <strong className="text-[#0A66C2]">Google Gemini API</strong>{' '}
              进行分析。
            </p>

            <div className="bg-green-50 border border-green-200 rounded-md p-3 space-y-2">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-green-800">
                  数据仅用于生成优化建议
                </span>
              </div>
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-green-800">
                  不会被存储或用于其他目的
                </span>
              </div>
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-green-800">
                  完全符合谷歌隐私政策
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              您的 PDF 简历文件仅在本地浏览器中处理，不会被上传。
              只有您手动输入或从 PDF 提取的文本内容会发送给 AI 分析。
            </p>

            <p className="text-xs text-gray-500">
              了解更多：{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0A66C2] hover:underline"
              >
                Google 隐私政策
              </a>
            </p>
          </div>

          {/* 按钮 */}
          <div className="flex space-x-3 pt-2">
            <button
              onClick={handleDecline}
              className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
            >
              取消
            </button>
            <button
              onClick={handleAgree}
              className="flex-1 px-4 py-2.5 bg-[#0A66C2] text-white rounded-md hover:bg-[#004182] transition-colors font-medium shadow-sm"
            >
              我同意
            </button>
          </div>

          {/* 底部提示 */}
          <p className="text-xs text-center text-gray-500 pt-2">
            点击"我同意"即表示您已阅读并同意数据使用条款
          </p>
        </div>
      </div>
    </>
  );
};
