import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/api';

interface Post {
  id: string;
  content: string;
  category: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  color: string;
  author?: string;
  authorId?: string;
  isAnonymous: boolean;
  isPrivate: boolean;
  location?: string;
  moodTags: string[];
  reactions: Array<{
    id: string;
    type: string;
    userId: string;
    timestamp: string;
  }>;
  replies: Array<{
    id: string;
    content: string;
    timestamp: string;
    isAnonymous: boolean;
    author?: string;
    authorId?: string;
  }>;
  imageUrl?: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface Mood {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  timestamp: string;
  fromUserId?: string;
}

interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
  joinDate: string;
  isVerified: boolean;
  stats: {
    totalPosts: number;
    totalLikes: number;
    currentStreak: number;
    longestStreak: number;
    followersCount: number;
    followingCount: number;
    gratitudeScore: number;
  };
}

export const usePosts = (params: Record<string, string | number> = {}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = useCallback(async (queryParams: Record<string, string | number> = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getPosts({ ...params, ...queryParams });
      setPosts(response.posts);
      setHasMore(response.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const createPost = async (postData: {
    content: string;
    category: string;
    isAnonymous?: boolean;
    isPrivate?: boolean;
    moodTags?: string[];
    location?: string;
    imageUrl?: string;
  }) => {
    try {
      const newPost = await apiService.createPost(postData);
      setPosts(prev => [newPost, ...prev]);
      return newPost;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const likePost = async (postId: string) => {
    try {
      const updatedPost = await apiService.likePost(postId);
      setPosts(prev => prev.map(post => 
        post.id === postId ? updatedPost : post
      ));
      return updatedPost;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const addReaction = async (postId: string, reactionType: string, userId: string) => {
    try {
      const updatedPost = await apiService.addReaction(postId, reactionType, userId);
      setPosts(prev => prev.map(post => 
        post.id === postId ? updatedPost : post
      ));
      return updatedPost;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const addComment = async (postId: string, content: string, userId: string, isAnonymous: boolean = true) => {
    try {
      const newComment = await apiService.addComment(postId, content, userId, isAnonymous);
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, replies: [...post.replies, newComment] }
          : post
      ));
      return newComment;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      const currentLength = posts.length;
      fetchPosts({ offset: currentLength });
    }
  };

  return {
    posts,
    loading,
    error,
    hasMore,
    createPost,
    likePost,
    addReaction,
    addComment,
    loadMore,
    refreshPosts: fetchPosts
  };
};

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await apiService.getCategories();
        setCategories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};

export const useMoods = () => {
  const [moods, setMoods] = useState<Mood[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMoods = async () => {
      try {
        setLoading(true);
        const data = await apiService.getMoods();
        setMoods(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMoods();
  }, []);

  return { moods, loading, error };
};

export const useNotifications = (userId: string | undefined) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const data = await apiService.getNotifications(userId);
      setNotifications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (notificationId: string) => {
    try {
      await apiService.markNotificationRead(notificationId);
      setNotifications(prev => prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return {
    notifications,
    loading,
    error,
    markAsRead,
    refreshNotifications: fetchNotifications
  };
};

export const useFriends = (userId: string | undefined) => {
  const [friends, setFriends] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFriends = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const data = await apiService.getFriends(userId);
      setFriends(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  const sendFriendRequest = async (toUserId: string, message?: string) => {
    if (!userId) throw new Error('User ID is required');
    
    try {
      await apiService.sendFriendRequest(userId, toUserId, message);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  return {
    friends,
    loading,
    error,
    sendFriendRequest,
    refreshFriends: fetchFriends
  };
};
