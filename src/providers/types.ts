/**
 * AI Provider System - Type Definitions
 * Supports multiple AI providers (Firebase/Gemini, OpenAI, Claude, etc.)
 */

export interface ConfigField {
  key: string;
  label: string;
  type: 'text' | 'password' | 'select';
  placeholder?: string;
  options?: string[];
  required: boolean;
  helpText?: string;
}

export interface AIProvider {
  id: string;
  name: string;
  description: string;
  requiresConfig: boolean;
  configFields: ConfigField[];
  generateContent: (prompt: string, config: any) => Promise<string>;
  supportsVision?: boolean;
  analyzeImage?: (imageDataUrl: string, prompt: string, config: any) => Promise<string>;
}

export interface AIProviderConfig {
  [key: string]: any;
}

export interface QuotaStatus {
  dailyLimit: number;
  used: number;
  remaining: number;
  resetTime: number;
  isUnlimited: boolean;
}
