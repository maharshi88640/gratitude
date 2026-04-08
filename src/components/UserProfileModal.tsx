import React, { useState } from 'react';
import { X, MapPin, Calendar, Heart, Users, Flame, Trophy, MessageCircle, UserPlus, UserMinus, Settings } from 'lucide-react';
import { User, GratitudePost, UserStats } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  currentUserId: string;
  isFollowing: boolean;
  userPosts: GratitudePost[];
  onFollow: (userId: string) => void;
  onUnfollow: (userId: string) => void;
  onSendMessage: (userId: string) => void;
  onEditProfile?: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        ></div>

        <div className="relative inline-block w-full max-w-4xl p-8 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-3xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">Profile</h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Profile Header */}
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              {/* Avatar */}
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {user.displayName[0]}
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">{user.displayName}</h2>
                  {user.isVerified && <span className="text-blue-500 text-xl">✓</span>}
                </div>
                <p className="text-gray-600 mb-2">@{user.username}</p>
                
                {user.bio && (
                  <p className="text-gray-700 mb-4 max-w-md">{user.bio}</p>
                )}

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-600 mb-4">
                  {user.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{user.location}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {formatDistanceToNow(user.joinDate, { addSuffix: true })}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-2 mx-auto">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{user.stats.followersCount}</p>
                    <p className="text-sm text-gray-600">Followers</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-pink-100 rounded-full mb-2 mx-auto">
                      <Heart className="w-6 h-6 text-pink-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{user.stats.totalLikes}</p>
                    <p className="text-sm text-gray-600">Likes</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-2 mx-auto">
                      <Flame className="w-6 h-6 text-orange-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{user.stats.currentStreak}</p>
                    <p className="text-sm text-gray-600">Day Streak</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mb-2 mx-auto">
                      <Trophy className="w-6 h-6 text-yellow-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{user.stats.gratitudeScore}</p>
                    <p className="text-sm text-gray-600">Score</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  {isOwnProfile ? (
                    <button
                      onClick={onEditProfile}
                      className="flex items-center space-x-2 px-6 py-2 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Edit Profile</span>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => isFollowing ? onUnfollow(user.id) : onFollow(user.id)}
                        className={`flex items-center space-x-2 px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                          isFollowing
                            ? 'bg-gray-200 text-gray-700 hover:bg-red-100 hover:text-red-600'
                            : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg'
                        }`}
                      >
                        {isFollowing ? <UserMinus className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                        <span>{isFollowing ? 'Unfollow' : 'Follow'}</span>
                      </button>
                      
                      <button
                        onClick={() => onSendMessage(user.id)}
                        className="flex items-center space-x-2 px-6 py-2 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Message</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === 'posts'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Gratitude Posts ({userPosts.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === 'stats'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Statistics</span>
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'posts' && (
            <div>
              {userPosts.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h4>
                  <p className="text-gray-600">
                    {isOwnProfile ? "Start sharing your gratitude!" : `${user.displayName} hasn't shared any gratitude posts yet.`}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userPosts.slice(0, 6).map((post) => (
                    <div key={post.id} className={`bg-gradient-to-br ${post.color} rounded-xl p-4 border border-white/20`}>
                      <p className="text-gray-800 text-sm leading-relaxed mb-3">{post.content}</p>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>{formatDistanceToNow(post.timestamp, { addSuffix: true })}</span>
                        <div className="flex items-center space-x-3">
                          <span className="flex items-center space-x-1">
                            <Heart className="w-3 h-3" />
                            <span>{post.likes}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <MessageCircle className="w-3 h-3" />
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Achievement Cards */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span>Achievements</span>
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Longest Streak</span>
                    <span className="font-semibold">{user.stats.longestStreak} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Total Posts</span>
                    <span className="font-semibold">{user.stats.totalPosts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Gratitude Score</span>
                    <span className="font-semibold">{user.stats.gratitudeScore}/100</span>
                  </div>
                </div>
              </div>

              {/* Social Stats */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  <span>Social Impact</span>
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Following</span>
                    <span className="font-semibold">{user.stats.followingCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Followers</span>
                    <span className="font-semibold">{user.stats.followersCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Total Likes Received</span>
                    <span className="font-semibold">{user.stats.totalLikes}</span>
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

export default UserProfileModal;