import React from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { TrendingUp, Award, Heart, Brain, Clock, Smile, Target, Zap, AlertCircle } from 'lucide-react';
import { UserStats } from '../types';

interface WeeklyReportProps {
  stats: UserStats;
  isOpen: boolean;
  onClose: () => void;
}

const WeeklyReport: React.FC<WeeklyReportProps> = ({ stats, isOpen, onClose }) => {
  const COLORS = ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444'];

  // Advanced analytics functions
  const analyzeMoodTrends = () => {
    const moodTrend = stats.weeklyStats?.moodTrend || [];
    return moodTrend.map(point => ({
      day: new Date(point.date).toLocaleDateString('en-US', { weekday: 'short' }),
      mood: point.mood || 7,
      engagement: point.posts || 0
    }));
  };

  const analyzeSentimentPatterns = () => {
    return stats.weeklyStats?.sentimentPatterns || [
      { sentiment: 'Positive', value: 0, color: '#10B981' },
      { sentiment: 'Neutral', value: 0, color: '#F59E0B' },
      { sentiment: 'Reflective', value: 0, color: '#3B82F6' }
    ];
  };

  const analyzeTimePatterns = () => {
    // Simulate time-based posting patterns
    return [
      { time: 'Morning', posts: 4, mood: 8 },
      { time: 'Afternoon', posts: 7, mood: 7 },
      { time: 'Evening', posts: 3, mood: 6 }
    ];
  };

  const analyzeMentalHealthScore = () => {
    // Calculate mental health score based on multiple factors
    const streakScore = Math.min(stats.currentStreak * 10, 30);
    const engagementScore = Math.min((stats.weeklyStats?.postsThisWeek || 0) * 5, 30);
    const consistencyScore = stats.currentStreak > 3 ? 20 : 10;
    const moodScore = Math.min((stats.weeklyStats?.averageMood || 7) * 2, 20);
    const contentScore = Math.min((stats.contentSentiment?.ownPostsSentiment || 0.5) * 20, 20);
    const socialScore = stats.contentSentiment?.socialEngagementScore || 0;
    const totalScore = streakScore + engagementScore + consistencyScore + moodScore + contentScore + socialScore;
    
    return {
      score: Math.min(totalScore, 100),
      level: totalScore >= 80 ? 'Excellent' : totalScore >= 60 ? 'Good' : totalScore >= 40 ? 'Improving' : 'Developing',
      color: totalScore >= 80 ? '#10B981' : totalScore >= 60 ? '#3B82F6' : totalScore >= 40 ? '#F59E0B' : '#EF4444'
    };
  };

  const generatePersonalizedInsights = () => {
    const insights = [];
    const mentalHealth = analyzeMentalHealthScore();
    const avgMood = stats.weeklyStats?.averageMood || 7;
    const ownSentiment = stats.contentSentiment?.ownPostsSentiment || 0.5;
    const engagedSentiment = stats.contentSentiment?.engagedPostsSentiment || 0.5;
    
    if (stats.currentStreak >= 7) {
      insights.push({
        type: 'achievement',
        icon: '🏆',
        title: 'Consistency Champion',
        description: 'Your 7+ day streak shows remarkable commitment to mental wellness.'
      });
    }
    
    if (stats.weeklyStats.postsThisWeek >= 5) {
      insights.push({
        type: 'engagement',
        icon: '📈',
        title: 'High Engagement',
        description: 'You\'re actively processing emotions through gratitude - excellent for mental health.'
      });
    }
    
    if (stats.mostUsedWords.length > 10) {
      insights.push({
        type: 'vocabulary',
        icon: '📚',
        title: 'Expanding Awareness',
        description: 'Your diverse gratitude vocabulary shows growing emotional intelligence.'
      });
    }
    
    if (avgMood >= 9) {
      insights.push({
        type: 'wellness',
        icon: '✨',
        title: 'Elevated Mood',
        description: 'Your recent posts indicate consistently high positive mood levels.'
      });
    } else if (avgMood <= 6) {
      insights.push({
        type: 'reflection',
        icon: '🤔',
        title: 'Time for Reflection',
        description: 'Consider exploring deeper gratitude practices to boost your mood.'
      });
    }
    
    if (ownSentiment > 0.7) {
      insights.push({
        type: 'content',
        icon: '💬',
        title: 'Positive Expression',
        description: 'Your posts show strong positive sentiment - keep sharing uplifting content!'
      });
    } else if (ownSentiment < 0.4) {
      insights.push({
        type: 'content',
        icon: '🧘',
        title: 'Reflective Writing',
        description: 'Your writing reflects deeper contemplation. Consider balancing with more positive affirmations.'
      });
    }
    
    if (engagedSentiment > 0.7) {
      insights.push({
        type: 'social',
        icon: '🤝',
        title: 'Positive Social Circle',
        description: 'You engage with highly positive content from others - great for mental health!'
      });
    }
    
    if (mentalHealth.score >= 80) {
      insights.push({
        type: 'wellness',
        icon: '✨',
        title: 'Thriving Mindset',
        description: 'Your patterns indicate excellent mental health and emotional resilience.'
      });
    }
    
    return insights;
  };

  const moodTrends = analyzeMoodTrends();
  const sentimentPatterns = analyzeSentimentPatterns();
  const timePatterns = analyzeTimePatterns();
  const mentalHealthScore = analyzeMentalHealthScore();
  const personalizedInsights = generatePersonalizedInsights();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        ></div>

        <div className="relative inline-block w-full max-w-6xl p-4 sm:p-6 lg:p-8 my-4 sm:my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl sm:rounded-3xl">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">Advanced Mental Health Analytics</h3>
              <p className="text-gray-600 text-sm sm:text-base">Deep insights into your emotional patterns and wellbeing</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Mental Health Score Card */}
          <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg sm:text-xl font-semibold mb-2">Mental Health Score</h4>
                <p className="text-3xl sm:text-4xl font-bold">{mentalHealthScore.score}/100</p>
                <p className="text-sm opacity-90">Level: {mentalHealthScore.level}</p>
              </div>
              <div className="text-right">
                <Brain className="w-12 h-12 sm:w-16 sm:h-16 mb-2" />
                <div className="w-24 h-2 bg-white/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white rounded-full transition-all duration-500"
                    style={{ width: `${mentalHealthScore.score}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {/* Stats Cards */}
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4 sm:p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
                  <h4 className="text-lg sm:text-xl font-semibold text-gray-800">This Week</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-2xl sm:text-3xl font-bold text-purple-600">{stats.weeklyStats.postsThisWeek}</p>
                    <p className="text-xs sm:text-sm text-gray-600">Posts shared</p>
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-bold text-pink-600">{stats.currentStreak}</p>
                    <p className="text-xs sm:text-sm text-gray-600">Day streak</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-4 sm:p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Award className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" />
                  <h4 className="text-lg sm:text-xl font-semibold text-gray-800">Achievements</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm sm:text-base text-gray-700">Longest Streak</span>
                    <span className="font-semibold text-sm sm:text-base">{stats.longestStreak} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm sm:text-base text-gray-700">Total Posts</span>
                    <span className="font-semibold text-sm sm:text-base">{stats.totalPosts}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mood Trends Chart */}
            <div className="bg-gray-50 rounded-2xl p-4 sm:p-6">
              <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <Smile className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
                <span>Weekly Mood Trends</span>
              </h4>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={moodTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="mood" stroke="#8B5CF6" strokeWidth={2} dot={{ fill: '#8B5CF6' }} />
                  <Line type="monotone" dataKey="engagement" stroke="#EC4899" strokeWidth={2} dot={{ fill: '#EC4899' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Sentiment Analysis */}
            <div className="bg-gray-50 rounded-2xl p-4 sm:p-6">
              <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                <span>Sentiment Analysis</span>
              </h4>
              <div className="space-y-2">
                {sentimentPatterns.map((pattern, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-sm text-gray-700">{pattern.sentiment}</span>
                    <span className="font-semibold text-sm">{pattern.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Time-Based Patterns */}
            <div className="bg-gray-50 rounded-2xl p-4 sm:p-6">
              <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                <span>Daily Time Patterns</span>
              </h4>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={timePatterns}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="posts" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="mood" stackId="2" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Most Grateful For Chart */}
            <div className="bg-gray-50 rounded-2xl p-4 sm:p-6">
              <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
                <span>Gratitude Categories</span>
              </h4>
              {stats.mostGratefulFor.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={stats.mostGratefulFor}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, percentage }) => `${category} ${percentage}%`}
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {stats.mostGratefulFor.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 text-center py-8 text-sm">Start posting to see your gratitude patterns!</p>
              )}
            </div>

            {/* Word Cloud */}
            <div className="xl:col-span-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 sm:p-6">
              <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                <span>Your Emotional Vocabulary</span>
              </h4>
              {stats.mostUsedWords.length > 0 ? (
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {stats.mostUsedWords.map((word, index) => (
                    <span
                      key={word.word}
                      className="px-3 py-1 sm:px-4 sm:py-2 bg-white rounded-full text-gray-700 font-medium shadow-sm"
                      style={{
                        fontSize: `${Math.max(12, Math.min(20, word.count * 2))}px`
                      }}
                    >
                      {word.word} ({word.count})
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8 text-sm">Keep writing to discover your gratitude vocabulary!</p>
              )}
            </div>
          </div>

          {/* Personalized Insights Section */}
          <div className="mt-6 sm:mt-8">
            <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
              <span>Personalized Mental Health Insights</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {personalizedInsights.map((insight, index) => (
                <div key={index} className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-l-4 border-purple-500">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{insight.icon}</span>
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-1">{insight.title}</h5>
                      <p className="text-sm text-gray-600">{insight.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Advanced Recommendations */}
          <div className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="p-4 sm:p-6 bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl">
              <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                <span>Recommended Actions</span>
              </h4>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span className="text-sm text-gray-700">
                    {mentalHealthScore.score >= 80 
                      ? "Maintain your current practice and consider mentoring others"
                      : mentalHealthScore.score >= 60
                      ? "Increase daily gratitude entries to boost consistency"
                      : "Start with 3-5 minute daily gratitude sessions"
                    }
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span className="text-sm text-gray-700">
                    {stats.currentStreak < 3 
                      ? "Set daily reminders to build your gratitude habit"
                      : "Try expanding your gratitude to new areas of life"
                    }
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span className="text-sm text-gray-700">
                    {stats.weeklyStats.postsThisWeek < 5 
                      ? "Aim for 5+ posts this week for optimal benefits"
                      : "Consider adding reflection exercises to deepen practice"
                    }
                  </span>
                </li>
              </ul>
            </div>

            <div className="p-4 sm:p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl">
              <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                <span>Wellness Indicators</span>
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Emotional Awareness</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${Math.min(stats.mostUsedWords.length * 10, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{Math.min(stats.mostUsedWords.length * 10, 100)}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Consistency</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${Math.min(stats.currentStreak * 14, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{Math.min(stats.currentStreak * 14, 100)}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Engagement</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${Math.min(stats.weeklyStats.postsThisWeek * 20, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{Math.min(stats.weeklyStats.postsThisWeek * 20, 100)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyReport;