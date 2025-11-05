/**
 * AI Provider Implementations
 * Centralized AI provider management with multiple backends
 */

import type { AIProvider } from './types';

/**
 * Parse Firebase configuration from various formats
 * Supports: pure JSON, JavaScript const/let/var declarations
 * Uses manual parsing to avoid CSP issues with eval/Function
 */
function parseFirebaseConfig(input: string | object): object {
  // If already an object, return it
  if (typeof input !== 'string') {
    return input;
  }

  let configStr = input.trim();

  // Remove JavaScript variable declarations
  configStr = configStr.replace(/^(const|let|var)\s+\w+\s*=\s*/, '');

  // Remove trailing semicolon
  configStr = configStr.replace(/;?\s*$/, '');

  // Try to parse as JSON first
  try {
    const result = JSON.parse(configStr);
    return result;
  } catch (jsonError) {
    // JSON parsing failed, try manual parsing for JavaScript object literal
  }

  // Manual parsing for JavaScript object literal (without quotes around keys)
  try {
    const result: any = {};

    // Extract content between the first { and last }
    const firstBrace = configStr.indexOf('{');
    const lastBrace = configStr.lastIndexOf('}');

    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error('Could not find object literal {}');
    }

    const content = configStr.substring(firstBrace + 1, lastBrace);

    // Match all key: value pairs (handles both quoted and unquoted values)
    const keyValueRegex = /(\w+)\s*:\s*["']([^"']+)["']/g;
    let match;

    while ((match = keyValueRegex.exec(content)) !== null) {
      const key = match[1];
      const value = match[2];
      result[key] = value;
    }

    // Validate required fields
    if (!result.apiKey) {
      throw new Error('Missing required field: apiKey');
    }

    console.log('Manual parsing successful:', result);
    return result;
  } catch (parseError: any) {
    console.error('Manual parse error:', parseError);
    throw new Error(`Failed to parse Firebase config: ${parseError.message}. Please paste the complete const firebaseConfig = {...}; block.`);
  }
}

/**
 * Firebase AI Logic Provider: User provides their Firebase configuration
 * Unlimited usage (user pays for their own Firebase/Gemini costs)
 */
const firebaseProvider: AIProvider = {
  id: 'firebase',
  name: 'Firebase AI Logic',
  description: 'Use your own Firebase configuration. Paste the entire firebaseConfig object from Firebase Console.',
  requiresConfig: true,
  supportsVision: true,
  configFields: [
    {
      key: 'firebaseConfig',
      label: 'Firebase Configuration',
      type: 'textarea',
      rows: 10,
      placeholder: `Paste either format:

Option 1 - Pure JSON:
{"apiKey":"AIza...","authDomain":"your-project.firebaseapp.com"...}

Option 2 - JavaScript code:
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};`,
      required: true,
      helpText: 'Get from Firebase Console → Project Settings → General → Your apps → SDK setup and configuration'
    },
    {
      key: 'model',
      label: 'Model',
      type: 'select',
      options: ['gemini-2.5-flash', 'gemini-1.5-pro', 'gemini-1.5-flash'],
      required: true,
      helpText: 'Choose which Gemini model to use'
    }
  ],

  generateContent: async (prompt: string, config: any) => {
    try {
      // Debug: Log the raw config
      console.log('Raw firebaseConfig:', config.firebaseConfig);
      console.log('Config type:', typeof config.firebaseConfig);

      // Parse Firebase config
      const fbConfig = parseFirebaseConfig(config.firebaseConfig);
      console.log('Parsed config:', fbConfig);

      const { initializeApp, getApps } = await import('firebase/app');
      const { getAI, getGenerativeModel, GoogleAIBackend } = await import('firebase/ai');

      // Check if app already exists
      let app;
      const existingApps = getApps();
      const userAppName = 'user-firebase-app';
      const existingApp = existingApps.find(a => a.name === userAppName);

      if (existingApp) {
        app = existingApp;
      } else {
        app = initializeApp(fbConfig, userAppName);
      }

      const ai = getAI(app, {
        backend: new GoogleAIBackend(),
        useLimitedUseAppCheckTokens: true
      });

      const model = getGenerativeModel(ai, {
        model: config.model || 'gemini-2.5-flash'
      });

      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error: any) {
      // Re-throw parsing errors as-is (they have user-friendly messages)
      if (error.message?.includes('Invalid Firebase configuration format')) {
        throw error;
      }

      // Handle Firebase initialization errors
      if (error.message?.includes('API key')) {
        throw new Error('Invalid API key in Firebase configuration. Please check your apiKey field.');
      }

      // Handle other errors with more context
      const errorMessage = error.message || 'Unknown error';
      throw new Error(`Firebase AI connection failed: ${errorMessage}`);
    }
  },

  analyzeImage: async (imageDataUrl: string, prompt: string, config: any) => {
    try {
      // Parse Firebase config
      const fbConfig = parseFirebaseConfig(config.firebaseConfig);

      const { initializeApp, getApps } = await import('firebase/app');
      const { getAI, getGenerativeModel, GoogleAIBackend } = await import('firebase/ai');

      // Check if app already exists
      let app;
      const existingApps = getApps();
      const userAppName = 'user-firebase-app';
      const existingApp = existingApps.find(a => a.name === userAppName);

      if (existingApp) {
        app = existingApp;
      } else {
        app = initializeApp(fbConfig, userAppName);
      }

      const ai = getAI(app, {
        backend: new GoogleAIBackend(),
        useLimitedUseAppCheckTokens: true
      });

      const model = getGenerativeModel(ai, {
        model: config.model || 'gemini-2.5-flash'
      });

      const base64Data = imageDataUrl.split(',')[1];

      const result = await model.generateContent([
        {
          inlineData: {
            mimeType: "image/png",
            data: base64Data
          }
        },
        { text: prompt }
      ]);

      return result.response.text();
    } catch (error: any) {
      // Re-throw parsing errors as-is (they have user-friendly messages)
      if (error.message?.includes('Invalid Firebase configuration format')) {
        throw error;
      }

      // Handle Firebase initialization errors
      if (error.message?.includes('API key')) {
        throw new Error('Invalid API key in Firebase configuration. Please check your apiKey field.');
      }

      // Handle other errors with more context
      const errorMessage = error.message || 'Unknown error';
      throw new Error(`Firebase AI connection failed: ${errorMessage}`);
    }
  }
};

