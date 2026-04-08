import React, { useState } from 'react';
import { ArrowLeft, Send, Sparkles, Camera, MapPin, Eye, EyeOff, Users, Heart, Brain } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { PostCategory, MoodTag } from '../types';
import { categoryConfigs, moodTagConfigs } from '../utils/categories';

interface PostingScreenProps {
  onSubmit: (content: string, category: PostCategory, options: {
    isPrivate: boolean;
    isAnonymous: boolean;
    moodTags: MoodTag[];
    location?: string;
    imageUrl?: string;
  }) => void;
  onBack: () => void;
}

const PostingScreen: React.FC<PostingScreenProps> = ({ onSubmit, onBack }) => {
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PostCategory>('general');
  const [selectedMoodTags, setSelectedMoodTags] = useState<MoodTag[]>([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState<'mood' | 'category' | 'content' | 'options'>('mood');

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
    
    setIsSubmitting(false);
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

  const canProceed = () => {
    switch (currentStep) {
      case 'mood':
        return selectedMoodTags.length > 0;
      case 'category':
        return selectedCategory !== null;
      case 'content':
        return content.trim().length > 0;
      case 'options':
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep === 'mood') setCurrentStep('category');
    else if (currentStep === 'category') setCurrentStep('content');
    else if (currentStep === 'content') setCurrentStep('options');
  };

  const prevStep = () => {
    if (currentStep === 'category') setCurrentStep('mood');
    else if (currentStep === 'content') setCurrentStep('category');
    else if (currentStep === 'options') setCurrentStep('content');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 text-gray-600 hover:text-purple-600 rounded-full hover:bg-purple-50 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Share Your Gratitude</h1>
              <p className="text-sm text-gray-600">Express what you're thankful for today</p>
            </div>
          </div>
          
          {/* Progress Indicator */}
          <div className="flex items-center space-x-2">
            {['mood', 'category', 'content', 'options'].map((step, index) => (
              <div
                key={step}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  currentStep === step
                    ? 'bg-purple-500 scale-125'
                    : index < ['mood', 'category', 'content', 'options'].indexOf(currentStep)
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Step: Mood Selection */}
          {currentStep === 'mood' && (
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">How are you feeling?</h2>
                <p className="text-gray-600">Select the emotions that resonate with your gratitude today</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {moodTags.map((tag) => {
                  const config = moodTagConfigs[tag];
                  const isSelected = selectedMoodTags.includes(tag);
                  
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleMoodTag(tag)}
                      className={`p-6 rounded-2xl text-center transition-all duration-200 transform hover:scale-105 ${
                        isSelected
                          ? `${config.bgColor} ${config.color} shadow-lg scale-105`
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-2 border-gray-200'
                      }`}
                    >
                      <div className="text-3xl mb-2">
                        {tag === 'hopeful' && '🌟'}
                        {tag === 'thankful' && '🙏'}
                        {tag === 'overcoming' && '💪'}
                        {tag === 'peaceful' && '☮️'}
                        {tag === 'excited' && '🎉'}
                        {tag === 'content' && '😌'}
                        {tag === 'inspired' && '💡'}
                        {tag === 'blessed' && '✨'}
                      </div>
                      <span className="font-medium">{config.name}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-center">
                <button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step: Category Selection */}
          {currentStep === 'category' && (
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">What's your gratitude about?</h2>
                <p className="text-gray-600">Choose the category that best fits your thankful moment</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                {categories.map((category) => {
                  const config = categoryConfigs[category];
                  const IconComponent = (LucideIcons as any)[config.icon] || LucideIcons.Sparkles;
                  const isSelected = selectedCategory === category;
                  
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`p-6 rounded-2xl text-center transition-all duration-200 transform hover:scale-105 ${
                        isSelected
                          ? `${config.bgColor} ${config.color} shadow-lg scale-105`
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-2 border-gray-200'
                      }`}
                    >
                      <div className="text-3xl mb-2">
                        {category === 'family' && '👨‍👩‍👧‍👦'}
                        {category === 'health' && '💪'}
                        {category === 'career' && '💼'}
                        {category === 'nature' && '🌿'}
                        {category === 'friendship' && '🤝'}
                        {category === 'achievement' && '🏆'}
                        {category === 'mindfulness' && '🧘'}
                        {category === 'love' && '💕'}
                        {category === 'food' && '🍽️'}
                        {category === 'relationships' && '❤️'}
                        {category === 'general' && '✨'}
                      </div>
                      <span className="font-medium">{config.name}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step: Content Writing */}
          {currentStep === 'content' && (
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Share your gratitude</h2>
                <p className="text-gray-600">Express what you're thankful for in your own words</p>
              </div>

              <div className="mb-6">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="I'm grateful for..."
                  rows={8}
                  maxLength={500}
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all duration-200 text-lg"
                  autoFocus
                />
                <div className="flex justify-between items-center mt-3">
                  <span className="text-sm text-gray-500">
                    Share something that made you feel thankful
                  </span>
                  <span className={`text-sm ${content.length > 450 ? 'text-red-500' : 'text-gray-400'}`}>
                    {content.length}/500
                  </span>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step: Options & Submit */}
          {currentStep === 'options' && (
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Final touches</h2>
                <p className="text-gray-600">Customize your post settings and add optional details</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Privacy Settings */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h4 className="font-semibold text-gray-800 mb-4">Privacy Settings</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Eye className="w-5 h-5 text-gray-600" />
                        <div>
                          <span className="font-medium">Make this post private</span>
                          <p className="text-sm text-gray-500">Only you can see this post</p>
                        </div>
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
                      <div className="flex items-center space-x-3">
                        <Users className="w-5 h-5 text-gray-600" />
                        <div>
                          <span className="font-medium">Post anonymously</span>
                          <p className="text-sm text-gray-500">Hide your username from this post</p>
                        </div>
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

                {/* Optional Image */}
                <div>
                  <label className="block font-medium text-gray-700 mb-3">
                    Add an image (optional)
                  </label>
                  <div className="flex items-center space-x-3">
                    <Camera className="w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block font-medium text-gray-700 mb-3">
                    Location (optional)
                  </label>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Where are you grateful to be?"
                      maxLength={50}
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-300 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={!content.trim() || isSubmitting}
                    className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Sharing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Send className="w-5 h-5" />
                        <span>Share Gratitude</span>
                      </div>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostingScreen;