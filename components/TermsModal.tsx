'use client';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  title: string;
  content: string;
  warning: string;
  acceptText: string;
  declineText: string;
}

export default function TermsModal({
  isOpen,
  onClose,
  onAccept,
  title,
  content,
  warning,
  acceptText,
  declineText,
}: TermsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-primary-600 text-white px-4 md:px-6 py-3 md:py-4 flex-shrink-0">
          <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 overflow-y-auto flex-1">
          <div className="prose prose-sm max-w-none">
            <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-4">{content}</p>
            
            {/* Warning Box */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 md:p-4 mb-4">
              <p className="text-sm md:text-base text-yellow-800 font-semibold">{warning}</p>
            </div>

            <div className="bg-gray-50 p-3 md:p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">Key Points:</h3>
              <ul className="list-disc list-inside space-y-1 md:space-y-2 text-gray-700 text-xs md:text-sm">
                <li>All information must be accurate and truthful</li>
                <li>Misuse of platform is strictly prohibited</li>
                <li>False information may result in legal action</li>
                <li>This platform is for genuine assistance only</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 md:px-6 py-3 md:py-4 flex flex-col sm:flex-row gap-2 md:gap-3 justify-end border-t flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 md:px-6 py-2 md:py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-semibold transition-colors text-sm md:text-base"
          >
            {declineText}
          </button>
          <button
            onClick={onAccept}
            className="w-full sm:w-auto px-4 md:px-6 py-2 md:py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors text-sm md:text-base"
          >
            {acceptText}
          </button>
        </div>
      </div>
    </div>
  );
}
