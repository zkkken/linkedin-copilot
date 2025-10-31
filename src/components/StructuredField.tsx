/**
 * StructuredField Component
 *
 * 展示单个LinkedIn字段（带标签、内容、复制按钮和字符计数）
 */

interface StructuredFieldProps {
  label: string;              // 字段标签（如"职位头衔"）
  value: string;              // 字段值
  maxLength?: number;         // 最大字符数限制（可选）
  icon?: string;              // 可选图标emoji
  multiline?: boolean;        // 是否多行显示
}

export const StructuredField: React.FC<StructuredFieldProps> = ({
  label,
  value,
  maxLength,
  icon,
  multiline = false
}) => {
  const currentLength = value.length;
  const isOverLimit = maxLength ? currentLength > maxLength : false;
  const isNearLimit = maxLength ? currentLength > maxLength * 0.9 : false;

  return (
    <div className="mb-4 p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
      {/* 标签和复制按钮 */}
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-semibold text-gray-700 flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          {label}
        </label>
        <div className="flex items-center space-x-2">
          {/* 字符计数 */}
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
          {/* 复制按钮（小尺寸） */}
          <button
            onClick={() => navigator.clipboard.writeText(value)}
            className="p-1.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
            title="复制此字段"
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

      {/* 字段内容 */}
      {multiline ? (
        <div className="p-3 bg-gray-50 rounded border border-gray-200 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
          {value.split('\n').map((line, index) => (
            <p key={index} className={line.startsWith('•') ? 'ml-2 mb-2' : 'mb-2'}>
              {line}
            </p>
          ))}
        </div>
      ) : (
        <div className="p-3 bg-gray-50 rounded border border-gray-200 text-sm text-gray-800">
          {value}
        </div>
      )}

      {/* 超出限制警告 */}
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
          超出LinkedIn字符限制 {currentLength - maxLength!} 个字符，请手动编辑缩短
        </div>
      )}
    </div>
  );
};
