/**
 * PDF Parser Utility
 * Uses PDF.js to parse PDF files entirely in the client (no uploads).
 */

import * as pdfjsLib from 'pdfjs-dist';

// Configure the PDF.js worker
// Use the local worker file when running inside the Chrome extension
if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = chrome.runtime.getURL('pdf.worker.min.mjs');
} else {
  // Development fallback
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
 * Parse a PDF file and extract its text content.
 * @param file PDF file object
 * @param onProgress optional progress callback
 */
export async function parsePDF(
  file: File,
  onProgress?: (progress: PDFParseProgress) => void
): Promise<PDFParseResult> {
  try {
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('PDF file size cannot exceed 5 MB.');
    }

    if (file.type !== 'application/pdf') {
      throw new Error('Please upload a PDF file.');
    }

    const arrayBuffer = await file.arrayBuffer();

    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      useSystemFonts: true,
    });

    const pdf = await loadingTask.promise;
    const totalPages = pdf.numPages;
    let fullText = '';

    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      const pageText = textContent.items
        .map((item: any) => ('str' in item ? item.str : ''))
        .join(' ');

      fullText += pageText + '\n\n';

      if (onProgress) {
        onProgress({
          currentPage: pageNum,
          totalPages,
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
    console.error('PDF parsing error:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to parse PDF: ${error.message}`);
    }
    throw new Error('Failed to parse PDF. Please confirm the file is not corrupted.');
  }
}
