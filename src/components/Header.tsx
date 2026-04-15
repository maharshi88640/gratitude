import React, { useState } from 'react';
import { Sparkles, Heart, User } from 'lucide-react';
import StreakCounter from './StreakCounter';
import WeeklyReport from './WeeklyReport';
import CrisisSupport from './CrisisSupport';
import GratitudeJournal from './GratitudeJournal';
import { UserStats } from '../types';

interface HeaderProps {
  totalPosts: number;
  totalLikes: number;
  userStats: UserStats;
  onProfileClick: () => void;
  onShowMyPosts?: () => void;
  showMyPostsOnly?: boolean;
}

const Header: React.FC<HeaderProps> = ({ totalPosts, totalLikes, userStats, onProfileClick, onShowMyPosts, showMyPostsOnly }) => {
  const [showReport, setShowReport] = useState(false);
  const [showCrisisSupport, setShowCrisisSupport] = useState(false);
  const [showGratitudeJournal, setShowGratitudeJournal] = useState(false);

  return (
    <>
      <header className="relative overflow-hidden bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
        <div className="relative max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-10">
          {/* Navigation */}
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-full">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-yellow-200">
                Gratitude Wall
              </h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={onProfileClick}
                className="p-3 bg-white/20 text-white rounded-full hover:bg-white/30 transition-all duration-200"
              >
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Compact Stats */}
          <div className="flex justify-center items-center space-x-6 sm:space-x-8 text-white/80 mb-6">
            <button 
              onClick={onShowMyPosts}
              className={`flex items-center space-x-2 hover:text-white transition-colors group ${showMyPostsOnly ? 'text-white' : 'text-white/80'}`}
              title="Show my posts first"
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
              <span className="text-sm sm:text-base font-medium">{totalPosts} Moments</span>
              {showMyPostsOnly && (
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">My Posts First</span>
              )}
            </button>
            <div className="flex items-center space-x-2">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base font-medium">{totalLikes} Hearts</span>
            </div>
          </div>

          
          {/* Streak Counter */}
          <div className="max-w-md mx-auto">
            <StreakCounter stats={userStats} />
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-pink-400/20 rounded-full blur-lg"></div>
      </header>

      {/* Weekly Report Modal */}
      <WeeklyReport isOpen={showReport} stats={userStats} onClose={() => setShowReport(false)} />

      {/* Crisis Support Modal */}
      {showCrisisSupport && (
        <CrisisSupport onClose={() => setShowCrisisSupport(false)} />
      )}

      {/* Gratitude Journal Modal */}
      {showGratitudeJournal && (
        <GratitudeJournal onClose={() => setShowGratitudeJournal(false)} />
      )}
    </>
  );
};

export default Header;