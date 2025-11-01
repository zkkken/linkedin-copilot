/**
 * Screenshot Capture Utility
 * Uses the Chrome API to capture the current tab.
 */

export interface CaptureResult {
  dataUrl: string; // base64-encoded image
  timestamp: number;
}

/**
 * Capture the visible region of the active tab.
 */
export async function captureCurrentTab(): Promise<CaptureResult> {
  try {
    if (typeof chrome === 'undefined' || !chrome.tabs) {
      throw new Error('This feature is only available in a Chrome extension environment.');
    }

    const dataUrl = await new Promise<string>((resolve, reject) => {
      chrome.tabs.captureVisibleTab(
        {
          format: 'png',
          quality: 90, // high quality for OCR accuracy
        },
        (result) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(result);
          }
        }
      );
    });

    return {
      dataUrl,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('Screenshot capture failed:', error);
    if (error instanceof Error) {
      throw new Error(`Screenshot capture failed: ${error.message}`);
    }
    throw new Error('Screenshot capture failed. Please ensure the proper permissions are granted.');
  }
}

/**
 * Determine whether the current tab is a LinkedIn page.
 */
export async function isLinkedInPage(): Promise<boolean> {
  try {
    if (typeof chrome === 'undefined' || !chrome.tabs) {
      return false;
    }

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab.url) {
      return false;
    }

    return tab.url.includes('linkedin.com');
  } catch (error) {
    console.error('Failed to inspect page URL:', error);
    return false;
  }
}
