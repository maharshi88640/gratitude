import React from 'react';
import { Brain, BarChart3, Book, AlertTriangle, Plus } from 'lucide-react';

interface BottomToolbarProps {
  onReflectionClick: () => void;
  onReportClick: () => void;
  onJournalClick: () => void;
  onCrisisClick: () => void;
  onNewPostClick: () => void;
}

const BottomToolbar: React.FC<BottomToolbarProps> = ({
  onReflectionClick,
  onReportClick,
  onJournalClick,
  onCrisisClick,
  onNewPostClick,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-6xl mx-auto px-2 sm:px-4">
        <div className="flex justify-around items-center py-2 sm:py-3">
          {/* New Post - Center/Focused */}
          <button
            onClick={onNewPostClick}
            className="flex flex-col items-center space-y-1 p-2 text-gray-700 hover:text-purple-600 transition-colors group"
          >
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg transform group-hover:scale-110 transition-transform">
              <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-xs font-medium hidden sm:block">New Post</span>
          </button>

          {/* Reflection Mode */}
          <button
            onClick={onReflectionClick}
            className="flex flex-col items-center space-y-1 p-2 text-gray-700 hover:text-purple-600 transition-colors group"
          >
            <Brain className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium hidden sm:block">Reflect</span>
          </button>

          {/* Journal */}
          <button
            onClick={onJournalClick}
            className="flex flex-col items-center space-y-1 p-2 text-gray-700 hover:text-purple-600 transition-colors group"
          >
            <Book className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium hidden sm:block">Journal</span>
          </button>

          {/* Weekly Report */}
          <button
            onClick={onReportClick}
            className="flex flex-col items-center space-y-1 p-2 text-gray-700 hover:text-purple-600 transition-colors group"
          >
            <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium hidden sm:block">Report</span>
          </button>

          {/* Crisis Support */}
          <button
            onClick={onCrisisClick}
            className="flex flex-col items-center space-y-1 p-2 text-gray-700 hover:text-red-600 transition-colors group"
          >
            <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium hidden sm:block">Support</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BottomToolbar;
