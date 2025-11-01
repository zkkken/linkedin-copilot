export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-4">
      {/* LinkedIn-style loading animation */}
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="w-16 h-16 border-4 border-[#B3D6F2] border-t-[#0A66C2] rounded-full animate-spin"></div>
        </div>
      </div>

      {/* Loading copy */}
      <div className="text-center space-y-2">
        <p className="text-sm font-medium text-gray-700 animate-pulse">
          Optimizing your profile content...
        </p>
        <p className="text-xs text-gray-500">
          Gemini AI is analyzing your content and preparing tailored guidance
        </p>
      </div>

      {/* Progress dots */}
      <div className="flex space-x-2">
        <div className="w-2 h-2 bg-[#0A66C2] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-[#0A66C2] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-[#0A66C2] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
};
