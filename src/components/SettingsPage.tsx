/**
 * Settings Page Component
 * Allows users to configure their AI provider and API keys
 */

import { useState, useEffect } from 'react';
import { AI_PROVIDERS, getProvider } from '../providers/aiProviders';
import type { AIProviderConfig } from '../providers/types';

interface SettingsPageProps {
  onClose: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onClose }) => {
  const [selectedProvider, setSelectedProvider] = useState('userFirebase');
  const [config, setConfig] = useState<AIProviderConfig>({});
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const provider = getProvider(selectedProvider);

  // Load saved settings
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const result = await chrome.storage.local.get(['aiProvider', 'aiProviderConfig']);
    if (result.aiProvider) {
      setSelectedProvider(result.aiProvider);
    }
    if (result.aiProviderConfig) {
      setConfig(result.aiProviderConfig);
    }
  };

  const handleProviderChange = (newProvider: string) => {
    setSelectedProvider(newProvider);
    setConfig({});
    setTestResult(null);
  };

  const handleConfigChange = (key: string, value: string) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      console.log('Testing connection with config:', config);
      console.log('Provider:', provider.name);

      const testPrompt = 'Test: Please respond with "Hello! Connection successful." and nothing else.';
      const result = await provider.generateContent(testPrompt, config);

      console.log('Test connection successful:', result);
      setTestResult({
        success: true,
        message: `✅ Connection successful!\n\nResponse: ${result.substring(0, 200)}${result.length > 200 ? '...' : ''}`
      });
    } catch (error) {
      console.error('Test connection failed:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : '';

      setTestResult({
        success: false,
        message: `❌ Connection failed:\n\n${errorMessage}\n\n${errorStack ? 'Stack trace:\n' + errorStack.substring(0, 300) : ''}`
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      await chrome.storage.local.set({
        aiProvider: selectedProvider,
        aiProviderConfig: config
      });

      alert('✅ Settings saved successfully!');
      onClose();
    } catch (error) {
      alert(`❌ Failed to save settings: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">⚙️ AI Provider Settings</h1>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Provider Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose AI Provider
            </label>
            <select
              value={selectedProvider}
              onChange={(e) => handleProviderChange(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2]"
            >
              {Object.entries(AI_PROVIDERS).map(([id, prov]) => (
                <option key={id} value={id}>
                  {prov.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-600 mt-2">{provider.description}</p>
          </div>

          {/* Configuration Fields */}
          {provider.requiresConfig && (
            <div className="space-y-4 border-t border-gray-200 pt-6">
              <h2 className="font-semibold text-gray-900">🔑 Configuration</h2>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 text-xs text-yellow-800">
                <strong>⚠️ Security Note:</strong> Your API keys are stored locally in your browser and never sent to our servers. They're only used to make direct API calls to your chosen provider.
              </div>

              {provider.configFields.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>

                  {field.type === 'select' ? (
                    <select
                      value={config[field.key] || ''}
                      onChange={(e) => handleConfigChange(field.key, e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2]"
                      required={field.required}
                    >
                      <option value="">Select...</option>
                      {field.options?.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      placeholder={field.placeholder}
                      value={config[field.key] || ''}
                      onChange={(e) => handleConfigChange(field.key, e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2] font-mono text-xs"
                      rows={8}
                      required={field.required}
                    />
                  ) : (
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={config[field.key] || ''}
                      onChange={(e) => handleConfigChange(field.key, e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2]"
                      required={field.required}
                    />
                  )}

                  {field.helpText && (
                    <p className="text-xs text-gray-500 mt-1">💡 {field.helpText}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Test Connection */}
          {provider.requiresConfig && (
            <div className="border-t border-gray-200 pt-6">
              <button
                onClick={handleTestConnection}
                disabled={isTesting}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  isTesting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isTesting ? (
                  <>
                    <span className="inline-block animate-spin mr-2">⏳</span>
                    Testing Connection...
                  </>
                ) : (
                  <>🧪 Test Connection</>
                )}
              </button>

              {testResult && (
                <div className={`mt-4 p-4 rounded-lg text-sm font-mono whitespace-pre-wrap ${
                  testResult.success
                    ? 'bg-green-50 border border-green-200 text-green-800'
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                  {testResult.message}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              isSaving
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700 shadow-md'
            }`}
          >
            {isSaving ? 'Saving...' : '💾 Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};
