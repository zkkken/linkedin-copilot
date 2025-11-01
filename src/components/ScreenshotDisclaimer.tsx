/**
 * Screenshot Disclaimer Component
 * User consent flow for the experimental screenshot feature.
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
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-4 rounded-t-lg">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <svg className="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">⚠️ Important notice</h2>
              <p className="text-sm text-orange-100">Read before using screenshot capture</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <p className="text-sm font-semibold text-yellow-800 mb-2">🧪 Experimental feature</p>
            <p className="text-xs text-yellow-700">
              This capability is intended for demonstration and educational use, showcasing Chrome APIs and Gemini Vision integration.
            </p>
          </div>

          <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded space-y-2">
            <h3 className="text-sm font-bold text-indigo-900 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              📋 Prepare your LinkedIn page before capturing
            </h3>
            <ol className="text-xs text-indigo-800 list-decimal list-inside space-y-1.5">
              <li>
                On LinkedIn, open the <strong>exact section</strong> you want to optimize and click the{' '}
                <span className="bg-indigo-100 px-1 rounded">✏️ Edit</span> button.
                <div className="text-[11px] text-indigo-700 ml-5 mt-1">
                  For example: to optimize "About", open the About edit dialog first.
                </div>
              </li>
              <li>
                Ensure the edit dialog is open or the section is <strong>fully expanded</strong> (use "See more").
                <div className="text-[11px] text-indigo-700 ml-5 mt-1">
                  Avoid collapsed sections so the screenshot includes every detail.
                </div>
              </li>
            </ol>
          </div>

          {isLinkedInPage ? (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
              <p className="text-sm font-semibold text-green-800 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                LinkedIn page detected
              </p>
              <p className="text-xs text-green-700 mt-1">
                You are currently on LinkedIn. Screenshot capture is available.
              </p>
            </div>
          ) : (
            <div className="bg-[#EAF3FF] border-l-4 border-[#0A66C2] p-4 rounded">
              <p className="text-sm font-semibold text-[#0A66C2] flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                LinkedIn page not detected
              </p>
              <p className="text-xs text-[#0A66C2] mt-1">
                You can capture any page, but for best results stay on your own LinkedIn profile.
              </p>
            </div>
          )}

          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-2">📋 How it works</h3>
            <ul className="text-xs text-gray-700 space-y-2">
              <li className="flex items-start"><span className="text-[#0A66C2] mr-2">✓</span><span>Captures the visible portion of the current browser tab.</span></li>
              <li className="flex items-start"><span className="text-[#0A66C2] mr-2">✓</span><span>Sends the image securely through Firebase AI Logic to Google Gemini Vision API.</span></li>
              <li className="flex items-start"><span className="text-[#0A66C2] mr-2">✓</span><span>Uses OCR to extract text and returns optimization suggestions.</span></li>
              <li className="flex items-start"><span className="text-[#0A66C2] mr-2">✓</span><span>Content is not stored and is used only for this request.</span></li>
            </ul>
          </div>

          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
            <h3 className="text-sm font-bold text-red-800 mb-2">⚠️ Risk notice</h3>
            <ul className="text-xs text-red-700 space-y-1">
              <li>• This feature may violate LinkedIn terms of service.</li>
              <li>• Use only on your own LinkedIn profile.</li>
              <li>• Do not use for commercial or production purposes.</li>
              <li>• Proceed at your own risk; we are not liable for account issues.</li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 p-4 rounded">
            <h3 className="text-sm font-bold text-green-800 mb-2">✅ Recommended approach</h3>
            <p className="text-xs text-green-700">
              We recommend the <strong>manual input</strong> or <strong>PDF upload</strong> modes. They are fully compliant and safer.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-2">🔒 Data privacy</h3>
            <ul className="text-xs text-gray-700 space-y-1">
              <li>• Screenshot data is only sent to Google Gemini API.</li>
              <li>• Nothing is stored or shared with third parties.</li>
              <li>• Code is open source and available for inspection.</li>
            </ul>
          </div>

          <div className="border-t border-gray-200 pt-4 space-y-3">
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={hasPreparedProfile}
                onChange={(e) => setHasPreparedProfile(e.target.checked)}
                className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="ml-3 text-xs text-gray-700">
                I opened the <strong>specific LinkedIn section</strong> I want to optimize and ensured its content is fully visible.
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
                I have read and understand the statements above. I recognize this feature is for <strong>demonstration only</strong>, may violate LinkedIn terms, and should only be used on my own profile. I accept all related risks.
              </span>
            </label>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex space-x-3">
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
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
            I agree and continue
          </button>
        </div>
      </div>
    </div>
  );
}
