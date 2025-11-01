/**
 * StructuredField Component
 *
 * Render a single LinkedIn field (label, content, copy button, and character count)
 */

interface StructuredFieldProps {
  label: string;              // Field label (e.g., "Job title")
  value?: string;             // Field value
  maxLength?: number;         // Optional character limit
  icon?: string;              // Optional emoji icon
  multiline?: boolean;        // Render multi-line content
}

export const StructuredField: React.FC<StructuredFieldProps> = ({
  label,
  value,
  maxLength,
  icon,
  multiline = false
}) => {
  const safeValue = value ?? '';
  const currentLength = safeValue.length;
  const isOverLimit = maxLength ? currentLength > maxLength : false;
  const isNearLimit = maxLength ? currentLength > maxLength * 0.9 : false;

  return (
    <div className="mb-4 p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-[#0A66C2] transition-colors">
      {/* Label and copy button */}
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-semibold text-gray-700 flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          {label}
        </label>
        <div className="flex items-center space-x-2">
          {/* Character count */}
          {maxLength && (
            <span
              className={`text-xs font-medium px-2 py-1 rounded ${
                isOverLimit
                  ? 'bg-red-100 text-red-700'
                  : isNearLimit
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-green-100 text-green-700'
              }`}
            >
              {currentLength}/{maxLength}
            </span>
          )}
          {/* Copy button (compact) */}
          <button
            onClick={() => navigator.clipboard.writeText(safeValue)}
            className="p-1.5 rounded bg-[#EAF3FF] hover:bg-[#D8EAFE] text-[#0A66C2] transition-colors"
            title="Copy this field"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Field content */}
      {multiline ? (
        <div className="p-3 bg-gray-50 rounded border border-gray-200 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
          {safeValue.split('\n').map((line, index) => (
            <p key={index} className={line.startsWith('•') ? 'ml-2 mb-2' : 'mb-2'}>
              {line}
            </p>
          ))}
        </div>
      ) : (
        <div className="p-3 bg-gray-50 rounded border border-gray-200 text-sm text-gray-800">
          {safeValue}
        </div>
      )}

      {/* Limit warning */}
      {isOverLimit && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-start">
          <svg className="w-4 h-4 mr-1 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          Exceeds the LinkedIn character limit by {currentLength - maxLength!} characters. Please shorten manually.
        </div>
      )}
    </div>
  );
};
