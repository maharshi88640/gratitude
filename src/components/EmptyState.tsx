import React from 'react';
import { Heart, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  searchTerm?: string;
  onAddPost: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ searchTerm, onAddPost }) => {
  return (
    <div className="text-center py-16">
      <div className="max-w-md mx-auto">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
              <Heart className="w-12 h-12 text-purple-500" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
        
        {searchTerm ? (
          <>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No posts found for "{searchTerm}"
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or browse all gratitude posts
            </p>
          </>
        ) : (
          <>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Be the first to share gratitude!
            </h3>
            <p className="text-gray-600 mb-6">
              Start our community of thankfulness by sharing what you're grateful for today
            </p>
          </>
        )}
        
        <button
          onClick={onAddPost}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105"
        >
          <Sparkles className="w-5 h-5" />
          <span>Share Your Gratitude</span>
        </button>
      </div>
    </div>
  );
};

export default EmptyState;