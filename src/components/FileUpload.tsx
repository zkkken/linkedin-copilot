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
      // Parse PDF
      const result = await parsePDF(file, (prog) => {
        setProgress(prog);
      });

      // Extraction succeeded
      setUploadedFileName(result.fileName);
      onTextExtracted(result.text, result.fileName);
      setProgress(null);
    } catch (err) {
      console.error('File processing error:', err);
      setError(err instanceof Error ? err.message : 'File processing failed');
      setUploadedFileName('');
    } finally {
      setIsProcessing(false);
      // Reset the input so the same file can be uploaded again
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
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isProcessing}
      />

      {/* Upload button */}
      <button
        onClick={handleButtonClick}
        disabled={disabled || isProcessing}
        className={`w-full py-2.5 px-4 border-2 border-dashed rounded-lg text-sm font-medium transition-all ${
          disabled || isProcessing
            ? 'border-gray-300 bg-gray-50 text-gray-400 cursor-not-allowed'
            : 'border-[#0A66C2] bg-[#EAF3FF] text-[#0A66C2] hover:bg-[#D8EAFE] hover:border-[#0A66C2] cursor-pointer'
        }`}
      >
        {isProcessing ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#0A66C2]"
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
            Processing...
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
            Upload PDF resume
          </span>
        )}
      </button>

      {/* Progress bar */}
      {progress && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-600">
            <span>
              Parsing page {progress.currentPage} / {progress.totalPages}
            </span>
            <span>{progress.percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#0A66C2] h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress.percentage}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Success notice */}
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
            {uploadedFileName} processed
          </span>
        </div>
      )}

      {/* Error notice */}
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

      {/* Privacy notice */}
      <div className="flex items-start p-3 bg-[#EAF3FF] border border-[#B3D6F2] rounded-md">
        <svg
          className="w-5 h-5 text-[#0A66C2] mr-2 flex-shrink-0 mt-0.5"
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
        <p className="text-xs text-[#0A66C2]">
          <strong>Privacy:</strong> Your resume is processed locally in the browser and never uploaded to any server.
        </p>
      </div>
    </div>
  );
};
