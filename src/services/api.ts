const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
}

interface PostData {
  content: string;
  category: string;
  isAnonymous?: boolean;
  isPrivate?: boolean;
  moodTags?: string[];
  location?: string;
  imageUrl?: string;
}

interface CommentData {
  content: string;
  userId: string;
  isAnonymous?: boolean;
}

interface FriendRequestData {
  fromUserId: string;
  toUserId: string;
  message?: string;
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request(endpoint: string, options: RequestOptions = {}): Promise<any> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Posts
  async getPosts(params: Record<string, string | number> = {}): Promise<any> {
    const queryString = new URLSearchParams(params as Record<string, string>).toString();
    return this.request(`/posts?${queryString}`);
  }

  async createPost(postData: PostData): Promise<any> {
    return this.request('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  async likePost(postId: string): Promise<any> {
    return this.request(`/posts/${postId}/like`, {
      method: 'PUT',
    });
  }

  async addReaction(postId: string, reactionType: string, userId: string): Promise<any> {
    return this.request(`/posts/${postId}/reactions`, {
      method: 'POST',
      body: JSON.stringify({ type: reactionType, userId }),
    });
  }

  async addComment(postId: string, content: string, userId: string, isAnonymous: boolean = true): Promise<any> {
    return this.request(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content, userId, isAnonymous }),
    });
  }

  // Delete operations
  async deletePost(postId: string, userId: string): Promise<void> {
    return this.request(`/posts/${postId}`, {
      method: 'DELETE',
      body: JSON.stringify({ userId }),
    });
  }

  async deleteComment(postId: string, commentId: string, userId: string): Promise<void> {
    return this.request(`/posts/${postId}/comments/${commentId}`, {
      method: 'DELETE',
      body: JSON.stringify({ userId }),
    });
  }

  // Users
  async getUsers(): Promise<any> {
    return this.request('/users');
  }

  async getUser(userId: string): Promise<any> {
    return this.request(`/users/${userId}`);
  }

  // Social
  async getFriends(userId: string): Promise<any> {
    return this.request(`/social/friends/${userId}`);
  }

  async sendFriendRequest(fromUserId: string, toUserId: string, message?: string): Promise<any> {
    return this.request('/social/friend-request', {
      method: 'POST',
      body: JSON.stringify({ fromUserId, toUserId, message }),
    });
  }

  // Notifications
  async getNotifications(userId: string): Promise<any> {
    return this.request(`/notifications/${userId}`);
  }

  async markNotificationRead(notificationId: string): Promise<any> {
    return this.request(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  }

  // Categories and Moods
  async getCategories(): Promise<any> {
    return this.request('/categories');
  }

  async getMoods(): Promise<any> {
    return this.request('/moods');
  }

  // Health check
  async healthCheck(): Promise<any> {
    return this.request('/health');
  }
}

export const apiService = new ApiService();
export default apiService;
