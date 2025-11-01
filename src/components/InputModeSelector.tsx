/**
 * Input Mode Selector Component
 * Input mode selector: manual entry / PDF upload / screenshot analysis
 */

export type InputMode = 'manual' | 'pdf' | 'screenshot';

interface InputModeSelectorProps {
  selectedMode: InputMode;
  onModeChange: (mode: InputMode) => void;
  disabled?: boolean;
}

interface ModeConfig {
  id: InputMode;
  label: string;
  icon: string;
  description: string;
  badge?: string;
  badgeColor?: string;
}

const modes: ModeConfig[] = [
  {
    id: 'manual',
    label: 'Manual Input',
    icon: '✍️',
    description: 'Type or paste text directly',
    badge: 'Recommended',
    badgeColor: 'bg-green-100 text-green-800',
  },
  {
    id: 'pdf',
    label: 'PDF Upload',
    icon: '📄',
    description: 'Upload a resume PDF file',
    badge: 'Secure',
    badgeColor: 'bg-[#EAF3FF] text-[#0A66C2]',
  },
  {
    id: 'screenshot',
    label: 'LinkedIn Snapshot',
    icon: '📸',
    description: 'Analyze a captured LinkedIn page',
    badge: 'Beta',
    badgeColor: 'bg-yellow-100 text-yellow-800',
  },
];

export function InputModeSelector({ selectedMode, onModeChange, disabled = false }: InputModeSelectorProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">📋 Select input mode</h3>
        <span className="text-xs text-gray-500">Choose the option that fits best</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {modes.map((mode) => {
          const isSelected = selectedMode === mode.id;
          const isDisabled = disabled;

          return (
            <button
              key={mode.id}
              onClick={() => !isDisabled && onModeChange(mode.id)}
              disabled={isDisabled}
              className={`
                relative p-3 rounded-lg border-2 transition-all duration-200
                ${isSelected
                   ? 'border-[#0A66C2] bg-[#EAF3FF] shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                }
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {/* Icon and copy */}
              <div className="flex flex-col items-center space-y-2">
                <span className="text-2xl">{mode.icon}</span>
                <div className="text-center">
                  <p className={`text-xs font-semibold ${isSelected ? 'text-[#0A66C2]' : 'text-gray-700'}`}>
                    {mode.label}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-1 leading-tight">
                    {mode.description}
                  </p>
                </div>
              </div>

              {/* Badge */}
              {mode.badge && (
                <div className="absolute -top-2 -right-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${mode.badgeColor} shadow-sm`}>
                    {mode.badge}
                  </span>
                </div>
              )}

              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                  <div className="w-8 h-1 bg-[#0A66C2] rounded-full"></div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Mode hint */}
      <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-xs text-gray-600 flex items-start">
          <svg className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {selectedMode === 'manual' && 'Safest option - paste your resume content directly.'}
          {selectedMode === 'pdf' && 'PDF files are parsed locally; nothing is uploaded to a server.'}
          {selectedMode === 'screenshot' && '⚠️ Experimental feature. Review the disclaimer before use.'}
        </p>
      </div>
    </div>
  );
}
