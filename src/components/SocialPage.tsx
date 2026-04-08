import React, { useState } from 'react';
import { Users, UserPlus, MessageCircle, Bell, Search, Heart, Flame, Trophy, Calendar, User as UserIcon, ArrowLeft, Settings } from 'lucide-react';
import { User, Friendship, Notification, FriendRequest } from '../types';

interface SocialPageProps {
  currentUser: User;
  friends: User[];
  friendRequests: FriendRequest[];
  notifications: Notification[];
  suggestedUsers: User[];
  onSendFriendRequest: (userId: string) => void;
  onAcceptFriendRequest: (requestId: string) => void;
  onDeclineFriendRequest: (requestId: string) => void;
  onOpenDirectMessage: (userId: string) => void;
  onMarkNotificationRead: (notificationId: string) => void;
  onViewProfile: (userId: string) => void;
  onBack: () => void;
}

const SocialPage: React.FC<SocialPageProps> = ({
  currentUser,
  friends,
  friendRequests,
  notifications,
  suggestedUsers,
  onSendFriendRequest,
  onAcceptFriendRequest,
  onDeclineFriendRequest,
  onOpenDirectMessage,
  onMarkNotificationRead,
  onViewProfile,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState<'friends' | 'following' | 'discover' | 'notifications'>('friends');
  const [searchTerm, setSearchTerm] = useState('');

  const unreadNotifications = notifications.filter(n => !n.isRead).length;
  const pendingRequests = friendRequests.filter(r => r.status === 'pending').length;

  const filteredFriends = friends.filter(friend =>
    friend.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    friend.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSuggested = suggestedUsers.filter(user =>
    user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 text-gray-600 hover:text-purple-600 rounded-full hover:bg-purple-50 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Social Hub</h1>
                <p className="text-gray-600">Connect with the gratitude community</p>
              </div>
            </div>
            
            <button
              onClick={() => onViewProfile(currentUser.id)}
              className="flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {currentUser.displayName[0]}
                </span>
              </div>
              <span className="font-medium">My Profile</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 sticky top-24">
              {/* User Card */}
              <div className="text-center mb-6">
                <button
                  onClick={() => onViewProfile(currentUser.id)}
                  className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:shadow-lg transition-all duration-200 transform hover:scale-105 mx-auto mb-4"
                >
                  <span className="text-white font-bold text-2xl">
                    {currentUser.displayName[0]}
                  </span>
                </button>
                <h3 className="font-bold text-gray-900">{currentUser.displayName}</h3>
                <p className="text-sm text-gray-600">@{currentUser.username}</p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 gap-3 mb-6">
                <div className="text-center bg-purple-50 rounded-lg p-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full mb-2 mx-auto">
                    <Users className="w-4 h-4 text-purple-600" />
                  </div>
                  <p className="text-xs text-gray-600">Following</p>
                  <p className="text-lg font-bold text-gray-900">{currentUser.stats.followingCount}</p>
                </div>
                <div className="text-center bg-pink-50 rounded-lg p-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-pink-100 rounded-full mb-2 mx-auto">
                    <Heart className="w-4 h-4 text-pink-600" />
                  </div>
                  <p className="text-xs text-gray-600">Likes</p>
                  <p className="text-lg font-bold text-gray-900">{currentUser.stats.totalLikes}</p>
                </div>
                <div className="text-center bg-orange-50 rounded-lg p-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full mb-2 mx-auto">
                    <Flame className="w-4 h-4 text-orange-600" />
                  </div>
                  <p className="text-xs text-gray-600">Streak</p>
                  <p className="text-lg font-bold text-gray-900">{currentUser.stats.currentStreak}</p>
                </div>
              </div>

              {/* Navigation */}
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('friends')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    activeTab === 'friends'
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Users className="w-5 h-5" />
                  <span className="font-medium">Friends</span>
                  {pendingRequests > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-auto">
                      {pendingRequests}
                    </span>
                  )}
                </button>
                
                <button
                  onClick={() => setActiveTab('following')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    activeTab === 'following'
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <UserIcon className="w-5 h-5" />
                  <span className="font-medium">Following</span>
                  <span className="text-sm text-gray-500 ml-auto">{friends.length}</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('discover')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    activeTab === 'discover'
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <UserPlus className="w-5 h-5" />
                  <span className="font-medium">Discover</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    activeTab === 'notifications'
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Bell className="w-5 h-5" />
                  <span className="font-medium">Notifications</span>
                  {unreadNotifications > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-auto">
                      {unreadNotifications}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
              {/* Tab Header */}
              <div className="p-6 border-b border-gray-200/50">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {activeTab === 'friends' && 'Friends & Requests'}
                    {activeTab === 'following' && 'People You Follow'}
                    {activeTab === 'discover' && 'Discover New Friends'}
                    {activeTab === 'notifications' && 'Notifications'}
                  </h2>
                  
                  {(activeTab === 'friends' || activeTab === 'following' || activeTab === 'discover') && (
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder={`Search ${activeTab}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm w-64"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {activeTab === 'friends' && (
                  <div className="space-y-6">
                    {/* Friend Requests */}
                    {friendRequests.filter(r => r.status === 'pending').length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Friend Requests</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {friendRequests.filter(r => r.status === 'pending').map((request) => (
                            <div key={request.id} className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                              <div className="flex items-center space-x-3 mb-3">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                                  <span className="text-white font-bold">U</span>
                                </div>
                                <div className="flex-1">
                                  <p className="font-semibold text-gray-900">New Friend Request</p>
                                  <p className="text-sm text-gray-600">2 hours ago</p>
                                </div>
                              </div>
                              {request.message && (
                                <p className="text-sm text-gray-700 mb-4 italic">"{request.message}"</p>
                              )}
                              <div className="flex space-x-3">
                                <button
                                  onClick={() => onAcceptFriendRequest(request.id)}
                                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() => onDeclineFriendRequest(request.id)}
                                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                                >
                                  Decline
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Friends List */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Your Friends ({filteredFriends.length})
                      </h3>
                      {filteredFriends.length === 0 ? (
                        <div className="text-center py-12">
                          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">No friends yet</h4>
                          <p className="text-gray-600 mb-4">Discover people to connect with!</p>
                          <button
                            onClick={() => setActiveTab('discover')}
                            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                          >
                            Discover Friends
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {filteredFriends.map((friend) => (
                            <div key={friend.id} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                              <div className="flex items-center space-x-3 mb-3">
                                <button
                                  onClick={() => onViewProfile(friend.id)}
                                  className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                                >
                                  <span className="text-white font-bold">
                                    {friend.displayName[0]}
                                  </span>
                                </button>
                                <div className="flex-1 min-w-0">
                                  <button
                                    onClick={() => onViewProfile(friend.id)}
                                    className="text-left hover:text-purple-600 transition-colors"
                                  >
                                    <p className="font-semibold text-gray-900 truncate">
                                      {friend.displayName}
                                      {friend.isVerified && <span className="text-blue-500 ml-1">✓</span>}
                                    </p>
                                    <p className="text-sm text-gray-600 truncate">@{friend.username}</p>
                                  </button>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                                <span className="flex items-center">
                                  <Flame className="w-4 h-4 mr-1 text-orange-500" />
                                  {friend.stats.currentStreak} day streak
                                </span>
                                <span className="flex items-center">
                                  <Heart className="w-4 h-4 mr-1 text-red-500" />
                                  {friend.stats.totalLikes} likes
                                </span>
                              </div>
                              
                              <button
                                onClick={() => onOpenDirectMessage(friend.id)}
                                className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors"
                              >
                                Message
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'following' && (
                  <div>
                    {filteredFriends.length === 0 ? (
                      <div className="text-center py-12">
                        <UserIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Not following anyone yet</h4>
                        <p className="text-gray-600 mb-4">Start following people to see their gratitude journey!</p>
                        <button
                          onClick={() => setActiveTab('discover')}
                          className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                        >
                          Find People to Follow
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredFriends.map((friend) => (
                          <div key={friend.id} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                            <div className="text-center">
                              <button
                                onClick={() => onViewProfile(friend.id)}
                                className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center hover:shadow-lg transition-all duration-200 transform hover:scale-105 mx-auto mb-4"
                              >
                                <span className="text-white font-bold text-xl">
                                  {friend.displayName[0]}
                                </span>
                              </button>
                              
                              <button
                                onClick={() => onViewProfile(friend.id)}
                                className="text-left hover:text-purple-600 transition-colors mb-2"
                              >
                                <h4 className="font-bold text-gray-900">
                                  {friend.displayName}
                                  {friend.isVerified && <span className="text-blue-500 ml-1">✓</span>}
                                </h4>
                                <p className="text-sm text-gray-600">@{friend.username}</p>
                              </button>
                              
                              {friend.bio && (
                                <p className="text-sm text-gray-700 mb-4 line-clamp-2">{friend.bio}</p>
                              )}
                              
                              <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
                                <div className="text-center">
                                  <div className="font-bold text-purple-600">{friend.stats.gratitudeScore}</div>
                                  <div className="text-gray-600">Score</div>
                                </div>
                                <div className="text-center">
                                  <div className="font-bold text-orange-600">{friend.stats.currentStreak}</div>
                                  <div className="text-gray-600">Streak</div>
                                </div>
                                <div className="text-center">
                                  <div className="font-bold text-pink-600">{friend.stats.totalLikes}</div>
                                  <div className="text-gray-600">Likes</div>
                                </div>
                              </div>
                              
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => onViewProfile(friend.id)}
                                  className="flex-1 px-3 py-2 bg-white text-purple-600 border border-purple-200 rounded-lg text-sm font-medium hover:bg-purple-50 transition-colors"
                                >
                                  View Profile
                                </button>
                                <button
                                  onClick={() => onOpenDirectMessage(friend.id)}
                                  className="flex-1 px-3 py-2 bg-purple-500 text-white rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors"
                                >
                                  Message
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'discover' && (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredSuggested.map((user) => (
                        <div key={user.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                          <div className="flex items-start space-x-4">
                            <button
                              onClick={() => onViewProfile(user.id)}
                              className="w-16 h-16 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                            >
                              <span className="text-white font-bold text-xl">
                                {user.displayName[0]}
                              </span>
                            </button>
                            
                            <div className="flex-1 min-w-0">
                              <button
                                onClick={() => onViewProfile(user.id)}
                                className="text-left hover:text-purple-600 transition-colors mb-2"
                              >
                                <h4 className="font-bold text-gray-900 truncate">
                                  {user.displayName}
                                  {user.isVerified && <span className="text-blue-500 ml-1">✓</span>}
                                </h4>
                                <p className="text-sm text-gray-600 truncate">@{user.username}</p>
                              </button>
                              
                              {user.bio && (
                                <p className="text-sm text-gray-700 mb-3 line-clamp-2">{user.bio}</p>
                              )}
                              
                              <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                                <span className="flex items-center">
                                  <Trophy className="w-4 h-4 mr-1 text-yellow-500" />
                                  {user.stats.gratitudeScore}
                                </span>
                                <span className="flex items-center">
                                  <Users className="w-4 h-4 mr-1 text-blue-500" />
                                  {user.stats.followersCount}
                                </span>
                                <span className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1 text-green-500" />
                                  {user.stats.totalPosts}
                                </span>
                              </div>
                              
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => onSendFriendRequest(user.id)}
                                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                                >
                                  Follow
                                </button>
                                <button
                                  onClick={() => onOpenDirectMessage(user.id)}
                                  className="px-4 py-2 bg-white text-gray-600 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                >
                                  Message
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div>
                    {notifications.length === 0 ? (
                      <div className="text-center py-12">
                        <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h4>
                        <p className="text-gray-600">You're all caught up!</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer hover:shadow-sm ${
                              notification.isRead
                                ? 'bg-gray-50 border-gray-200'
                                : 'bg-blue-50 border-blue-200'
                            }`}
                            onClick={() => onMarkNotificationRead(notification.id)}
                          >
                            <div className="flex items-start space-x-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                notification.type === 'new_follower' ? 'bg-purple-100' :
                                notification.type === 'post_liked' ? 'bg-red-100' :
                                notification.type === 'post_commented' ? 'bg-blue-100' :
                                notification.type === 'friend_posted' ? 'bg-green-100' :
                                'bg-gray-100'
                              }`}>
                                {notification.type === 'new_follower' && <UserPlus className="w-5 h-5 text-purple-600" />}
                                {notification.type === 'post_liked' && <Heart className="w-5 h-5 text-red-600" />}
                                {notification.type === 'post_commented' && <MessageCircle className="w-5 h-5 text-blue-600" />}
                                {notification.type === 'friend_posted' && <Users className="w-5 h-5 text-green-600" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900">{notification.title}</p>
                                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                <p className="text-xs text-gray-500 mt-2">
                                  {new Date(notification.timestamp).toLocaleDateString()}
                                </p>
                              </div>
                              {!notification.isRead && (
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialPage;