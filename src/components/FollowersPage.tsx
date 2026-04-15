import React from 'react';
import { ArrowLeft, Users, UserPlus, UserMinus, MapPin, Calendar } from 'lucide-react';
import { User } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface FollowersPageProps {
  user: User;
  followers: User[];
  currentUserId: string;
  onBack: () => void;
  onViewProfile: (userId: string) => void;
  onFollow: (userId: string) => void;
  onUnfollow: (userId: string) => void;
}

const FollowersPage: React.FC<FollowersPageProps> = ({
  user,
  followers,
  currentUserId,
  onBack,
  onViewProfile,
  onFollow,
  onUnfollow
}) => {
  const isOwnProfile = user.id === currentUserId;

  const handleFollowToggle = (followerId: string) => {
    const follower = followers.find(f => f && f.id === followerId);
    if (follower) {
      if (follower.isFollowing) {
        onUnfollow(followerId);
      } else {
        onFollow(followerId);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header Bar */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                {isOwnProfile ? 'Your Followers' : `${user.displayName}'s Followers`}
              </h1>
              <p className="text-sm text-gray-600">{followers.length} followers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {followers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {isOwnProfile ? "No followers yet" : `${user.displayName} has no followers yet`}
            </h3>
            <p className="text-gray-600">
              {isOwnProfile 
                ? "Start sharing gratitude posts to gain followers!"
                : "Be the first to follow this user!"
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {followers.filter(follower => follower && follower.id).map((follower) => (
              <div
                key={follower.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold">
                      {follower.displayName?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{follower.displayName || 'Unknown User'}</h3>
                      <p className="text-sm text-gray-600">@{follower.username || 'unknown'}</p>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{follower.location || 'Unknown'}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>Joined {follower.joinDate ? formatDistanceToNow(follower.joinDate, { addSuffix: true }) : 'Unknown'}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onViewProfile(follower.id)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      View Profile
                    </button>
                    
                    {follower.id !== currentUserId && (
                      <button
                        onClick={() => handleFollowToggle(follower.id)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                          follower.isFollowing
                            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            : 'bg-purple-600 text-white hover:bg-purple-700'
                        }`}
                      >
                        {follower.isFollowing ? (
                          <span className="flex items-center space-x-1">
                            <UserMinus className="w-4 h-4" />
                            <span>Unfollow</span>
                          </span>
                        ) : (
                          <span className="flex items-center space-x-1">
                            <UserPlus className="w-4 h-4" />
                            <span>Follow</span>
                          </span>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowersPage;
