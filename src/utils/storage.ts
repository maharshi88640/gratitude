import { GratitudePost, UserStats, ReflectionSession, DailyPrompt } from '../types';
import { format, isToday, differenceInDays, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';

const STORAGE_KEYS = {
  POSTS: 'gratitude-posts',
  USER_STATS: 'user-stats',
  REFLECTIONS: 'reflection-sessions',
  LAST_PROMPT_DATE: 'last-prompt-date'
};

export const savePostsToStorage = (posts: GratitudePost[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  } catch (error) {
    console.error('Failed to save posts to storage:', error);
  }
};

export const loadPostsFromStorage = (): GratitudePost[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.POSTS);
    if (!stored) return [];
    
    const posts = JSON.parse(stored);
    return posts.map((post: any) => ({
      ...post,
      timestamp: new Date(post.timestamp),
      reactions: post.reactions || [],
      replies: post.replies || [],
      moodTags: post.moodTags || [],
      isAnonymous: post.isAnonymous ?? true,
      isPrivate: post.isPrivate ?? false
    }));
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
          averageMood: 0,
          topCategories: [],
          moodTrend: []
        },
        mostUsedWords: [],
        mostGratefulFor: []
      };
    }
    
    const stats = JSON.parse(stored);
    return {
      ...stats,
      lastPostDate: stats.lastPostDate ? new Date(stats.lastPostDate) : undefined
    };
  } catch (error) {
    console.error('Failed to load user stats:', error);
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalPosts: 0,
      weeklyStats: {
        postsThisWeek: 0,
        averageMood: 0,
        topCategories: [],
        moodTrend: []
      },
      mostUsedWords: [],
      mostGratefulFor: []
    };
  }
};

export const updateUserStats = (posts: GratitudePost[]): UserStats => {
  const userPosts = posts.filter(post => !post.isAnonymous || post.isPrivate);
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

  const stats: UserStats = {
    currentStreak,
    longestStreak,
    totalPosts: userPosts.length,
    lastPostDate: userPosts.length > 0 ? userPosts[0].timestamp : undefined,
    weeklyStats: {
      postsThisWeek: thisWeekPosts.length,
      averageMood: 0, // Could be calculated from mood tags
      topCategories: mostGratefulFor.slice(0, 3),
      moodTrend: [] // Could be implemented with mood tracking
    },
    mostUsedWords,
    mostGratefulFor
  };

  saveUserStats(stats);
  return stats;
};

export const saveReflectionSession = (session: ReflectionSession): void => {
  try {
    const sessions = loadReflectionSessions();
    sessions.push(session);
    localStorage.setItem(STORAGE_KEYS.REFLECTIONS, JSON.stringify(sessions));
  } catch (error) {
    console.error('Failed to save reflection session:', error);
  }
};

export const loadReflectionSessions = (): ReflectionSession[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.REFLECTIONS);
    if (!stored) return [];
    
    const sessions = JSON.parse(stored);
    return sessions.map((session: any) => ({
      ...session,
      date: new Date(session.date)
    }));
  } catch (error) {
    console.error('Failed to load reflection sessions:', error);
    return [];
  }
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
    prompt: "What family blessing are you most grateful for right now?",
    category: 'family'
  },
  {
    id: '3',
    date: format(new Date(), 'yyyy-MM-dd'),
    prompt: "How did Indian wisdom help you overcome a recent challenge?",
    category: 'growth'
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