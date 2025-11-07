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

    console.log(`[PDF Parser] Starting extraction from ${totalPages} page(s)`);

    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      console.log(`[PDF Parser] Page ${pageNum}: ${textContent.items.length} text items`);

      // Reconstruct text with proper line breaks based on Y coordinates
      let pageText = '';
      let lastY: number | null = null;
      const LINE_HEIGHT_THRESHOLD = 5; // Minimum Y difference to consider a new line

      for (const item of textContent.items) {
        if (!('str' in item)) continue;

        const currentY = item.transform[5]; // Y coordinate

        // Detect new line: significant Y coordinate change
        if (lastY !== null && Math.abs(currentY - lastY) > LINE_HEIGHT_THRESHOLD) {
          pageText += '\n';
        } else if (pageText.length > 0 && !pageText.endsWith('\n')) {
          // Same line, add space
          pageText += ' ';
        }

        pageText += item.str;
        lastY = currentY;
      }

      console.log(`[PDF Parser] Page ${pageNum} text length: ${pageText.length} chars`);
      console.log(`[PDF Parser] Page ${pageNum} first 3 lines:\n${pageText.split('\n').slice(0, 3).join('\n')}`);

      fullText += pageText + '\n\n';

      if (onProgress) {
        onProgress({
          currentPage: pageNum,
          totalPages,
          percentage: Math.round((pageNum / totalPages) * 100),
        });
      }
    }

    const trimmedText = fullText.trim();
    const lineCount = trimmedText.split('\n').length;
    console.log(`[PDF Parser] ✅ Extraction complete: ${trimmedText.length} total characters, ${lineCount} lines`);
    console.log(`[PDF Parser] Full text preview (first 500 chars):\n${trimmedText.substring(0, 500)}`);

    return {
      text: trimmedText,
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
