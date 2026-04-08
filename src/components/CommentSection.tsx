import React, { useState } from 'react';
import { Send, Heart, MoreHorizontal, Reply as ReplyIcon, Flag, MessageCircle } from 'lucide-react';
import { Reply } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface CommentSectionProps {
  comments: Reply[];
  onAddComment: (content: string) => void;
  postId: string;
}

interface CommentItemProps {
  comment: Reply;
  onLike?: (commentId: string) => void;
  onReply?: (commentId: string, content: string) => void;
  depth?: number;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, onLike, onReply, depth = 0 }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(Math.floor(Math.random() * 5));

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyContent.trim() && onReply) {
      onReply(comment.id, replyContent.trim());
      setReplyContent('');
      setShowReplyForm(false);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
    if (onLike) onLike(comment.id);
  };

  return (
    <div className={`${depth > 0 ? 'ml-8 border-l-2 border-gray-100 pl-4' : ''}`}>
      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 mb-3 border border-white/40">
        {/* Comment Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {comment.isAnonymous ? '?' : comment.author?.[0] || 'U'}
              </span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-800">
                {comment.isAnonymous ? 'Anonymous' : comment.author || 'User'}
              </span>
              <span className="text-xs text-gray-500 ml-2">
                {formatDistanceToNow(comment.timestamp, { addSuffix: true })}
              </span>
            </div>
          </div>
          
          <button className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Comment Content */}
        <p className="text-gray-700 text-sm leading-relaxed mb-3">
          {comment.content}
        </p>

        {/* Comment Actions */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
              isLiked
                ? 'bg-red-100 text-red-600'
                : 'text-gray-500 hover:bg-gray-100 hover:text-red-500'
            }`}
          >
            <Heart className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`} />
            <span>{likes}</span>
          </button>

          {depth < 2 && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition-all duration-200"
            >
              <ReplyIcon className="w-3 h-3" />
              <span>Reply</span>
            </button>
          )}

          <button className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-orange-600 transition-all duration-200">
            <Flag className="w-3 h-3" />
            <span>Report</span>
          </button>
        </div>

        {/* Reply Form */}
        {showReplyForm && (
          <form onSubmit={handleReplySubmit} className="mt-3 flex space-x-2">
            <input
              type="text"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a kind reply..."
              maxLength={200}
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80"
            />
            <button
              type="submit"
              disabled={!replyContent.trim()}
              className="px-3 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const CommentSection: React.FC<CommentSectionProps> = ({ comments, onAddComment, postId }) => {
  const [newComment, setNewComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment.trim());
      setNewComment('');
    }
  };

  return (
    <div className="mt-6 pt-4 border-t border-white/30">
      {/* Comments Header */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-gray-800">
          Comments ({comments.length})
        </h4>
        {comments.length > 0 && (
          <span className="text-xs text-gray-500">
            Spread kindness and positivity
          </span>
        )}
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {isAnonymous ? '?' : 'Y'}
            </span>
          </div>
          <div className="flex-1 relative">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts or spread some kindness..."
              rows={3}
              maxLength={300}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none bg-white/80 backdrop-blur-sm text-sm"
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
              {newComment.length}/300
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setIsAnonymous(!isAnonymous)}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                isAnonymous
                  ? 'bg-purple-100 text-purple-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>{isAnonymous ? '🎭' : '👤'}</span>
              <span>{isAnonymous ? 'Anonymous' : 'Public'}</span>
            </button>
          </div>
          
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span>Comment</span>
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-1 max-h-96 overflow-y-auto">
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <MessageCircle className="w-8 h-8 text-purple-500" />
            </div>
            <p className="text-gray-500 text-sm">No comments yet</p>
            <p className="text-gray-400 text-xs mt-1">Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onLike={(commentId) => console.log('Like comment:', commentId)}
              onReply={(commentId, content) => console.log('Reply to comment:', commentId, content)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;