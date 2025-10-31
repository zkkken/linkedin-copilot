/**
 * PDF Parser Utility
 * 使用 PDF.js 在客户端解析 PDF 文件，完全不上传数据
 */

import * as pdfjsLib from 'pdfjs-dist';

// 配置 PDF.js worker
// 使用本地 worker 文件（Chrome 扩展环境）
if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL) {
  // Chrome 扩展环境
  pdfjsLib.GlobalWorkerOptions.workerSrc = chrome.runtime.getURL('pdf.worker.min.mjs');
} else {
  // 开发环境回退
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

export interface PDFParseResult {
  text: string;
  pageCount: number;
  fileName: string;
}

export interface PDFParseProgress {
  currentPage: number;
  totalPages: number;
  percentage: number;
}

/**
 * 解析 PDF 文件并提取文本内容
 * @param file PDF 文件对象
 * @param onProgress 进度回调函数
 * @returns 解析结果
 */
export async function parsePDF(
  file: File,
  onProgress?: (progress: PDFParseProgress) => void
): Promise<PDFParseResult> {
  try {
    // 文件大小限制：5MB
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('PDF 文件大小不能超过 5MB');
    }

    // 检查文件类型
    if (file.type !== 'application/pdf') {
      throw new Error('请上传 PDF 格式的文件');
    }

    // 将文件转换为 ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // 加载 PDF 文档
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      useSystemFonts: true,
    });

    const pdf = await loadingTask.promise;
    const totalPages = pdf.numPages;
    let fullText = '';

    // 逐页提取文本
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      // 拼接页面文本
      const pageText = textContent.items
        .map((item: any) => {
          // 处理文本项
          if ('str' in item) {
            return item.str;
          }
          return '';
        })
        .join(' ');

      fullText += pageText + '\n\n';

      // 报告进度
      if (onProgress) {
        onProgress({
          currentPage: pageNum,
          totalPages: totalPages,
          percentage: Math.round((pageNum / totalPages) * 100),
        });
      }
    }

    return {
      text: fullText.trim(),
      pageCount: totalPages,
      fileName: file.name,
    };
  } catch (error) {
    console.error('PDF 解析错误:', error);
    if (error instanceof Error) {
      throw new Error(`PDF 解析失败: ${error.message}`);
    }
    throw new Error('PDF 解析失败，请确保文件未损坏');
  }
}

/**
 * 从解析的文本中提取关键部分（可选的辅助函数）
 * @param text 完整文本
 * @returns 结构化数据
 */
export function extractResumeSection(text: string): {
  experience?: string;
  education?: string;
  skills?: string;
} {
  // 这里可以实现更复杂的文本分析
  // 暂时返回整个文本作为经验部分
  return {
    experience: text,
  };
}
