import React, { useState } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import { Reply } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface ReplySectionProps {
  replies: Reply[];
  onAddReply: (content: string) => void;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

const ReplySection: React.FC<ReplySectionProps> = ({ 
  replies, 
  onAddReply, 
  isExpanded, 
  onToggleExpanded 
}) => {
  const [replyContent, setReplyContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyContent.trim()) {
      onAddReply(replyContent.trim());
      setReplyContent('');
    }
  };

  return (
    <div className="mt-3">
      <button
        onClick={onToggleExpanded}
        className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
      >
        <MessageCircle className="w-4 h-4" />
        <span>{replies.length} {replies.length === 1 ? 'reply' : 'replies'}</span>
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-3">
          {replies.map((reply) => (
            <div key={reply.id} className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-800 mb-1">{reply.content}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{reply.isAnonymous ? 'Anonymous' : reply.author}</span>
                <span>{formatDistanceToNow(reply.timestamp, { addSuffix: true })}</span>
              </div>
            </div>
          ))}

          <form onSubmit={handleSubmit} className="flex space-x-2">
            <input
              type="text"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Spread some kindness..."
              maxLength={100}
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={!replyContent.trim()}
              className="px-3 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ReplySection;