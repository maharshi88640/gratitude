import React, { useState, useEffect } from 'react';
import { Book, Calendar, Heart, Star, Lightbulb, Target, Award, ChevronRight, X, Save, Sparkles } from 'lucide-react';

interface JournalEntry {
  id: string;
  date: string;
  content: string;
  prompt: string;
  mood: string;
  tags: string[];
  reflections: string[];
}

interface GratitudeJournalProps {
  onClose: () => void;
  onSave?: (entry: JournalEntry) => void;
}

const GratitudeJournal: React.FC<GratitudeJournalProps> = ({ onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState<'write' | 'prompts' | 'challenges' | 'insights'>('write');
  const [currentEntry, setCurrentEntry] = useState({
    content: '',
    mood: '',
    tags: [] as string[],
    reflections: [] as string[],
  });
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [savedEntries, setSavedEntries] = useState<JournalEntry[]>([]);

  const dailyPrompts = [
    "What aspect of Indian culture made you feel grateful today?",
    "Describe a family moment that brought you joy today.",
    "What traditional food or festival brought you happiness?",
    "Who in your community or family supported you today?",
    "What natural beauty in India did you appreciate today?",
    "What Indian value or teaching inspired you today?",
    "Describe a moment of peace during your daily routine.",
    "What skill or wisdom from elders are you grateful for?",
    "How did Indian hospitality or kindness touch you today?",
    "What modern convenience in India made your life better today?",
  ];

  const reflectionQuestions = [
    "How did this moment make you feel?",
    "What did this experience teach you?",
    "Why are you grateful for this?",
    "How did this impact your day?",
    "What would you tell your future self about this?",
  ];

  const challenges = [
    {
      id: 'festival-gratitude',
      title: 'Indian Festival Gratitude',
      description: 'Express gratitude during different Indian festivals and traditions',
      duration: '30 days',
      difficulty: 'Easy',
      icon: '🪔',
    },
    {
      id: 'family-blessings',
      title: 'Family & Ancestors Challenge',
      description: 'Daily gratitude for family members and ancestral wisdom',
      duration: '21 days',
      difficulty: 'Medium',
      icon: '👨‍👩‍👧‍👦',
    },
    {
      id: 'cultural-heritage',
      title: 'Cultural Heritage Journey',
      description: 'Explore gratitude for India\'s diverse cultural traditions',
      duration: '14 days',
      difficulty: 'Medium',
      icon: '�',
    },
    {
      id: 'yoga-gratitude',
      title: 'Yoga & Gratitude Practice',
      description: 'Combine daily yoga practice with gratitude meditation',
      duration: '21 days',
      difficulty: 'Hard',
      icon: '🧘‍♀️',
    },
  ];

  const moods = [
    { emoji: '😊', label: 'Happy', color: 'bg-yellow-100 text-yellow-800' },
    { emoji: '😌', label: 'Calm', color: 'bg-green-100 text-green-800' },
    { emoji: '🤗', label: 'Grateful', color: 'bg-pink-100 text-pink-800' },
    { emoji: '💪', label: 'Empowered', color: 'bg-blue-100 text-blue-800' },
    { emoji: '🙏', label: 'Blessed', color: 'bg-purple-100 text-purple-800' },
    { emoji: '😔', label: 'Thoughtful', color: 'bg-gray-100 text-gray-800' },
  ];

  const insights = [
    {
      title: 'Gratitude Patterns',
      description: 'You tend to feel most grateful on weekends',
      type: 'pattern',
      icon: '📊',
    },
    {
      title: 'Mood Correlation',
      description: 'Your gratitude practice improves your mood by 67%',
      type: 'correlation',
      icon: '📈',
    },
    {
      title: 'Growth Area',
      description: 'Consider expressing gratitude for challenges too',
      type: 'suggestion',
      icon: '💡',
    },
    {
      title: 'Consistency Streak',
      description: 'You\'ve written in your journal for 5 days straight!',
      type: 'achievement',
      icon: '🔥',
    },
  ];

  const handleSaveEntry = () => {
    if (!currentEntry.content.trim()) return;

    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      content: currentEntry.content,
      prompt: selectedPrompt,
      mood: currentEntry.mood,
      tags: currentEntry.tags,
      reflections: currentEntry.reflections,
    };

    setSavedEntries([entry, ...savedEntries]);
    onSave?.(entry);
    
    // Reset form
    setCurrentEntry({
      content: '',
      mood: '',
      tags: [],
      reflections: [],
    });
    setSelectedPrompt('');
  };

  const addReflection = (question: string) => {
    if (!currentEntry.reflections.includes(question)) {
      setCurrentEntry({
        ...currentEntry,
        reflections: [...currentEntry.reflections, question],
      });
    }
  };

  const addTag = (tag: string) => {
    if (!currentEntry.tags.includes(tag)) {
      setCurrentEntry({
        ...currentEntry,
        tags: [...currentEntry.tags, tag],
      });
    }
  };

  const removeTag = (tag: string) => {
    setCurrentEntry({
      ...currentEntry,
      tags: currentEntry.tags.filter(t => t !== tag),
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 sm:p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2 flex items-center space-x-2">
                <Book className="w-6 h-6" />
                <span>Gratitude Journal</span>
              </h2>
              <p className="text-white/90">Deepen your practice with guided prompts and insights</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {[
            { id: 'write', label: 'Write', icon: Book },
            { id: 'prompts', label: 'Prompts', icon: Lightbulb },
            { id: 'challenges', label: 'Challenges', icon: Target },
            { id: 'insights', label: 'Insights', icon: Star },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 px-3 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'write' && (
            <div className="space-y-6">
              {/* Prompt Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Today's Prompt (Optional)
                </label>
                <select
                  value={selectedPrompt}
                  onChange={(e) => setSelectedPrompt(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Choose a prompt or write freely...</option>
                  {dailyPrompts.map((prompt, index) => (
                    <option key={index} value={prompt}>{prompt}</option>
                  ))}
                </select>
              </div>

              {selectedPrompt && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-purple-900 font-medium">{selectedPrompt}</p>
                </div>
              )}

              {/* Main Entry */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What are you grateful for today?
                </label>
                <textarea
                  value={currentEntry.content}
                  onChange={(e) => setCurrentEntry({ ...currentEntry, content: e.target.value })}
                  placeholder="Share your thoughts, feelings, and experiences..."
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={6}
                />
              </div>

              {/* Mood Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How are you feeling?
                </label>
                <div className="flex flex-wrap gap-2">
                  {moods.map((mood) => (
                    <button
                      key={mood.label}
                      onClick={() => setCurrentEntry({ ...currentEntry, mood: mood.label })}
                      className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                        currentEntry.mood === mood.label
                          ? mood.color
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span className="mr-1">{mood.emoji}</span>
                      {mood.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reflection Questions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deepen Your Reflection
                </label>
                <div className="space-y-2">
                  {reflectionQuestions.slice(0, 3).map((question, index) => (
                    <button
                      key={index}
                      onClick={() => addReflection(question)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        currentEntry.reflections.includes(question)
                          ? 'bg-purple-50 border-purple-300 text-purple-900'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{question}</span>
                        {currentEntry.reflections.includes(question) && (
                          <Star className="w-4 h-4 text-purple-600 fill-current" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {currentEntry.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center space-x-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                    >
                      <span>{tag}</span>
                      <button
                        onClick={() => removeTag(tag)}
                        className="hover:text-purple-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Add tags (press Enter)"
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const value = (e.target as HTMLInputElement).value.trim();
                      if (value) {
                        addTag(value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }
                  }}
                />
              </div>

              {/* Save Button */}
              <button
                onClick={handleSaveEntry}
                disabled={!currentEntry.content.trim()}
                className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Entry</span>
              </button>
            </div>
          )}

          {activeTab === 'prompts' && (
            <div className="space-y-6">
              <div className="text-center">
                <Lightbulb className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900">Daily Prompts</h3>
                <p className="text-gray-600 text-sm mt-1">Get inspired with thoughtful questions</p>
              </div>

              <div className="grid gap-3">
                {dailyPrompts.map((prompt, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setSelectedPrompt(prompt);
                      setActiveTab('write');
                    }}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer hover:border-purple-300"
                  >
                    <div className="flex items-start space-x-3">
                      <Sparkles className="w-5 h-5 text-purple-500 mt-0.5" />
                      <p className="text-gray-700">{prompt}</p>
                      <ChevronRight className="w-4 h-4 text-gray-400 mt-0.5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'challenges' && (
            <div className="space-y-6">
              <div className="text-center">
                <Target className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900">Gratitude Challenges</h3>
                <p className="text-gray-600 text-sm mt-1">Build lasting habits with structured programs</p>
              </div>

              <div className="grid gap-4">
                {challenges.map((challenge) => (
                  <div key={challenge.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">{challenge.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{challenge.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{challenge.description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-xs text-gray-500">{challenge.duration}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            challenge.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                            challenge.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {challenge.difficulty}
                          </span>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                        Start
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="space-y-6">
              <div className="text-center">
                <Star className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900">Your Insights</h3>
                <p className="text-gray-600 text-sm mt-1">Discover patterns in your gratitude practice</p>
              </div>

              <div className="grid gap-4">
                {insights.map((insight, index) => (
                  <div key={index} className={`border rounded-lg p-4 ${
                    insight.type === 'achievement' ? 'border-yellow-300 bg-yellow-50' :
                    insight.type === 'suggestion' ? 'border-blue-300 bg-blue-50' :
                    'border-gray-200'
                  }`}>
                    <div className="flex items-start space-x-3">
                      <span className="text-xl">{insight.icon}</span>
                      <div>
                        <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Award className="w-5 h-5 text-purple-600" />
                  <h4 className="font-semibold text-purple-900">Your Gratitude Stats</h4>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{savedEntries.length}</div>
                    <div className="text-xs text-gray-600">Total Entries</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">5</div>
                    <div className="text-xs text-gray-600">Day Streak</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">12</div>
                    <div className="text-xs text-gray-600">This Month</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">😊</div>
                    <div className="text-xs text-gray-600">Top Mood</div>
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

export default GratitudeJournal;
