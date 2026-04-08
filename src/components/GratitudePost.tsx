import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Clock, MapPin, Eye, EyeOff, Send, Users, User, Trash2, UserPlus } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { GratitudePost as PostType, ReactionType } from '../types';
import { categoryConfigs, moodTagConfigs } from '../utils/categories';
import ReactionBar from './ReactionBar';
import CommentSection from './CommentSection';

interface GratitudePostProps {
  post: PostType;
  onLike: (id: string) => void;
  onReact: (postId: string, reactionType: ReactionType) => void;
  onAddReply: (postId: string, content: string) => void;
  onViewProfile?: (userId: string) => void;
  onSendFriendRequest?: (userId: string) => void;
  onSharePost?: (postId: string) => void;
  onDelete?: (postId: string) => void;
  currentUserId?: string;
  friends?: string[];
}

const GratitudePost: React.FC<GratitudePostProps> = ({ 
  post, 
  onLike, 
  onReact, 
  onAddReply, 
  onViewProfile,
  onSendFriendRequest,
  onSharePost,
  onDelete,
  currentUserId = 'current-user',
  friends = []
}) => {
  const [showComments, setShowComments] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const categoryConfig = categoryConfigs[post.category];
  const IconComponent = (LucideIcons as any)[categoryConfig.icon] || LucideIcons.Sparkles;
  
  const isOwnPost = post.authorId === currentUserId;
  const isFriend = post.authorId && friends.includes(post.authorId);
  const canAddFriend = post.authorId && !isOwnPost && !isFriend && !post.isAnonymous;
  
  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return `${Math.floor(diffInHours / 168)}w ago`;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Gratitude Post',
        text: post.content,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(`${post.content}\n\n- Shared from Gratitude Wall`);
      setShowShareMenu(false);
    }
  };

  return (
    <div className={`group relative bg-gradient-to-br ${post.color} rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 border border-white/20 backdrop-blur-sm`}>
      {/* Privacy Indicator */}
      {post.isPrivate && (
        <div className="absolute top-3 right-3">
          <div className="flex items-center space-x-1 px-2 py-1 bg-gray-800/20 rounded-full">
            <EyeOff className="w-3 h-3 text-gray-700" />
            <span className="text-xs text-gray-700">Private</span>
          </div>
        </div>
      )}

      {/* Category Badge - Compact */}
      <div className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full ${categoryConfig.bgColor} ${categoryConfig.color} text-xs font-medium mb-2`}>
        <IconComponent className="w-2.5 h-2.5" />
        <span className="hidden xs:inline">{categoryConfig.name}</span>
      </div>

      {/* Author Section - Compact */}
      {!post.isAnonymous && post.author && post.authorId && onViewProfile && (
        <div className="flex items-center justify-between mb-1.5">
          <button
            onClick={() => onViewProfile(post.authorId!)}
            className="flex items-center space-x-1 text-xs font-medium text-gray-700 hover:text-purple-600 transition-colors"
          >
            <User className="w-3 h-3" />
            <span className="hidden xs:inline">{post.author}</span>
          </button>
          
          {canAddFriend && onSendFriendRequest && (
            <button
              onClick={() => onSendFriendRequest(post.authorId!)}
              className="flex items-center space-x-0.5 px-1.5 py-0.5 bg-white/60 hover:bg-purple-100 text-purple-600 rounded-full text-xs font-medium transition-all duration-200"
            >
              <UserPlus className="w-2.5 h-2.5" />
              <span className="hidden sm:inline">Follow</span>
            </button>
          )}
          
          {isFriend && (
            <div className="flex items-center space-x-0.5 px-1.5 py-0.5 bg-green-100 text-green-600 rounded-full text-xs font-medium">
              <Heart className="w-2.5 h-2.5 fill-current" />
              <span className="hidden sm:inline">Friend</span>
            </div>
          )}
        </div>
      )}

      {/* Content - Compact */}
      <p className="text-gray-800 text-xs sm:text-sm leading-relaxed mb-2 sm:mb-3 font-medium overflow-hidden" style={{
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical'
      }}>
        {post.content}
      </p>

      {/* Image - Compact */}
      {post.imageUrl && (
        <div className="mb-2 sm:mb-3 rounded-lg overflow-hidden">
          <img 
            src={post.imageUrl} 
            alt="Gratitude moment" 
            className="w-full h-24 sm:h-32 object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Mood Tags */}
      {post.moodTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.moodTags.map((tag) => {
            const config = moodTagConfigs[tag];
            return (
              <span
                key={tag}
                className={`px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}
              >
                {config.name}
              </span>
            );
          })}
        </div>
      )}

      {/* Location */}
      {post.location && (
        <div className="flex items-center space-x-1 mb-4 text-gray-600">
          <MapPin className="w-3 h-3" />
          <span className="text-xs">{post.location}</span>
        </div>
      )}

      {/* Reactions */}
      <ReactionBar
        reactions={post.reactions}
        onReact={(type) => onReact(post.id, type)}
        currentUserId={currentUserId}
      />

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 sm:mt-4">
        <div className="flex items-center space-x-1.5 sm:space-x-2 text-gray-600 text-xs sm:text-sm">
          <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>{formatTimeAgo(post.timestamp)}</span>
        </div>

        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {/* Delete Button - Only for own posts */}
          {isOwnPost && onDelete && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this post?')) {
                  onDelete(post.id);
                }
              }}
              className="flex items-center justify-center p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-white/80 text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
            >
              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          )}

          {/* Share Button */}
          <div className="relative">
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="flex items-center justify-center p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-white/80 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
            >
              <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            
            {showShareMenu && (
              <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                <button
                  onClick={handleShare}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Share Post
                </button>
                {onSharePost && (
                  <button
                    onClick={() => {
                      onSharePost(post.id);
                      setShowShareMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Share with Friends
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Comments Button */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-1 px-1.5 sm:px-2 py-1 rounded-full bg-white/80 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
          >
            <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-xs font-medium">{post.replies.length}</span>
          </button>

          {/* Like Button */}
          <button
            onClick={() => onLike(post.id)}
            className={`flex items-center space-x-1 px-1.5 sm:px-2 py-1 rounded-full transition-all duration-200 ${
              post.isLiked
                ? 'bg-red-500 text-white shadow-lg transform scale-105'
                : 'bg-white/80 text-gray-600 hover:bg-red-50 hover:text-red-500'
            }`}
          >
            <Heart 
              className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 ${
                post.isLiked ? 'fill-current scale-110' : 'group-hover:scale-110'
              }`} 
            />
            <span className="text-xs font-medium">{post.likes}</span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <CommentSection
          comments={post.replies}
          onAddComment={(content) => onAddReply(post.id, content)}
          postId={post.id}
        />
      )}

      {/* Decorative elements */}
      <div className="absolute top-2 right-2 w-8 h-8 bg-white/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute bottom-2 left-2 w-6 h-6 bg-white/10 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
};

export default GratitudePost;