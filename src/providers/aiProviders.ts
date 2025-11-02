/**
 * AI Provider Implementations
 * Centralized AI provider management with multiple backends
 */

import type { AIProvider } from './types';

/**
 * Default Provider: Uses the extension's Firebase configuration
 * Limited to 10 optimizations per day (free tier)
 */
const defaultProvider: AIProvider = {
  id: 'default',
  name: 'Default (Free Tier - 10/day)',
  description: 'Use our shared Firebase + Gemini 2.5 Flash. Limited to 10 optimizations per day.',
  requiresConfig: false,
  configFields: [],
  supportsVision: true,

  generateContent: async (prompt: string) => {
    const { model } = await import('../firebase');
    const result = await model.generateContent(prompt);
    return result.response.text();
  },

  analyzeImage: async (imageDataUrl: string, prompt: string) => {
    const { analyzeScreenshot } = await import('../firebase');
    return await analyzeScreenshot(imageDataUrl, prompt);
  }
};

/**
 * User Firebase Provider: User provides their own Firebase configuration
 * Unlimited usage (user pays for their own Firebase/Vertex AI costs)
 */
const userFirebaseProvider: AIProvider = {
  id: 'userFirebase',
  name: 'Your Own Firebase (Unlimited)',
  description: 'Connect your own Firebase project with Vertex AI. No daily limits - you control the costs.',
  requiresConfig: true,
  supportsVision: true,
  configFields: [
    {
      key: 'apiKey',
      label: 'Firebase API Key',
      type: 'password',
      placeholder: 'AIza...',
      required: true,
      helpText: 'Get from Firebase Console → Project Settings → General'
    },
    {
      key: 'authDomain',
      label: 'Auth Domain',
      type: 'text',
      placeholder: 'your-project.firebaseapp.com',
      required: true
    },
    {
      key: 'projectId',
      label: 'Project ID',
      type: 'text',
      placeholder: 'your-project-id',
      required: true,
      helpText: 'Your Firebase project identifier'
    },
    {
      key: 'storageBucket',
      label: 'Storage Bucket',
      type: 'text',
      placeholder: 'your-project.appspot.com',
      required: true
    },
    {
      key: 'messagingSenderId',
      label: 'Messaging Sender ID',
      type: 'text',
      placeholder: '1234567890',
      required: true
    },
    {
      key: 'appId',
      label: 'App ID',
      type: 'text',
      placeholder: '1:1234567890:web:abc123',
      required: true
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
    const { initializeApp, getApps } = await import('firebase/app');
    const { getVertexAI, getGenerativeModel } = await import('firebase/vertexai');

    // Check if app already exists
    let app;
    const existingApps = getApps();
    const userAppName = 'user-firebase-app';
    const existingApp = existingApps.find(a => a.name === userAppName);

    if (existingApp) {
      app = existingApp;
    } else {
      app = initializeApp({
        apiKey: config.apiKey,
        authDomain: config.authDomain,
        projectId: config.projectId,
        storageBucket: config.storageBucket,
        messagingSenderId: config.messagingSenderId,
        appId: config.appId
      }, userAppName);
    }

    const vertexAI = getVertexAI(app, {
      location: config.location || 'us-central1'
    });

    const model = getGenerativeModel(vertexAI, {
      model: 'gemini-2.0-flash-exp'
    });

    const result = await model.generateContent(prompt);
    return result.response.text();
  },

  analyzeImage: async (imageDataUrl: string, prompt: string, config: any) => {
    const { initializeApp, getApps } = await import('firebase/app');
    const { getVertexAI, getGenerativeModel } = await import('firebase/vertexai');

    // Initialize or get existing app
    let app;
    const existingApps = getApps();
    const userAppName = 'user-firebase-app';
    const existingApp = existingApps.find(a => a.name === userAppName);

    if (existingApp) {
      app = existingApp;
    } else {
      app = initializeApp({
        apiKey: config.apiKey,
        authDomain: config.authDomain,
        projectId: config.projectId,
        storageBucket: config.storageBucket,
        messagingSenderId: config.messagingSenderId,
        appId: config.appId
      }, userAppName);
    }

    const vertexAI = getVertexAI(app, {
      location: config.location || 'us-central1'
    });

    const model = getGenerativeModel(vertexAI, {
      model: 'gemini-2.0-flash-exp'
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
  default: defaultProvider,
  userFirebase: userFirebaseProvider,
  openai: openaiProvider,
  claude: claudeProvider
};

/**
 * Get provider by ID
 */
export function getProvider(providerId: string): AIProvider {
  return AI_PROVIDERS[providerId] || AI_PROVIDERS.default;
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
