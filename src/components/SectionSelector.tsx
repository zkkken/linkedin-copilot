/**
 * LinkedIn Safe Co-Pilot - Section Selector Component
 *
 * Field type selector component
 */

import { getSectionOptions } from '../utils/sectionConfigs';
import type { SectionType } from '../types';

interface SectionSelectorProps {
  selectedSection: SectionType;
  onSectionChange: (section: SectionType) => void;
  disabled?: boolean;
}

export const SectionSelector: React.FC<SectionSelectorProps> = ({
  selectedSection,
  onSectionChange,
  disabled = false,
}) => {
  const options = getSectionOptions();

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Choose the section you want to optimize
      </label>
      <div className="relative">
        <select
          value={selectedSection}
          onChange={(e) => onSectionChange(e.target.value as SectionType)}
          disabled={disabled}
          className={`
            w-full px-4 py-2.5 pr-10
            border border-gray-300 rounded-lg
            text-sm font-medium
            bg-white
            appearance-none
            focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2]
            transition-all
            ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'cursor-pointer hover:border-[#0A66C2]'}
          `}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.icon} {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