/**
 * OpenAI Provider
 * User provides their own OpenAI API key
 */
const openaiProvider: AIProvider = {
  id: 'openai',
  name: 'OpenAI GPT-4 (Your API Key)',
  description: 'Use OpenAI GPT-4 or GPT-4 Turbo. Requires your own API key. Vision support for screenshot mode.',
  requiresConfig: true,
  supportsVision: true,
  configFields: [
    {
      key: 'apiKey',
      label: 'OpenAI API Key',
      type: 'password',
      placeholder: 'sk-...',
      required: true,
      helpText: 'Get from platform.openai.com/api-keys'
    },
    {
      key: 'model',
      label: 'Model',
      type: 'select',
      options: ['gpt-4o', 'gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo'],
      required: true,
      helpText: 'GPT-4o and GPT-4-turbo support vision (for screenshot mode)'
    }
  ],

  generateContent: async (prompt: string, config: any) => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: config.model || 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are an expert LinkedIn profile optimizer and career coach.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  },

  analyzeImage: async (imageDataUrl: string, prompt: string, config: any) => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: config.model || 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageDataUrl
                }
              }
            ]
          }
        ],
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI Vision API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }
};

/**
 * Anthropic Claude Provider
 * User provides their own Claude API key
 */
const claudeProvider: AIProvider = {
  id: 'claude',
  name: 'Anthropic Claude (Your API Key)',
  description: 'Use Claude 3.5 Sonnet or Opus. Requires your own API key. Vision support available.',
  requiresConfig: true,
  supportsVision: true,
  configFields: [
    {
      key: 'apiKey',
      label: 'Anthropic API Key',
      type: 'password',
      placeholder: 'sk-ant-...',
      required: true,
      helpText: 'Get from console.anthropic.com'
    },
    {
      key: 'model',
      label: 'Model',
      type: 'select',
      options: ['claude-3-5-sonnet-20241022', 'claude-3-opus-20240229', 'claude-3-sonnet-20240229'],
      required: true
    }
  ],

  generateContent: async (prompt: string, config: any) => {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: config.model || 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        system: 'You are an expert LinkedIn profile optimizer and career coach.',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Claude API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.content[0].text;
  },

  analyzeImage: async (imageDataUrl: string, prompt: string, config: any) => {
    const base64Data = imageDataUrl.split(',')[1];
    const mimeType = imageDataUrl.split(';')[0].split(':')[1];

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: config.model || 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mimeType,
                  data: base64Data
                }
              },
              {
                type: 'text',
                text: prompt
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Claude Vision API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }
};

/**
 * All available AI providers
 */
export const AI_PROVIDERS: Record<string, AIProvider> = {
  firebase: firebaseProvider,
  openai: openaiProvider,
  claude: claudeProvider
};

/**
 * Get provider by ID
 */
export function getProvider(providerId: string): AIProvider {
  return AI_PROVIDERS[providerId] || AI_PROVIDERS.firebase;
}

/**
 * Get list of all provider IDs and names
 */
export function getProviderOptions(): Array<{ id: string; name: string; description: string }> {
  return Object.values(AI_PROVIDERS).map(provider => ({
    id: provider.id,
    name: provider.name,
    description: provider.description
  }));
}
