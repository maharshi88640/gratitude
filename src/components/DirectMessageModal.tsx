import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Heart, Share, Paperclip, Smile } from 'lucide-react';
import { DirectMessage, User, GratitudePost } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface DirectMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  otherUser: User;
  messages: DirectMessage[];
  onSendMessage: (content: string, type?: 'text' | 'gratitude_share', postId?: string) => void;
  onSharePost?: (postId: string) => void;
}

const DirectMessageModal: React.FC<DirectMessageModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  otherUser,
  messages,
  onSendMessage,
  onSharePost
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        ></div>

        <div className="relative w-full max-w-2xl h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">
                  {otherUser.displayName[0]}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {otherUser.displayName}
                  {otherUser.isVerified && <span className="text-blue-500 ml-1">✓</span>}
                </h3>
                <p className="text-sm text-gray-600">@{otherUser.username}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-purple-500" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Start a conversation</h4>
                <p className="text-gray-600 text-sm">
                  Share your gratitude journey with {otherUser.displayName}
                </p>
              </div>
            ) : (
              messages.map((message) => {
                const isFromCurrentUser = message.fromUserId === currentUser.id;
                return (
                  <div
                    key={message.id}
                    className={`flex ${isFromCurrentUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      isFromCurrentUser
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'bg-white border border-gray-200 text-gray-900'
                    }`}>
                      {message.type === 'gratitude_share' ? (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Share className="w-4 h-4" />
                            <span className="text-sm font-medium">Shared a gratitude post</span>
                          </div>
                          <div className="bg-white/20 rounded-lg p-3">
                            <p className="text-sm">{message.content}</p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm">{message.content}</p>
                      )}
                      <p className={`text-xs mt-1 ${
                        isFromCurrentUser ? 'text-white/70' : 'text-gray-500'
                      }`}>
                        {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-200 rounded-2xl px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <form onSubmit={handleSubmit} className="flex items-end space-x-3">
              <div className="flex-1">
                <div className="relative">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`Message ${otherUser.displayName}...`}
                    rows={1}
                    maxLength={500}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none bg-gray-50"
                    style={{ minHeight: '44px', maxHeight: '120px' }}
                  />
                  <div className="absolute bottom-2 right-2 flex items-center space-x-2">
                    <button
                      type="button"
                      className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Smile className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-500">
                    Press Enter to send, Shift+Enter for new line
                  </span>
                  <span className={`text-xs ${newMessage.length > 450 ? 'text-red-500' : 'text-gray-400'}`}>
                    {newMessage.length}/500
                  </span>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectMessageModal;