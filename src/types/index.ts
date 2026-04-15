export interface GratitudePost {
  id: string;
  content: string;
  category: PostCategory;
  timestamp: Date;
  likes: number;
  isLiked: boolean;
  color: string;
  author?: string;
  authorId?: string;
  isAnonymous: boolean;
  isPrivate: boolean;
  location?: string;
  moodTags: MoodTag[];
  reactions: Reaction[];
  replies: Reply[];
  imageUrl?: string;
}

export interface Reply {
  id: string;
  content: string;
  timestamp: Date;
  isAnonymous: boolean;
  author?: string;
  authorId?: string;
}

export interface Reaction {
  id: string;
  type: ReactionType;
  userId: string;
  timestamp: Date;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
  joinDate: Date;
  isVerified: boolean;
  isFollowing?: boolean;
  stats: UserPublicStats;
  preferences: UserPreferences;
}

export interface UserPublicStats {
  totalPosts: number;
  totalLikes: number;
  currentStreak: number;
  longestStreak: number;
  followersCount: number;
  followingCount: number;
  gratitudeScore: number;
}

export interface UserPreferences {
  allowFollowers: boolean;
  showEmail: boolean;
  showLocation: boolean;
  allowDirectMessages: boolean;
  notifyOnFollow: boolean;
  notifyOnLike: boolean;
  notifyOnComment: boolean;
}

export interface Friendship {
  id: string;
  followerId: string;
  followingId: string;
  status: FriendshipStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  message?: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
}

export interface DirectMessage {
  id: string;
  fromUserId: string;
  toUserId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  type: 'text' | 'gratitude_share';
  attachedPostId?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  timestamp: Date;
  actionUrl?: string;
  fromUserId?: string;
  postId?: string;
}

export type FriendshipStatus = 'following' | 'friends' | 'blocked';

export type NotificationType = 
  | 'new_follower'
  | 'friend_request'
  | 'post_liked'
  | 'post_commented'
  | 'friend_posted'
  | 'milestone_reached'
  | 'direct_message';

export type ReactionType = 'heart' | 'hug' | 'fire' | 'sunshine' | 'clap' | 'sparkle';

export type MoodTag = 'hopeful' | 'thankful' | 'overcoming' | 'peaceful' | 'excited' | 'content' | 'inspired' | 'blessed';

export type PostCategory = 
  | 'family'
  | 'health'
  | 'career'
  | 'nature'
  | 'friendship'
  | 'achievement'
  | 'mindfulness'
  | 'love'
  | 'food'
  | 'relationships'
  | 'general';

export interface CategoryConfig {
  name: string;
  icon: string;
  color: string;
  bgColor: string;
}

export interface UserStats {
  currentStreak: number;
  longestStreak: number;
  totalPosts: number;
  lastPostDate?: Date;
  weeklyStats: WeeklyStats;
  mostUsedWords: WordFrequency[];
  mostGratefulFor: CategoryFrequency[];
  contentSentiment: ContentSentiment;
}

export interface WeeklyStats {
  postsThisWeek: number;
  averageMood: number;
  topCategories: CategoryFrequency[];
  moodTrend: MoodTrendPoint[];
  sentimentPatterns: SentimentPattern[];
}

export interface WordFrequency {
  word: string;
  count: number;
}

export interface CategoryFrequency {
  category: string;
  count: number;
  percentage: number;
}

export interface MoodTrendPoint {
  date: string;
  mood: number;
  posts: number;
}

export interface SentimentPattern {
  sentiment: string;
  value: number;
  color: string;
}

export interface ContentSentiment {
  ownPostsSentiment: number; // 0-1 scale
  engagedPostsSentiment: number; // 0-1 scale
  socialEngagementScore: number; // 0-20 based on positive engagement
}

export interface DailyPrompt {
  id: string;
  date: string;
  prompt: string;
  category: PostCategory;
}
