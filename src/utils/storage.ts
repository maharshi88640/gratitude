import { GratitudePost, UserStats, DailyPrompt } from '../types';
import { format, isToday, differenceInDays, startOfWeek, endOfWeek, isWithinInterval, subDays } from 'date-fns';

// Mood score mapping (1-10 scale)
const MOOD_SCORES: Record<string, number> = {
  'hopeful': 8,
  'thankful': 9,
  'overcoming': 7,
  'peaceful': 8,
  'excited': 9,
  'content': 8,
  'inspired': 9,
  'blessed': 10
};

// Simple sentiment analysis keywords
const POSITIVE_WORDS = ['grateful', 'thankful', 'happy', 'joy', 'love', 'blessed', 'peace', 'inspired', 'excited', 'hope', 'amazing', 'wonderful', 'beautiful', 'great', 'fantastic'];
const NEGATIVE_WORDS = ['sad', 'angry', 'frustrated', 'disappointed', 'worried', 'stressed', 'anxious', 'tired', 'exhausted', 'overwhelmed', 'difficult', 'hard', 'bad', 'terrible'];

const getMoodScore = (moodTags: string[]): number => {
  if (moodTags.length === 0) return 7; // Neutral default
  const scores = moodTags.map(tag => MOOD_SCORES[tag] || 7);
  return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
};

const analyzeSentiment = (content: string): number => {
  const words = content.toLowerCase().split(/\s+/);
  let positive = 0, negative = 0;
  words.forEach(word => {
    if (POSITIVE_WORDS.includes(word)) positive++;
    if (NEGATIVE_WORDS.includes(word)) negative++;
  });
  const total = positive + negative;
  if (total === 0) return 0.5; // Neutral
  return positive / total; // 0-1 scale
};

const STORAGE_KEYS = {
  POSTS: 'gratitude-posts',
  USER_STATS: 'user-stats',
  LAST_PROMPT_DATE: 'last-prompt-date',
  JOURNAL_ENTRIES: 'gratitude-journal-entries'
};

export const savePostsToStorage = (posts: GratitudePost[]): void => {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    }
  } catch (error) {
    console.error('Failed to save posts to storage:', error);
  }
};

export const loadPostsFromStorage = (): GratitudePost[] => {
  try {
    if (typeof localStorage === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEYS.POSTS);
    if (!stored) return [];
    
    const posts = JSON.parse(stored);
    if (!Array.isArray(posts)) return [];
    return posts.map((post: any) => {
      try {
        if (typeof post !== 'object' || post === null) return null;
        return {
          ...post,
          timestamp: new Date(post.timestamp),
          reactions: post.reactions || [],
          replies: post.replies || [],
          moodTags: post.moodTags || [],
          isAnonymous: post.isAnonymous ?? true,
          isPrivate: post.isPrivate ?? false
        };
      } catch (error) {
        console.error('Error processing post:', error);
        return null;
      }
    }).filter(Boolean);
  } catch (error) {
    console.error('Failed to load posts from storage:', error);
    return [];
  }
};

export const saveUserStats = (stats: UserStats): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(stats));
  } catch (error) {
    console.error('Failed to save user stats:', error);
  }
};

export const loadUserStats = (): UserStats => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_STATS);
    if (!stored) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        totalPosts: 0,
        weeklyStats: {
          postsThisWeek: 0,
          averageMood: 7,
          topCategories: [],
          moodTrend: [],
          sentimentPatterns: [
            { sentiment: 'Positive', value: 33, color: '#10B981' },
            { sentiment: 'Neutral', value: 33, color: '#F59E0B' },
            { sentiment: 'Reflective', value: 34, color: '#3B82F6' }
          ]
        },
        mostUsedWords: [],
        mostGratefulFor: [],
        contentSentiment: {
          ownPostsSentiment: 0.5,
          engagedPostsSentiment: 0.5,
          socialEngagementScore: 0
        }
      };
    }
    
    const stats = JSON.parse(stored);
    return {
      ...stats,
      lastPostDate: stats.lastPostDate ? new Date(stats.lastPostDate) : undefined,
      weeklyStats: {
        postsThisWeek: stats.weeklyStats?.postsThisWeek || 0,
        averageMood: stats.weeklyStats?.averageMood || 7,
        topCategories: stats.weeklyStats?.topCategories || [],
        moodTrend: stats.weeklyStats?.moodTrend || [],
        sentimentPatterns: stats.weeklyStats?.sentimentPatterns || [
          { sentiment: 'Positive', value: 33, color: '#10B981' },
          { sentiment: 'Neutral', value: 33, color: '#F59E0B' },
          { sentiment: 'Reflective', value: 34, color: '#3B82F6' }
        ]
      },
      contentSentiment: stats.contentSentiment || {
        ownPostsSentiment: 0.5,
        engagedPostsSentiment: 0.5,
        socialEngagementScore: 0
      }
    };
  } catch (error) {
    console.error('Failed to load user stats:', error);
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalPosts: 0,
      weeklyStats: {
        postsThisWeek: 0,
        averageMood: 7,
        topCategories: [],
        moodTrend: [],
        sentimentPatterns: [
          { sentiment: 'Positive', value: 33, color: '#10B981' },
          { sentiment: 'Neutral', value: 33, color: '#F59E0B' },
          { sentiment: 'Reflective', value: 34, color: '#3B82F6' }
        ]
      },
      mostUsedWords: [],
      mostGratefulFor: [],
      contentSentiment: {
        ownPostsSentiment: 0.5,
        engagedPostsSentiment: 0.5,
        socialEngagementScore: 0
      }
    };
  }
};

