'use client';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
}

export default function Loading({ size = 'md', text, fullScreen = false }: LoadingProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const containerClasses = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 backdrop-blur-sm z-50'
    : 'flex items-center justify-center min-h-[80vh] p-8';

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="relative">
          {/* Outer ring */}
          <div
            className={`${sizeClasses[size]} border-4 border-primary-200 rounded-full animate-pulse`}
          ></div>
          {/* Spinning ring */}
          <div
            className={`absolute inset-0 ${sizeClasses[size]} border-4 border-transparent border-t-primary-600 rounded-full animate-spin`}
          ></div>
        </div>

        {/* Loading text */}
        {text && (
          <p className="text-gray-700 font-medium animate-pulse">{text}</p>
        )}

        {/* Dots animation */}
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}
