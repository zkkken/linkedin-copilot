/**
 * Screenshot Capture Utility
 * 使用 Chrome API 捕获当前标签页的截图
 */

export interface CaptureResult {
  dataUrl: string; // base64 编码的图片
  timestamp: number;
}

/**
 * 捕获当前活动标签页的可见区域
 * @returns 包含图片 data URL 的结果对象
 */
export async function captureCurrentTab(): Promise<CaptureResult> {
  try {
    // 检查是否在 Chrome 扩展环境中
    if (typeof chrome === 'undefined' || !chrome.tabs) {
      throw new Error('此功能仅在 Chrome 扩展环境中可用');
    }

    // 捕获当前标签页的可见区域
    // 使用Promise包装以兼容Chrome API
    const dataUrl = await new Promise<string>((resolve, reject) => {
      chrome.tabs.captureVisibleTab(
        {
          format: 'png',
          quality: 90, // 高质量以便 OCR 准确识别
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
    console.error('截图捕获失败:', error);
    if (error instanceof Error) {
      throw new Error(`截图失败: ${error.message}`);
    }
    throw new Error('截图失败，请确保已授予必要的权限');
  }
}

/**
 * 从 data URL 中提取 base64 数据（移除前缀）
 * @param dataUrl 完整的 data URL
 * @returns 纯 base64 字符串
 */
export function extractBase64FromDataUrl(dataUrl: string): string {
  const parts = dataUrl.split(',');
  if (parts.length < 2) {
    throw new Error('无效的 data URL 格式');
  }
  return parts[1];
}

/**
 * 检查是否在 LinkedIn 页面
 * @returns 是否在 LinkedIn 页面
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
    console.error('检查页面 URL 失败:', error);
    return false;
  }
}