export const updateUserStats = (posts: GratitudePost[], currentUserId: string = 'current-user'): UserStats => {
  const userPosts = posts.filter(post => post.authorId === currentUserId);
  const now = new Date();
  
  // Calculate streak
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  
  const sortedDates = userPosts
    .map(post => format(post.timestamp, 'yyyy-MM-dd'))
    .filter((date, index, arr) => arr.indexOf(date) === index)
    .sort()
    .reverse();

  if (sortedDates.length > 0) {
    const today = format(now, 'yyyy-MM-dd');
    const yesterday = format(new Date(now.getTime() - 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
    
    if (sortedDates[0] === today || sortedDates[0] === yesterday) {
      currentStreak = 1;
      for (let i = 1; i < sortedDates.length; i++) {
        const prevDate = new Date(sortedDates[i - 1]);
        const currDate = new Date(sortedDates[i]);
        const daysDiff = differenceInDays(prevDate, currDate);
        
        if (daysDiff === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
    }
    
    // Calculate longest streak
    tempStreak = 1;
    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i - 1]);
      const currDate = new Date(sortedDates[i]);
      const daysDiff = differenceInDays(prevDate, currDate);
      
      if (daysDiff === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak, currentStreak);
  }

  // Weekly stats
  const weekStart = startOfWeek(now);
  const weekEnd = endOfWeek(now);
  const thisWeekPosts = userPosts.filter(post => 
    isWithinInterval(post.timestamp, { start: weekStart, end: weekEnd })
  );

  // Calculate average mood for this week
  const weekMoodScores = thisWeekPosts.map(post => getMoodScore(post.moodTags));
  const averageMood = weekMoodScores.length > 0 ? Math.round(weekMoodScores.reduce((sum, score) => sum + score, 0) / weekMoodScores.length) : 7;

  // Calculate mood trend for last 7 days
  const moodTrend = [];
  for (let i = 6; i >= 0; i--) {
    const date = subDays(now, i);
    const dayPosts = userPosts.filter(post => 
      format(post.timestamp, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
    const dayMood = dayPosts.length > 0 ? Math.round(dayPosts.map(post => getMoodScore(post.moodTags)).reduce((sum, score) => sum + score, 0) / dayPosts.length) : 0;
    moodTrend.push({
      date: format(date, 'yyyy-MM-dd'),
      mood: dayMood,
      posts: dayPosts.length
    });
  }

  // Calculate content sentiment
  const userId = currentUserId;
  const ownPostsSentiments = userPosts.map(post => analyzeSentiment(post.content));
  const ownPostsSentiment = ownPostsSentiments.length > 0 ? ownPostsSentiments.reduce((sum, s) => sum + s, 0) / ownPostsSentiments.length : 0.5;

  // Find engaged posts (liked or commented by user)
  const engagedPosts = posts.filter(post => 
    post.reactions.some(r => r.userId === userId) || 
    post.replies.some(reply => reply.authorId === userId)
  );
  const engagedSentiments = engagedPosts.map(post => analyzeSentiment(post.content));
  const engagedPostsSentiment = engagedSentiments.length > 0 ? engagedSentiments.reduce((sum, s) => sum + s, 0) / engagedSentiments.length : 0.5;

  // Social engagement score: higher if engaging with positive content
  const socialEngagementScore = Math.min(engagedSentiments.filter(s => s > 0.6).length * 2, 20);

  const contentSentiment = {
    ownPostsSentiment,
    engagedPostsSentiment,
    socialEngagementScore
  };

  // Word frequency analysis
  const wordCounts: { [key: string]: number } = {};
  userPosts.forEach(post => {
    const words = post.content.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3 && !['that', 'this', 'with', 'have', 'will', 'from', 'they', 'been', 'were', 'said', 'each', 'which', 'their', 'time', 'would', 'there', 'could', 'other'].includes(word));
    
    words.forEach(word => {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    });
  });

  const mostUsedWords = Object.entries(wordCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }));

  // Category frequency
  const categoryCounts: { [key: string]: number } = {};
  userPosts.forEach(post => {
    categoryCounts[post.category] = (categoryCounts[post.category] || 0) + 1;
  });

  const totalCategoryPosts = Object.values(categoryCounts).reduce((sum, count) => sum + count, 0);
  const mostGratefulFor = Object.entries(categoryCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([category, count]) => ({
      category,
      count,
      percentage: Math.round((count / totalCategoryPosts) * 100)
    }));

  // Compute sentiment patterns
  let sentimentPatterns = [
    { sentiment: 'Positive', value: 33, color: '#10B981' },
    { sentiment: 'Neutral', value: 33, color: '#F59E0B' },
    { sentiment: 'Reflective', value: 34, color: '#3B82F6' }
  ];
  if (userPosts.length > 0) {
    const sentiments = userPosts.map(post => analyzeSentiment(post.content));
    const total = sentiments.length;
    const positive = sentiments.filter(s => s > 0.7).length;
    const neutral = sentiments.filter(s => s >= 0.3 && s <= 0.7).length;
    const reflective = sentiments.filter(s => s < 0.3).length;
    sentimentPatterns = [
      { sentiment: 'Positive', value: Math.round((positive / total) * 100), color: '#10B981' },
      { sentiment: 'Neutral', value: Math.round((neutral / total) * 100), color: '#F59E0B' },
      { sentiment: 'Reflective', value: Math.round((reflective / total) * 100), color: '#3B82F6' }
    ];
  }

  const stats: UserStats = {
    currentStreak,
    longestStreak,
    totalPosts: userPosts.length,
    lastPostDate: userPosts.length > 0 ? userPosts[0].timestamp : undefined,
    weeklyStats: {
      postsThisWeek: thisWeekPosts.length,
      averageMood,
      topCategories: mostGratefulFor.slice(0, 3),
      moodTrend,
      sentimentPatterns
    },
    mostUsedWords,
    mostGratefulFor,
    contentSentiment
  };

  saveUserStats(stats);
  return stats;
};

export const generatePostColors = (): string[] => [
  'from-pink-200 to-pink-300',
  'from-blue-200 to-blue-300',
  'from-green-200 to-green-300',
  'from-yellow-200 to-yellow-300',
  'from-purple-200 to-purple-300',
  'from-indigo-200 to-indigo-300',
  'from-red-200 to-red-300',
  'from-teal-200 to-teal-300',
  'from-orange-200 to-orange-300',
  'from-rose-200 to-rose-300',
  'from-emerald-200 to-emerald-300',
  'from-cyan-200 to-cyan-300'
];

export const getDailyPrompts = (): DailyPrompt[] => [
  {
    id: '1',
    date: format(new Date(), 'yyyy-MM-dd'),
    prompt: "Which Indian tradition or value brought you peace today?",
    category: 'culture'
  },
  {
    id: '2',
    date: format(new Date(), 'yyyy-MM-dd'),
    prompt: "Describe a family moment that filled your heart with gratitude.",
    category: 'family'
  },
  {
    id: '3',
    date: format(new Date(), 'yyyy-MM-dd'),
    prompt: "What natural beauty in India did you appreciate today?",
    category: 'nature'
  },
  {
    id: '4',
    date: format(new Date(), 'yyyy-MM-dd'),
    prompt: "What aspect of yoga or meditation improved your well-being?",
    category: 'health'
  },
  {
    id: '5',
    date: format(new Date(), 'yyyy-MM-dd'),
    prompt: "What natural beauty in India inspired you today?",
    category: 'nature'
  },
];

export const getTodaysPrompt = (): DailyPrompt => {
  const prompts = getDailyPrompts();
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  return prompts[dayOfYear % prompts.length];
};

// Journal entry storage functions
export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  prompt: string;
  mood: string;
  tags: string[];
  reflections: string[];
}

export const saveJournalEntries = (entries: JournalEntry[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.JOURNAL_ENTRIES, JSON.stringify(entries));
  } catch (error) {
    console.error('Failed to save journal entries:', error);
  }
};

export const loadJournalEntries = (): JournalEntry[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.JOURNAL_ENTRIES);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load journal entries:', error);
    return [];
  }
};

export const addJournalEntry = (entry: JournalEntry): void => {
  const entries = loadJournalEntries();
  entries.unshift(entry); // Add to beginning
  saveJournalEntries(entries);
};

