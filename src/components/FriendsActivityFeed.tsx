import React from 'react';
import { Heart, MessageCircle, Sparkles, Clock, User } from 'lucide-react';
import { GratitudePost, User as UserType } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface FriendsActivityFeedProps {
  friendsPosts: GratitudePost[];
  friends: UserType[];
  onViewProfile: (userId: string) => void;
  onLikePost: (postId: string) => void;
}

const FriendsActivityFeed: React.FC<FriendsActivityFeedProps> = ({
  friendsPosts,
  friends,
  onViewProfile,
  onLikePost
}) => {
  const getFriendInfo = (authorId: string) => {
    return friends.find(f => f.id === authorId);
  };

  if (friendsPosts.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-purple-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No friend activity yet</h3>
          <p className="text-gray-600 text-sm">
            When your friends share gratitude, you'll see their posts here!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center space-x-2">
          <Heart className="w-6 h-6 text-purple-500" />
          <h2 className="text-xl font-bold text-gray-900">Friends' Gratitude</h2>
        </div>
        <div className="h-px bg-gradient-to-r from-purple-200 to-pink-200 flex-1"></div>
      </div>

      {friendsPosts.slice(0, 5).map((post) => {
        const friend = getFriendInfo(post.authorId!);
        if (!friend) return null;

        return (
          <div
            key={post.id}
            className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
          >
            {/* Friend Header */}
            <div className="flex items-center space-x-3 mb-4">
              <button
                onClick={() => onViewProfile(friend.id)}
                className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                <span className="text-white font-bold">
                  {friend.displayName[0]}
                </span>
              </button>
              <div className="flex-1">
                <button
                  onClick={() => onViewProfile(friend.id)}
                  className="text-left hover:text-purple-600 transition-colors"
                >
                  <p className="font-semibold text-gray-900">
                    {friend.displayName}
                    {friend.isVerified && <span className="text-blue-500 ml-1">✓</span>}
                  </p>
                  <p className="text-sm text-gray-600">@{friend.username}</p>
                </button>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>{formatDistanceToNow(post.timestamp, { addSuffix: true })}</span>
              </div>
            </div>

            {/* Post Content */}
            <div className={`bg-gradient-to-br ${post.color} rounded-lg p-4 mb-4`}>
              <p className="text-gray-800 leading-relaxed">{post.content}</p>
              
              {post.location && (
                <div className="flex items-center space-x-1 mt-3 text-sm text-gray-600">
                  <span>📍</span>
                  <span>{post.location}</span>
                </div>
              )}
            </div>

            {/* Post Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => onLikePost(post.id)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-full transition-all duration-200 ${
                    post.isLiked
                      ? 'bg-red-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                  <span className="text-sm font-medium">{post.likes}</span>
                </button>

                <div className="flex items-center space-x-2 text-gray-500">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">{post.replies.length}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {post.moodTags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      })}

      {friendsPosts.length > 5 && (
        <div className="text-center">
          <button className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105">
            View More Friend Activity
          </button>
        </div>
      )}
    </div>
  );
};

export default FriendsActivityFeed;