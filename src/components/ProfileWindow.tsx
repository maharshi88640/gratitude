import React, { useEffect, useState } from 'react';
import { MapPin, Calendar, Heart, Users, Flame, Trophy, MessageCircle, UserPlus, UserMinus, Settings, X } from 'lucide-react';
import { User, GratitudePost } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface ProfileWindowProps {
  user: User;
  currentUserId: string;
  isFollowing: boolean;
  userPosts: GratitudePost[];
  onFollow: (userId: string) => void;
  onUnfollow: (userId: string) => void;
  onSendMessage: (userId: string) => void;
  onEditProfile?: () => void;
}

const ProfileWindow: React.FC<ProfileWindowProps> = ({
  user,
  currentUserId,
  isFollowing,
  userPosts,
  onFollow,
  onUnfollow,
  onSendMessage,
  onEditProfile
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'stats'>('posts');
  const isOwnProfile = user.id === currentUserId;

  // Close window function
  const closeWindow = () => {
    window.close();
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeWindow();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header Bar */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">{user.displayName[0]}</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {user.displayName}'s Profile
              </h1>
              <p className="text-sm text-gray-600">@{user.username}</p>
            </div>
          </div>
          <button
            onClick={closeWindow}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            title="Close window (Esc)"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 mb-8 shadow-lg border border-white/20">
          <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
            {/* Avatar */}
            <div className="w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-5xl font-bold shadow-xl">
              {user.displayName[0]}
            </div>

            {/* User Info */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start space-x-3 mb-3">
                <h2 className="text-4xl font-bold text-gray-900">{user.displayName}</h2>
                {user.isVerified && <span className="text-blue-500 text-2xl">✓</span>}
              </div>
              <p className="text-xl text-gray-600 mb-4">@{user.username}</p>
              
              {user.bio && (
                <p className="text-lg text-gray-700 mb-6 max-w-2xl leading-relaxed">{user.bio}</p>
              )}

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-gray-600 mb-8">
                {user.location && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5" />
                    <span className="text-lg">{user.location}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span className="text-lg">Joined {formatDistanceToNow(user.joinDate, { addSuffix: true })}</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="text-center bg-gradient-to-r from-purple-100 to-purple-200 rounded-2xl p-6">
                  <div className="flex items-center justify-center w-16 h-16 bg-purple-500 rounded-full mb-4 mx-auto">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-purple-700">{user.stats.followersCount}</p>
                  <p className="text-purple-600 font-medium">Followers</p>
                </div>
                <div className="text-center bg-gradient-to-r from-pink-100 to-pink-200 rounded-2xl p-6">
                  <div className="flex items-center justify-center w-16 h-16 bg-pink-500 rounded-full mb-4 mx-auto">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-pink-700">{user.stats.totalLikes}</p>
                  <p className="text-pink-600 font-medium">Likes</p>
                </div>
                <div className="text-center bg-gradient-to-r from-orange-100 to-orange-200 rounded-2xl p-6">
                  <div className="flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full mb-4 mx-auto">
                    <Flame className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-orange-700">{user.stats.currentStreak}</p>
                  <p className="text-orange-600 font-medium">Day Streak</p>
                </div>
                <div className="text-center bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-2xl p-6">
                  <div className="flex items-center justify-center w-16 h-16 bg-yellow-500 rounded-full mb-4 mx-auto">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-yellow-700">{user.stats.gratitudeScore}</p>
                  <p className="text-yellow-600 font-medium">Score</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                {isOwnProfile ? (
                  <button
                    onClick={onEditProfile}
                    className="flex items-center space-x-3 px-8 py-4 bg-gray-100 text-gray-700 rounded-full font-semibold hover:bg-gray-200 transition-all duration-200 transform hover:scale-105"
                  >
                    <Settings className="w-5 h-5" />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => isFollowing ? onUnfollow(user.id) : onFollow(user.id)}
                      className={`flex items-center space-x-3 px-8 py-4 rounded-full font-semibold transition-all duration-200 transform hover:scale-105 ${
                        isFollowing
                          ? 'bg-gray-200 text-gray-700 hover:bg-red-100 hover:text-red-600'
                          : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-xl'
                      }`}
                    >
                      {isFollowing ? <UserMinus className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                      <span>{isFollowing ? 'Unfollow' : 'Follow'}</span>
                    </button>
                    
                    <button
                      onClick={() => onSendMessage(user.id)}
                      className="flex items-center space-x-3 px-8 py-4 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 transition-all duration-200 transform hover:scale-105"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>Message</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 mb-8 shadow-lg border border-white/20">
          <div className="flex">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex-1 flex items-center justify-center space-x-3 px-6 py-4 rounded-xl text-lg font-semibold transition-all duration-200 ${
                activeTab === 'posts'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Heart className="w-6 h-6" />
              <span>Gratitude Posts ({userPosts.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex-1 flex items-center justify-center space-x-3 px-6 py-4 rounded-xl text-lg font-semibold transition-all duration-200 ${
                activeTab === 'stats'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Trophy className="w-6 h-6" />
              <span>Statistics</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/20">
          {activeTab === 'posts' && (
            <div>
              {userPosts.length === 0 ? (
                <div className="text-center py-16">
                  <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                  <h4 className="text-2xl font-semibold text-gray-900 mb-4">No posts yet</h4>
                  <p className="text-lg text-gray-600">
                    {isOwnProfile ? "Start sharing your gratitude!" : `${user.displayName} hasn't shared any gratitude posts yet.`}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                  {userPosts.map((post) => (
                    <div key={post.id} className={`bg-gradient-to-br ${post.color} rounded-2xl p-6 border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
                      <p className="text-gray-800 leading-relaxed mb-4 text-lg">{post.content}</p>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{formatDistanceToNow(post.timestamp, { addSuffix: true })}</span>
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center space-x-1">
                            <Heart className="w-4 h-4" />
                            <span>{post.likes}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>{post.replies.length}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Achievement Cards */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8 border border-yellow-200">
                <h4 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center space-x-3">
                  <Trophy className="w-8 h-8 text-yellow-500" />
                  <span>Achievements</span>
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-yellow-200">
                    <span className="text-lg text-gray-700">Longest Streak</span>
                    <span className="text-xl font-bold text-yellow-600">{user.stats.longestStreak} days</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-yellow-200">
                    <span className="text-lg text-gray-700">Total Posts</span>
                    <span className="text-xl font-bold text-yellow-600">{user.stats.totalPosts}</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-lg text-gray-700">Gratitude Score</span>
                    <span className="text-xl font-bold text-yellow-600">{user.stats.gratitudeScore}/100</span>
                  </div>
                </div>
              </div>

              {/* Social Stats */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
                <h4 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center space-x-3">
                  <Users className="w-8 h-8 text-blue-500" />
                  <span>Social Impact</span>
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-blue-200">
                    <span className="text-lg text-gray-700">Following</span>
                    <span className="text-xl font-bold text-blue-600">{user.stats.followingCount}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-blue-200">
                    <span className="text-lg text-gray-700">Followers</span>
                    <span className="text-xl font-bold text-blue-600">{user.stats.followersCount}</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-lg text-gray-700">Total Likes Received</span>
                    <span className="text-xl font-bold text-blue-600">{user.stats.totalLikes}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileWindow;