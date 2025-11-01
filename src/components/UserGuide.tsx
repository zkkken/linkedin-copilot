import { useState } from 'react';

interface UserGuideProps {
  onClose: () => void;
}

export const UserGuide: React.FC<UserGuideProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to LinkedIn Safe Co-Pilot',
      icon: '👋',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-gray-700">
            LinkedIn Safe Co-Pilot is a privacy-conscious optimization assistant powered by Google Gemini AI.
          </p>
          <div className="bg-[#EAF3FF] border-l-4 border-[#0A66C2] p-3 rounded">
            <p className="text-xs text-[#0A66C2] font-medium">🔒 Privacy first</p>
            <p className="text-xs text-[#0A66C2] mt-1">
              All processing happens locally in your browser. Text is sent securely via Firebase AI Logic to Google Gemini API and is never stored or reused.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'Pick the section you want to optimize',
      icon: '🎯',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-gray-700 mb-2">
            Five LinkedIn sections are supported — each with tailored prompt logic:
          </p>
          <div className="space-y-2">
            <div className="bg-gray-50 p-2 rounded flex items-start">
              <span className="text-lg mr-2">🎯</span>
              <div>
                <p className="text-sm font-medium text-gray-800">Headline</p>
                <p className="text-xs text-gray-600">220-character limit, keyword tuning, recruiter-friendly positioning.</p>
              </div>
            </div>
            <div className="bg-gray-50 p-2 rounded flex items-start">
              <span className="text-lg mr-2">👤</span>
              <div>
                <p className="text-sm font-medium text-gray-800">About</p>
                <p className="text-xs text-gray-600">Up to 2,600 characters, narrative storytelling, personal value.</p>
              </div>
            </div>
            <div className="bg-gray-50 p-2 rounded flex items-start">
              <span className="text-lg mr-2">💼</span>
              <div>
                <p className="text-sm font-medium text-gray-800">Experience</p>
                <p className="text-xs text-gray-600">Impact-first STAR statements with quantified outcomes.</p>
              </div>
            </div>
            <div className="bg-gray-50 p-2 rounded flex items-start">
              <span className="text-lg mr-2">⚡</span>
              <div>
                <p className="text-sm font-medium text-gray-800">Skills summary</p>
                <p className="text-xs text-gray-600">Grouped skills, clear taxonomy, aligned with target roles.</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Choose your input method',
      icon: '📝',
      content: (
        <div className="space-y-3">
          <div className="bg-[#EAF3FF] p-3 rounded-lg border border-[#B3D6F2]">
            <p className="text-sm font-medium text-[#0A66C2] mb-2">Option 1: Upload a PDF resume</p>
            <ul className="text-xs text-[#0A66C2] space-y-1 ml-4">
              <li>• Click "Upload resume PDF"</li>
              <li>• Select a file up to 5 MB</li>
              <li>• AI detects the relevant section automatically</li>
              <li>• Extracted text fills the editor</li>
            </ul>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-teal-50 p-3 rounded-lg border border-green-200">
            <p className="text-sm font-medium text-green-800 mb-2">Option 2: Manual input or paste</p>
            <ul className="text-xs text-green-700 space-y-1 ml-4">
              <li>• Select the section (Headline, About, Experience, Skills)</li>
              <li>• Type or paste directly from LinkedIn</li>
              <li>• Character counts update in real time</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: 'Add a job description (optional)',
      icon: '🎓',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-gray-700">
            Paste the job description for the role you are targeting and the AI will tailor suggestions to the right keywords.
          </p>
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded">
            <p className="text-xs text-yellow-800 font-medium">💡 Pro tip</p>
            <p className="text-xs text-yellow-700 mt-1">
              Providing a JD lets the AI weave role-specific terminology, tools, and outcomes into your optimization for stronger ATS alignment.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'Generate and review AI suggestions',
      icon: '✨',
      content: (
        <div className="space-y-3">
          <div className="bg-gray-50 border border-gray-200 rounded p-3 space-y-2">
            <div className="flex items-start">
              <span className="text-2xl mr-3">1️⃣</span>
              <div>
                <p className="text-sm font-medium text-gray-800">Click “Optimize”</p>
                <p className="text-xs text-gray-600">Gemini analyzes your input with structured prompts.</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-2xl mr-3">2️⃣</span>
              <div>
                <p className="text-sm font-medium text-gray-800">Receive multiple variations</p>
                <p className="text-xs text-gray-600">Results typically appear within 3–5 seconds.</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-2xl mr-3">3️⃣</span>
              <div>
                <p className="text-sm font-medium text-gray-800">Review and copy into LinkedIn</p>
                <p className="text-xs text-gray-600">Use the copy buttons and paste manually into your profile.</p>
              </div>
            </div>
          </div>
          <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded mt-3">
            <p className="text-xs text-red-800 font-medium">⚠️ Important reminder</p>
            <p className="text-xs text-red-700 mt-1">
              To comply with LinkedIn policy we do not auto-fill fields. Always review and fact-check before updating your profile.
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
      <div className="bg-white rounded-xl shadow-2xl w/full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-[#0A66C2] p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{steps[currentStep].icon}</span>
              <div>
                <h2 className="text-lg font-bold">{steps[currentStep].title}</h2>
                <p className="text-xs text-[#EAF3FF]">Step {currentStep + 1} / {steps.length}</p>
              </div>
            </div>
            <button
              onClick={handleSkip}
              className="text-white hover:text-[#EAF3FF] transition-colors"
              aria-label="Skip guide"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="w-full bg-gray-200 h-1">
          <div
            className="bg-[#0A66C2] h-1 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {steps[currentStep].content}
        </div>

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
            Previous
          </button>

          <div className="flex space-x-1">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'bg-[#0A66C2] w-6'
                    : index < currentStep
                    ? 'bg-[#D8EAFE]'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-[#0A66C2] text-white hover:bg-[#004182] transition-all"
          >
            {currentStep === steps.length - 1 ? 'Start optimizing' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};
