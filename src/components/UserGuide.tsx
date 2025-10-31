import { useState } from 'react';

interface UserGuideProps {
  onClose: () => void;
}

export const UserGuide: React.FC<UserGuideProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: '欢迎使用 LinkedIn Safe Co-Pilot',
      icon: '👋',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-gray-700">
            这是一个完全符合隐私政策的 LinkedIn 简历优化工具，使用 Google Gemini AI 为您提供专业建议。
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
            <p className="text-xs text-blue-800 font-medium">🔒 隐私承诺</p>
            <p className="text-xs text-blue-700 mt-1">
              所有数据仅在您的浏览器中处理，通过 Firebase AI Logic 安全传输至 Google Gemini API，绝不存储或用于其他目的。
            </p>
          </div>
        </div>
      ),
    },
    {
      title: '选择要优化的内容类型',
      icon: '🎯',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-gray-700 mb-2">
            我们支持 5 种 LinkedIn 内容类型，每种都有专门的 AI 优化策略：
          </p>
          <div className="space-y-2">
            <div className="bg-gray-50 p-2 rounded flex items-start">
              <span className="text-lg mr-2">🎯</span>
              <div>
                <p className="text-sm font-medium text-gray-800">LinkedIn 标题</p>
                <p className="text-xs text-gray-600">220字符限制，关键词优化，提升搜索排名</p>
              </div>
            </div>
            <div className="bg-gray-50 p-2 rounded flex items-start">
              <span className="text-lg mr-2">👤</span>
              <div>
                <p className="text-sm font-medium text-gray-800">个人简介 (About)</p>
                <p className="text-xs text-gray-600">2600字符，故事化叙述，展示专业价值</p>
              </div>
            </div>
            <div className="bg-gray-50 p-2 rounded flex items-start">
              <span className="text-lg mr-2">💼</span>
              <div>
                <p className="text-sm font-medium text-gray-800">工作经历</p>
                <p className="text-xs text-gray-600">STAR方法优化，量化成果，突出影响力</p>
              </div>
            </div>
            <div className="bg-gray-50 p-2 rounded flex items-start">
              <span className="text-lg mr-2">⚡</span>
              <div>
                <p className="text-sm font-medium text-gray-800">技能描述</p>
                <p className="text-xs text-gray-600">分类整理，行业术语，匹配职位要求</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '两种输入方式',
      icon: '📝',
      content: (
        <div className="space-y-3">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-3 rounded-lg border border-purple-200">
            <p className="text-sm font-medium text-purple-800 mb-2">方式 1: 上传 PDF 简历</p>
            <ul className="text-xs text-purple-700 space-y-1 ml-4">
              <li>• 点击「上传 PDF 简历」按钮</li>
              <li>• 选择您的简历文件（5MB以内）</li>
              <li>• AI 将自动识别内容类型</li>
              <li>• 文本将填充到输入框</li>
            </ul>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-teal-50 p-3 rounded-lg border border-green-200">
            <p className="text-sm font-medium text-green-800 mb-2">方式 2: 手动输入或粘贴</p>
            <ul className="text-xs text-green-700 space-y-1 ml-4">
              <li>• 选择内容类型（标题/简介/经历/技能）</li>
              <li>• 直接输入或从 LinkedIn 复制粘贴</li>
              <li>• 实时显示字符数和 LinkedIn 限制</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: '添加职位描述（可选）',
      icon: '🎓',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-gray-700">
            如果您正在申请特定职位，可以粘贴职位描述（JD），AI 将为您生成更有针对性的优化建议。
          </p>
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded">
            <p className="text-xs text-yellow-800 font-medium">💡 专业提示</p>
            <p className="text-xs text-yellow-700 mt-1">
              添加职位描述后，AI 会自动提取关键词（如技能、工具、方法论），并巧妙地融入您的简历优化建议中，提升 ATS（申请人跟踪系统）匹配度。
            </p>
          </div>
        </div>
      ),
    },
    {
      title: '获取 AI 优化建议',
      icon: '✨',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-gray-700 mb-2">
            点击「✨ 使用 Gemini AI 优化」按钮后：
          </p>
          <div className="space-y-2">
            <div className="flex items-start">
              <span className="text-2xl mr-3">1️⃣</span>
              <div>
                <p className="text-sm font-medium text-gray-800">AI 分析您的内容</p>
                <p className="text-xs text-gray-600">使用 STAR 方法、关键词优化等专业策略</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-2xl mr-3">2️⃣</span>
              <div>
                <p className="text-sm font-medium text-gray-800">生成多个优化版本</p>
                <p className="text-xs text-gray-600">通常 3-5 秒内返回结果</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-2xl mr-3">3️⃣</span>
              <div>
                <p className="text-sm font-medium text-gray-800">审阅并复制到 LinkedIn</p>
                <p className="text-xs text-gray-600">点击「复制」按钮，然后手动粘贴到您的 LinkedIn 个人资料</p>
              </div>
            </div>
          </div>
          <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded mt-3">
            <p className="text-xs text-red-800 font-medium">⚠️ 重要提醒</p>
            <p className="text-xs text-red-700 mt-1">
              为了符合 LinkedIn 政策，我们不提供自动填充功能。请务必人工审阅 AI 建议，确保准确性后再更新您的 LinkedIn 个人资料。
            </p>
          </div>
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        {/* 头部 */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{steps[currentStep].icon}</span>
              <div>
                <h2 className="text-lg font-bold">{steps[currentStep].title}</h2>
                <p className="text-xs text-blue-100">步骤 {currentStep + 1} / {steps.length}</p>
              </div>
            </div>
            <button
              onClick={handleSkip}
              className="text-white hover:text-blue-100 transition-colors"
              aria-label="跳过引导"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* 进度条 */}
        <div className="w-full bg-gray-200 h-1">
          <div
            className="bg-blue-600 h-1 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-y-auto p-6">
          {steps[currentStep].content}
        </div>

        {/* 底部按钮 */}
        <div className="border-t border-gray-200 p-4 flex items-center justify-between bg-gray-50">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              currentStep === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            上一步
          </button>

          <div className="flex space-x-1">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'bg-blue-600 w-6'
                    : index < currentStep
                    ? 'bg-blue-300'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all"
          >
            {currentStep === steps.length - 1 ? '开始使用' : '下一步'}
          </button>
        </div>
      </div>
    </div>
  );
};
