/**
 * LinkedIn Safe Co-Pilot - Character Count Component
 *
 * 显示字符计数和LinkedIn限制提示
 */

import { getCharacterCount } from '../utils/promptTemplates';
import type { SectionType } from '../types';

interface CharacterCountProps {
  content: string;
  sectionType: SectionType;
}

export const CharacterCount: React.FC<CharacterCountProps> = ({ content, sectionType }) => {
  const { count, limit, status } = getCharacterCount(content, sectionType);

  if (!limit) {
    // 如果没有限制，只显示字符数
    return (
      <div className="text-xs text-gray-500 mt-1">
        {count} 字符
      </div>
    );
  }

  const percentage = (count / limit) * 100;

  return (
    <div className="mt-1 space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className={`font-medium ${
          status === 'error'
            ? 'text-red-600'
            : status === 'warning'
            ? 'text-amber-600'
            : 'text-gray-600'
        }`}>
          {count} / {limit} 字符
        </span>
        <span className={`text-xs ${
          status === 'error'
            ? 'text-red-600'
            : status === 'warning'
            ? 'text-amber-600'
            : 'text-gray-500'
        }`}>
          {percentage.toFixed(0)}%
        </span>
      </div>

      {/* 进度条 */}
      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            status === 'error'
              ? 'bg-red-500'
              : status === 'warning'
              ? 'bg-amber-500'
              : 'bg-[#0A66C2]'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      {/* 状态提示 */}
      {status === 'error' && (
        <p className="text-xs text-red-600 flex items-center mt-1">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          超出 LinkedIn 限制！请缩短内容
        </p>
      )}
      {status === 'warning' && (
        <p className="text-xs text-amber-600 flex items-center mt-1">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          接近限制，建议精简内容
        </p>
      )}
    </div>
  );
};
