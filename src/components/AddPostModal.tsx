import React, { useState } from 'react';
import { X, Send, Sparkles, Camera, MapPin, Eye, EyeOff, Users } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { PostCategory, MoodTag } from '../types';
import { categoryConfigs, moodTagConfigs } from '../utils/categories';

interface AddPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (content: string, category: PostCategory, options: {
    isPrivate: boolean;
    isAnonymous: boolean;
    moodTags: MoodTag[];
    location?: string;
    imageUrl?: string;
  }) => void;
}

const AddPostModal: React.FC<AddPostModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PostCategory>('general');
  const [selectedMoodTags, setSelectedMoodTags] = useState<MoodTag[]>([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onSubmit(content.trim(), selectedCategory, {
      isPrivate,
      isAnonymous,
      moodTags: selectedMoodTags,
      location: location.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined
    });
    
    // Reset form
    setContent('');
    setSelectedCategory('general');
    setSelectedMoodTags([]);
    setIsPrivate(false);
    setIsAnonymous(true);
    setLocation('');
    setImageUrl('');
    setIsSubmitting(false);
    onClose();
  };

  const toggleMoodTag = (tag: MoodTag) => {
    setSelectedMoodTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const categories = Object.keys(categoryConfigs) as PostCategory[];
  const moodTags = Object.keys(moodTagConfigs) as MoodTag[];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        ></div>

        <div className="relative inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-3xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Share Your Gratitude</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Privacy Settings */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-medium text-gray-800 mb-3">Privacy Settings</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">Make this post private</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPrivate(!isPrivate)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isPrivate ? 'bg-purple-500' : 'bg-gray-300'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isPrivate ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">Post anonymously</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAnonymous(!isAnonymous)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isAnonymous ? 'bg-purple-500' : 'bg-gray-300'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isAnonymous ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Choose a category
              </label>
              <div className="grid grid-cols-3 gap-2">
                {categories.map((category) => {
                  const config = categoryConfigs[category];
                  const IconComponent = (LucideIcons as any)[config.icon] || LucideIcons.Sparkles;
                  
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      className={`p-3 rounded-xl text-center transition-all duration-200 ${
                        selectedCategory === category
                          ? `${config.bgColor} ${config.color} shadow-lg transform scale-105`
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <IconComponent className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-xs font-medium">{config.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mood Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                How are you feeling? (optional)
              </label>
              <div className="flex flex-wrap gap-2">
                {moodTags.map((tag) => {
                  const config = moodTagConfigs[tag];
                  const isSelected = selectedMoodTags.includes(tag);
                  
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleMoodTag(tag)}
                      className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        isSelected
                          ? `${config.bgColor} ${config.color} shadow-sm`
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {config.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What are you grateful for today?
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="I'm grateful for..."
                rows={4}
                maxLength={500}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all duration-200"
                required
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">
                  Share something that made you feel thankful
                </span>
                <span className={`text-xs ${content.length > 450 ? 'text-red-500' : 'text-gray-400'}`}>
                  {content.length}/500
                </span>
              </div>
            </div>

            {/* Optional Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add an image (optional)
              </label>
              <div className="flex items-center space-x-2">
                <Camera className="w-5 h-5 text-gray-400" />
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location (optional)
              </label>
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Where are you grateful to be?"
                  maxLength={50}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!content.trim() || isSubmitting}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Sharing...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Share Gratitude</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPostModal;