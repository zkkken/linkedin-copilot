import { useRef, useState } from 'react';
import { parsePDF, type PDFParseProgress } from '../utils/pdfParser';

interface FileUploadProps {
  onTextExtracted: (text: string, fileName: string) => void;
  disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onTextExtracted,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<PDFParseProgress | null>(null);
  const [error, setError] = useState<string>('');
  const [uploadedFileName, setUploadedFileName] = useState<string>('');

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setError('');
    setProgress(null);

    try {
      // 解析 PDF
      const result = await parsePDF(file, (prog) => {
        setProgress(prog);
      });

      // 提取成功
      setUploadedFileName(result.fileName);
      onTextExtracted(result.text, result.fileName);
      setProgress(null);
    } catch (err) {
      console.error('文件处理错误:', err);
      setError(err instanceof Error ? err.message : '文件处理失败');
      setUploadedFileName('');
    } finally {
      setIsProcessing(false);
      // 清空 input，允许重新上传相同文件
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      {/* 隐藏的文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isProcessing}
      />

      {/* 上传按钮 */}
      <button
        onClick={handleButtonClick}
        disabled={disabled || isProcessing}
        className={`w-full py-2.5 px-4 border-2 border-dashed rounded-lg text-sm font-medium transition-all ${
          disabled || isProcessing
            ? 'border-gray-300 bg-gray-50 text-gray-400 cursor-not-allowed'
            : 'border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:border-blue-400 cursor-pointer'
        }`}
      >
        {isProcessing ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-700"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            解析中...
          </span>
        ) : (
          <span className="flex items-center justify-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            上传 PDF 简历
          </span>
        )}
      </button>

      {/* 进度条 */}
      {progress && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-600">
            <span>
              正在解析第 {progress.currentPage} / {progress.totalPages} 页
            </span>
            <span>{progress.percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress.percentage}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* 成功提示 */}
      {uploadedFileName && !isProcessing && !error && (
        <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-md">
          <svg
            className="w-5 h-5 text-green-600 mr-2 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-sm text-green-800 truncate">
            {uploadedFileName} 已解析
          </span>
        </div>
      )}

      {/* 错误提示 */}
      {error && (
        <div className="flex items-start p-3 bg-red-50 border border-red-200 rounded-md">
          <svg
            className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-sm text-red-800">{error}</span>
        </div>
      )}

      {/* 隐私提示 */}
      <div className="flex items-start p-3 bg-blue-50 border border-blue-200 rounded-md">
        <svg
          className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        <p className="text-xs text-blue-800">
          <strong>隐私保护：</strong>您的简历文件仅在本地浏览器中处理，不会被上传到任何服务器。
        </p>
      </div>
    </div>
  );
};
