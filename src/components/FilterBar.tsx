import React, { useState } from 'react';
import { Search, ChevronDown, TrendingUp, Clock, Users, Heart, Filter } from 'lucide-react';
import { PostCategory, MoodTag } from '../types';
import { categoryConfigs, moodTagConfigs } from '../utils/categories';

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategory: PostCategory | 'all';
  onCategoryChange: (category: PostCategory | 'all') => void;
  selectedMoodTag: MoodTag | 'all';
  onMoodTagChange: (tag: MoodTag | 'all') => void;
  selectedLocation: string;
  onLocationChange: (location: string) => void;
  sortBy: 'recent' | 'popular' | 'friends';
  onSortChange: (sort: 'recent' | 'popular' | 'friends') => void;
  showPrivate: boolean;
  onShowPrivateChange: (show: boolean) => void;
  showFriendsOnly: boolean;
  onShowFriendsOnlyChange: (show: boolean) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedMoodTag,
  onMoodTagChange,
  selectedLocation,
  onLocationChange,
  sortBy,
  onSortChange,
  showPrivate,
  onShowPrivateChange,
  showFriendsOnly,
  onShowFriendsOnlyChange,
}) => {
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showMoodDropdown, setShowMoodDropdown] = useState(false);

  const categories = Object.keys(categoryConfigs) as PostCategory[];
  const moodTags = Object.keys(moodTagConfigs) as MoodTag[];

  const getCategoryDisplay = () => {
    if (selectedCategory === 'all') return 'All Topics';
    return categoryConfigs[selectedCategory].name;
  };

  const getMoodDisplay = () => {
    if (selectedMoodTag === 'all') return 'All Moods';
    return moodTagConfigs[selectedMoodTag].name;
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm sticky top-0 z-40 border-b border-gray-200/30 shadow-sm">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-2 sm:py-3">
        <div className="flex flex-col gap-2 sm:gap-3">
          {/* Search - Compact */}
          <div className="relative w-full">
            <Search className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-8 sm:pl-10 pr-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm text-sm sm:text-base placeholder-gray-500"
            />
          </div>

          {/* Filters - More compact */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {/* Category Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="flex items-center space-x-1 px-1.5 sm:px-2 py-1.5 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg hover:bg-white hover:shadow-md transition-all duration-200 text-xs"
              >
                <span className="text-sm sm:text-base">
                  {selectedCategory === 'all' ? '✨' : 
                   selectedCategory === 'family' ? '👨‍👩‍👧‍👦' :
                   selectedCategory === 'health' ? '💪' :
                   selectedCategory === 'career' ? '💼' :
                   selectedCategory === 'nature' ? '🌿' :
                   selectedCategory === 'friendship' ? '🤝' :
                   selectedCategory === 'achievement' ? '🏆' :
                   selectedCategory === 'mindfulness' ? '🧘' :
                   selectedCategory === 'love' ? '💕' :
                   selectedCategory === 'food' ? '🍽️' :
                   selectedCategory === 'relationships' ? '❤️' : '✨'}
                </span>
                <span className="font-medium text-gray-700 hidden sm:inline text-xs">{getCategoryDisplay()}</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showCategoryDropdown && (
                <div className="absolute top-full left-0 mt-2 w-48 sm:w-56 lg:w-64 bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 py-2 z-50 max-h-60 overflow-y-auto">
                  <button
                    onClick={() => {
                      onCategoryChange('all');
                      setShowCategoryDropdown(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                      selectedCategory === 'all' ? 'bg-purple-50 text-purple-700' : 'text-gray-700'
                    }`}
                  >
                    <span className="text-lg">✨</span>
                    <span className="font-medium">All Topics</span>
                  </button>
                  
                  {categories.map((category) => {
                    const config = categoryConfigs[category];
                    const isSelected = selectedCategory === category;
                    
                    return (
                      <button
                        key={category}
                        onClick={() => {
                          onCategoryChange(category);
                          setShowCategoryDropdown(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                          isSelected ? 'bg-purple-50 text-purple-700' : 'text-gray-700'
                        }`}
                      >
                        <span className="text-lg">
                          {category === 'family' && '👨‍👩‍👧‍👦'}
                          {category === 'health' && '💪'}
                          {category === 'career' && '💼'}
                          {category === 'nature' && '🌿'}
                          {category === 'friendship' && '🤝'}
                          {category === 'achievement' && '🏆'}
                          {category === 'mindfulness' && '🧘'}
                          {category === 'love' && '💕'}
                          {category === 'food' && '🍽️'}
                          {category === 'relationships' && '❤️'}
                          {category === 'general' && '✨'}
                        </span>
                        <span className="font-medium">{config.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Mood Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowMoodDropdown(!showMoodDropdown)}
                className="flex items-center space-x-1 px-1.5 sm:px-2 py-1.5 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg hover:bg-white hover:shadow-md transition-all duration-200 text-xs"
              >
                <span className="text-sm sm:text-base">
                  {selectedMoodTag === 'all' ? '😊' :
                   selectedMoodTag === 'hopeful' ? '🌟' :
                   selectedMoodTag === 'thankful' ? '🙏' :
                   selectedMoodTag === 'overcoming' ? '💪' :
                   selectedMoodTag === 'peaceful' ? '☮️' :
                   selectedMoodTag === 'excited' ? '🎉' :
                   selectedMoodTag === 'content' ? '😌' :
                   selectedMoodTag === 'inspired' ? '💡' :
                   selectedMoodTag === 'blessed' ? '✨' : '😊'}
                </span>
                <span className="font-medium text-gray-700 hidden sm:inline text-xs">{getMoodDisplay()}</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showMoodDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showMoodDropdown && (
                <div className="absolute top-full left-0 mt-2 w-44 sm:w-48 lg:w-56 bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 py-2 z-50 max-h-60 overflow-y-auto">
                  <button
                    onClick={() => {
                      onMoodTagChange('all');
                      setShowMoodDropdown(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                      selectedMoodTag === 'all' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'
                    }`}
                  >
                    <span className="text-lg">😊</span>
                    <span className="font-medium">All Moods</span>
                  </button>
                  
                  {moodTags.map((tag) => {
                    const config = moodTagConfigs[tag];
                    const isSelected = selectedMoodTag === tag;
                    
                    return (
                      <button
                        key={tag}
                        onClick={() => {
                          onMoodTagChange(tag);
                          setShowMoodDropdown(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                          isSelected ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'
                        }`}
                      >
                        <span className="text-lg">
                          {tag === 'hopeful' && '🌟'}
                          {tag === 'thankful' && '🙏'}
                          {tag === 'overcoming' && '💪'}
                          {tag === 'peaceful' && '☮️'}
                          {tag === 'excited' && '🎉'}
                          {tag === 'content' && '😌'}
                          {tag === 'inspired' && '💡'}
                          {tag === 'blessed' && '✨'}
                        </span>
                        <span className="font-medium">{config.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Friends Only Toggle - Compact */}
            <div className="flex items-center space-x-1 bg-white/80 backdrop-blur-sm rounded-lg px-2 py-1.5 border border-gray-200">
              <Users className="w-3 h-3 text-purple-500" />
              <button
                onClick={() => onShowFriendsOnlyChange(!showFriendsOnly)}
                className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors ${
                  showFriendsOnly ? 'bg-purple-500' : 'bg-gray-300'
                }`}
              >
                <span className={`inline-block h-2 w-2 transform rounded-full bg-white transition-transform ${
                  showFriendsOnly ? 'translate-x-3' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* Sort Options - Compact */}
            <div className="flex bg-white/80 backdrop-blur-sm rounded-lg p-1 border border-gray-200">
              <button
                onClick={() => onSortChange('recent')}
                className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                  sortBy === 'recent'
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Clock className="w-3 h-3" />
                <span className="hidden sm:inline">Recent</span>
              </button>
              <button
                onClick={() => onSortChange('popular')}
                className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                  sortBy === 'popular'
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <TrendingUp className="w-3 h-3" />
                <span className="hidden sm:inline">Popular</span>
              </button>
              <button
                onClick={() => onSortChange('friends')}
                className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                  sortBy === 'friends'
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Heart className="w-3 h-3" />
                <span className="hidden sm:inline">Friends</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;