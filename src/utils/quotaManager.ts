/**
 * Quota Management System
 * Manages daily usage limits for the default (free) provider
 */

import type { QuotaStatus } from '../providers/types';

const DAILY_LIMIT = 10; // Free tier: 10 optimizations per day
const STORAGE_KEY = 'dailyQuota';

interface StoredQuota {
  used: number;
  resetTime: number;
}

/**
 * Get current quota status
 */
export async function getQuotaStatus(): Promise<QuotaStatus> {
  // Check current provider
  const { aiProvider = 'default' } = await chrome.storage.local.get(['aiProvider']);

  // If using custom provider, unlimited
  if (aiProvider !== 'default') {
    return {
      dailyLimit: -1,
      used: 0,
      remaining: -1,
      resetTime: 0,
      isUnlimited: true
    };
  }

  // Get stored quota data
  const result = await chrome.storage.local.get([STORAGE_KEY]);
  const stored: StoredQuota = result[STORAGE_KEY] || {
    used: 0,
    resetTime: getNextResetTime()
  };

  const now = Date.now();

  // Reset if past reset time
  if (now >= stored.resetTime) {
    const newQuota: StoredQuota = {
      used: 0,
      resetTime: getNextResetTime()
    };
    await chrome.storage.local.set({ [STORAGE_KEY]: newQuota });

    return {
      dailyLimit: DAILY_LIMIT,
      used: 0,
      remaining: DAILY_LIMIT,
      resetTime: newQuota.resetTime,
      isUnlimited: false
    };
  }

  return {
    dailyLimit: DAILY_LIMIT,
    used: stored.used,
    remaining: Math.max(0, DAILY_LIMIT - stored.used),
    resetTime: stored.resetTime,
    isUnlimited: false
  };
}

/**
 * Check if user can make a request
 */
export async function canMakeRequest(): Promise<boolean> {
  const quota = await getQuotaStatus();

  // Unlimited for custom providers
  if (quota.isUnlimited) {
    return true;
  }

  // Check if under limit
  return quota.remaining > 0;
}

/**
 * Increment usage counter
 */
export async function incrementUsage(): Promise<void> {
  const { aiProvider = 'default' } = await chrome.storage.local.get(['aiProvider']);

  // Don't count for custom providers
  if (aiProvider !== 'default') {
    return;
  }

  const result = await chrome.storage.local.get([STORAGE_KEY]);
  const stored: StoredQuota = result[STORAGE_KEY] || {
    used: 0,
    resetTime: getNextResetTime()
  };

  const now = Date.now();

  // Reset if past reset time
  if (now >= stored.resetTime) {
    const newQuota: StoredQuota = {
      used: 1,
      resetTime: getNextResetTime()
    };
    await chrome.storage.local.set({ [STORAGE_KEY]: newQuota });
    return;
  }

  // Increment usage
  stored.used += 1;
  await chrome.storage.local.set({ [STORAGE_KEY]: stored });
}

/**
 * Get next reset time (midnight UTC)
 */
function getNextResetTime(): number {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  tomorrow.setUTCHours(0, 0, 0, 0);
  return tomorrow.getTime();
}

/**
 * Format reset time as human-readable string
 */
export function formatResetTime(timestamp: number): string {
  const now = Date.now();
  const diff = timestamp - now;

  if (diff <= 0) {
    return 'Now';
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `in ${hours}h ${minutes}m`;
  }
  return `in ${minutes}m`;
}

/**
 * Reset quota (for testing or manual reset)
 */
export async function resetQuota(): Promise<void> {
  const newQuota: StoredQuota = {
    used: 0,
    resetTime: getNextResetTime()
  };
  await chrome.storage.local.set({ [STORAGE_KEY]: newQuota });
}
