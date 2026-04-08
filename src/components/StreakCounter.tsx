import React from 'react';
import { Flame, Trophy, Calendar } from 'lucide-react';
import { UserStats } from '../types';

interface StreakCounterProps {
  stats: UserStats;
}

const StreakCounter: React.FC<StreakCounterProps> = ({ stats }) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Your Journey</h3>
        <div className="flex items-center space-x-2">
          <Flame className="w-5 h-5 text-orange-500" />
          <span className="text-2xl font-bold text-orange-500">{stats.currentStreak}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-2 mx-auto">
            <Flame className="w-6 h-6 text-orange-500" />
          </div>
          <p className="text-sm text-gray-600">Current Streak</p>
          <p className="text-xl font-bold text-gray-800">{stats.currentStreak}</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mb-2 mx-auto">
            <Trophy className="w-6 h-6 text-yellow-500" />
          </div>
          <p className="text-sm text-gray-600">Best Streak</p>
          <p className="text-xl font-bold text-gray-800">{stats.longestStreak}</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-2 mx-auto">
            <Calendar className="w-6 h-6 text-blue-500" />
          </div>
          <p className="text-sm text-gray-600">Total Posts</p>
          <p className="text-xl font-bold text-gray-800">{stats.totalPosts}</p>
        </div>
      </div>
      
      {stats.currentStreak > 0 && (
        <div className="mt-4 p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg">
          <p className="text-sm text-orange-700 text-center">
            🔥 You're on fire! Keep the gratitude flowing!
          </p>
        </div>
      )}
    </div>
  );
};

export default StreakCounter;