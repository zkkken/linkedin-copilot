/**
 * AI Provider Implementations
 * Centralized AI provider management with multiple backends
 */

import type { AIProvider } from './types';

/**
 * Parse Firebase config from code string
 * Accepts formats like: const firebaseConfig = { ... } or just { ... }
 * Uses regex parsing to avoid CSP violations (no eval/Function)
 */
function parseFirebaseConfig(configStr: string): any {
  try {
    // Remove 'const firebaseConfig =' and any semicolons
    let cleanStr = configStr.trim();
    cleanStr = cleanStr.replace(/^(const|let|var)\s+\w+\s*=\s*/, '');
    cleanStr = cleanStr.replace(/;+$/, '');
    cleanStr = cleanStr.trim();

    // Try JSON.parse first (in case it's already valid JSON)
    try {
      return JSON.parse(cleanStr);
    } catch (jsonError) {
      // If JSON.parse fails, parse as JavaScript object literal using regex
      // Extract the object content (remove outer braces)
      const objectMatch = cleanStr.match(/^\s*\{([\s\S]*)\}\s*$/);
      if (!objectMatch) {
        throw new Error('Invalid format - expected an object {...}');
      }

      const objectContent = objectMatch[1];
      const config: any = {};

      // Parse key-value pairs using regex
      // Matches: key: "value" or key: 'value' or key: value
      const keyValueRegex = /(\w+)\s*:\s*(?:"([^"]*)"|'([^']*)'|([^,}\s]+))/g;
      let match;

      while ((match = keyValueRegex.exec(objectContent)) !== null) {
        const key = match[1];
        // Value can be in double quotes (match[2]), single quotes (match[3]), or unquoted (match[4])
        const value = match[2] || match[3] || match[4];
        config[key] = value;
      }

      // Validate required fields
      if (!config.apiKey || !config.projectId) {
        throw new Error('Missing required fields: apiKey and projectId are required');
      }

      console.log('[parseFirebaseConfig] Parsed config:', {
        keys: Object.keys(config),
        projectId: config.projectId,
        hasApiKey: !!config.apiKey
      });

      return config;
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Invalid Firebase config format: ${errorMsg}\n\nPlease paste the entire firebaseConfig object from your Firebase console.`);
  }
}

/**
 * User Firebase Provider: User provides their own Firebase configuration
 * Unlimited usage (user pays for their own Firebase/Vertex AI costs)
 */
const userFirebaseProvider: AIProvider = {
  id: 'userFirebase',
  name: 'Firebase with Gemini (Unlimited)',
  description: 'Connect your own Firebase project with Gemini AI. No daily limits - you control the costs. Just paste your entire Firebase config.',
  requiresConfig: true,
  supportsVision: true,
  configFields: [
    {
      key: 'firebaseConfigRaw',
      label: 'Firebase Configuration',
      type: 'textarea',
      placeholder: `const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abc123",
  measurementId: "G-XXXXXXXXXX"
};`,
      required: true,
      helpText: 'Paste your entire firebaseConfig object from Firebase Console → Project Settings → General → Your apps. IMPORTANT: Enable Vertex AI API in your Firebase project first!'
    },
    {
      key: 'location',
      label: 'Vertex AI Location',
      type: 'select',
      options: ['us-central1', 'europe-west1', 'asia-southeast1'],
      required: true,
      helpText: 'Region where your Vertex AI is enabled'
    }
  ],

  generateContent: async (prompt: string, config: any) => {
    try {
      console.log('[Firebase Provider] Starting generateContent');
      console.log('[Firebase Provider] Raw config:', config);

      const { initializeApp, getApps } = await import('firebase/app');
      const { getAI, getGenerativeModel, VertexAIBackend } = await import('firebase/ai');

      // Parse Firebase config from the raw string
      console.log('[Firebase Provider] Parsing config string...');
      const firebaseConfig = parseFirebaseConfig(config.firebaseConfigRaw);
      console.log('[Firebase Provider] Parsed Firebase config:', {
        projectId: firebaseConfig.projectId,
        hasApiKey: !!firebaseConfig.apiKey
      });

      // Check if app already exists
      let app;
      const existingApps = getApps();
      const userAppName = 'user-firebase-app';
      const existingApp = existingApps.find(a => a.name === userAppName);

      if (existingApp) {
        console.log('[Firebase Provider] Using existing Firebase app');
        app = existingApp;
      } else {
        console.log('[Firebase Provider] Initializing new Firebase app');
        app = initializeApp({
          apiKey: firebaseConfig.apiKey,
          authDomain: firebaseConfig.authDomain,
          projectId: firebaseConfig.projectId,
          storageBucket: firebaseConfig.storageBucket,
          messagingSenderId: firebaseConfig.messagingSenderId,
          appId: firebaseConfig.appId
        }, userAppName);
      }

      const location = config.location || 'us-central1';
      console.log('[Firebase Provider] Using Vertex AI location:', location);

      const ai = getAI(app, {
        backend: new VertexAIBackend(location)
      });

      const model = getGenerativeModel(ai, {
        model: 'gemini-2.5-flash'
      });

      console.log('[Firebase Provider] Sending request to AI...');
      const result = await model.generateContent(prompt);
      console.log('[Firebase Provider] Received response');
      return result.response.text();
    } catch (error) {
      console.error('[Firebase Provider] Error:', error);
      throw error;
    }
  },

  analyzeImage: async (imageDataUrl: string, prompt: string, config: any) => {
    const { initializeApp, getApps } = await import('firebase/app');
    const { getAI, getGenerativeModel, VertexAIBackend } = await import('firebase/ai');

    // Parse Firebase config from the raw string
    const firebaseConfig = parseFirebaseConfig(config.firebaseConfigRaw);

    // Initialize or get existing app
    let app;
    const existingApps = getApps();
    const userAppName = 'user-firebase-app';
    const existingApp = existingApps.find(a => a.name === userAppName);

    if (existingApp) {
      app = existingApp;
    } else {
      app = initializeApp({
        apiKey: firebaseConfig.apiKey,
        authDomain: firebaseConfig.authDomain,
        projectId: firebaseConfig.projectId,
        storageBucket: firebaseConfig.storageBucket,
        messagingSenderId: firebaseConfig.messagingSenderId,
        appId: firebaseConfig.appId
      }, userAppName);
    }

    const ai = getAI(app, {
      backend: new VertexAIBackend(config.location || 'us-central1')
    });

    const model = getGenerativeModel(ai, {
      model: 'gemini-2.5-flash'
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
  userFirebase: userFirebaseProvider,
  openai: openaiProvider,
  claude: claudeProvider
};

/**
 * Get provider by ID
 */
export function getProvider(providerId: string): AIProvider {
  return AI_PROVIDERS[providerId] || AI_PROVIDERS.userFirebase;
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
