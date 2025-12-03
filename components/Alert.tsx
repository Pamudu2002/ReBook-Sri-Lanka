'use client';

interface AlertProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  confirmText?: string;
}

export default function Alert({
  isOpen,
  onClose,
  title,
  message,
  type,
  confirmText = 'OK',
}: AlertProps) {
  if (!isOpen) return null;

  const typeStyles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-500',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      button: 'bg-green-600 hover:bg-green-700',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-500',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      button: 'bg-red-600 hover:bg-red-700',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-500',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      button: 'bg-yellow-600 hover:bg-yellow-700',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-500',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      button: 'bg-blue-600 hover:bg-blue-700',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  };

  const styles = typeStyles[type];

  return (
    <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full border-l-4 border-l-gray-400">
        {/* Header Section */}
        <div className={`${styles.bg} px-6 py-5 rounded-t-lg border-b border-gray-200`}>
          <div className="flex items-start gap-4">
            <div className={`${styles.iconColor} flex-shrink-0`}>
              {styles.icon}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
          </div>
        </div>

        {/* Message Section */}
        <div className="px-6 py-5">
          <p className="text-gray-700 text-sm leading-relaxed">{message}</p>
        </div>

        {/* Button Section */}
        <div className="px-6 pb-5">
          <button
            onClick={onClose}
            className={`w-full ${styles.button} text-white py-2.5 rounded font-medium transition-colors`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
