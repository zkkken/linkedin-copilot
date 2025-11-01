import { useState, useEffect } from 'react';

interface PrivacyConsentProps {
  onConsent: (agreed: boolean) => void;
}

export const PrivacyConsent: React.FC<PrivacyConsentProps> = ({ onConsent }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    checkConsentStatus();
  }, []);

  const checkConsentStatus = async () => {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.get(['privacyConsentGiven'], (result) => {
          if (!result.privacyConsentGiven) {
            setIsVisible(true);
          } else {
            onConsent(true);
          }
        });
      } else {
        const consent = localStorage.getItem('privacyConsentGiven');
        if (!consent) {
          setIsVisible(true);
        } else {
          onConsent(true);
        }
      }
    } catch (error) {
      console.error('Failed to check consent status:', error);
      setIsVisible(true);
    }
  };

  const handleAgree = async () => {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.set(
          {
            privacyConsentGiven: true,
            consentTimestamp: new Date().toISOString(),
          },
          () => {
            setIsVisible(false);
            onConsent(true);
          }
        );
      } else {
        localStorage.setItem('privacyConsentGiven', 'true');
        localStorage.setItem('consentTimestamp', new Date().toISOString());
        setIsVisible(false);
        onConsent(true);
      }
    } catch (error) {
      console.error('Failed to persist consent state:', error);
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
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 space-y-4">
          {/* Icon */}
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

          <h2 className="text-xl font-bold text-gray-900 text-center">Privacy notice</h2>

          <div className="space-y-3 text-sm text-gray-700">
            <p className="leading-relaxed">
              To generate optimization suggestions, the content you submit is securely sent via{' '}
              <strong className="text-[#0A66C2]">Firebase AI Logic</strong>{' '}
              to{' '}
              <strong className="text-[#0A66C2]">Google Gemini API</strong>{' '}
              for analysis.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-md p-3 space-y-2">
              {[
                'Data is used exclusively to produce optimization suggestions.',
                'No content is stored or repurposed.',
                'Fully aligned with Google privacy policies.',
              ].map((message) => (
                <div key={message} className="flex items-start">
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
                  <span className="text-green-800">{message}</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              PDF files are processed locally inside your browser and never uploaded. Only the text you
              manually enter or extract from PDF is sent to the AI service.
            </p>

            <p className="text-xs text-gray-500">
              Learn more:{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0A66C2] hover:underline"
              >
                Google Privacy Policy
              </a>
            </p>
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              onClick={handleDecline}
              className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleAgree}
              className="flex-1 px-4 py-2.5 bg-[#0A66C2] text-white rounded-md hover:bg-[#004182] transition-colors font-medium shadow-sm"
            >
              I agree
            </button>
          </div>

          <p className="text-xs text-center text-gray-500 pt-2">
            By selecting "I agree" you acknowledge the data usage terms above.
          </p>
        </div>
      </div>
    </>
  );
};
