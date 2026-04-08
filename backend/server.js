import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import path from 'path';

// ES Module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(compression());
app.use(morgan('combined'));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});

app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// In-memory storage for demo (replace with database in production)
let posts = [];
let users = [];
let reactions = [];
let comments = [];
let friendships = [];
let notifications = [];

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Gratitude Wall API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Posts endpoints
app.get('/api/posts', (req, res) => {
  const { category, mood, search, sort = 'recent', limit = 20, offset = 0 } = req.query;
  
  let filteredPosts = [...posts];
  
  // Filter by category
  if (category && category !== 'all') {
    filteredPosts = filteredPosts.filter(post => post.category === category);
  }
  
  // Filter by mood
  if (mood && mood !== 'all') {
    filteredPosts = filteredPosts.filter(post => post.moodTags.includes(mood));
  }
  
  // Search functionality
  if (search) {
    const searchLower = search.toLowerCase();
    filteredPosts = filteredPosts.filter(post => 
      post.content.toLowerCase().includes(searchLower) ||
      post.author?.toLowerCase().includes(searchLower)
    );
  }
  
  // Sort posts
  if (sort === 'popular') {
    filteredPosts.sort((a, b) => (b.likes + b.reactions.length) - (a.likes + a.reactions.length));
  } else {
    filteredPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }
  
  // Pagination
  const paginatedPosts = filteredPosts.slice(parseInt(offset), parseInt(offset) + parseInt(limit));
  
  res.json({
    posts: paginatedPosts,
    total: filteredPosts.length,
    hasMore: parseInt(offset) + parseInt(limit) < filteredPosts.length
  });
});

app.post('/api/posts', (req, res) => {
  try {
    const { content, category, isAnonymous = false, isPrivate = false, moodTags = [], location, imageUrl } = req.body;
    
    if (!content || !category) {
      return res.status(400).json({ error: 'Content and category are required' });
    }
    
    const newPost = {
      id: Date.now().toString(),
      content,
      category,
      isAnonymous,
      isPrivate,
      moodTags,
      location,
      imageUrl,
      author: isAnonymous ? 'Anonymous' : 'User',
      authorId: isAnonymous ? null : 'user1',
      likes: 0,
      isLiked: false,
      color: 'from-orange-200 to-yellow-200',
      reactions: [],
      replies: [],
      timestamp: new Date().toISOString()
    };
    
    posts.unshift(newPost);
    
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

app.put('/api/posts/:id/like', (req, res) => {
  const { id } = req.params;
  const post = posts.find(p => p.id === id);
  
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  
  post.isLiked = !post.isLiked;
  post.likes += post.isLiked ? 1 : -1;
  
  res.json(post);
});

app.post('/api/posts/:id/reactions', (req, res) => {
  const { id } = req.params;
  const { type, userId } = req.body;
  
  const post = posts.find(p => p.id === id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  
  // Remove existing reaction from user
  post.reactions = post.reactions.filter(r => r.userId !== userId);
  
  // Add new reaction
  post.reactions.push({
    id: Date.now().toString(),
    type,
    userId,
    timestamp: new Date().toISOString()
  });
  
  res.json(post);
});

app.post('/api/posts/:id/comments', (req, res) => {
  const { id } = req.params;
  const { content, userId, isAnonymous = true } = req.body;
  
  const post = posts.find(p => p.id === id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  
  const newComment = {
    id: Date.now().toString(),
    content,
    isAnonymous,
    author: isAnonymous ? 'Anonymous' : 'User',
    authorId: isAnonymous ? null : userId,
    timestamp: new Date().toISOString()
  };
  
  post.replies.push(newComment);
  
  res.status(201).json(newComment);
});

// Delete a post
app.delete('/api/posts/:id', (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  
  const postIndex = posts.findIndex(p => p.id === id);
  if (postIndex === -1) {
    return res.status(404).json({ error: 'Post not found' });
  }
  
  const post = posts[postIndex];
  
  // Check if user owns the post (for non-anonymous posts)
  if (!post.isAnonymous && post.authorId !== userId) {
    return res.status(403).json({ error: 'You can only delete your own posts' });
  }
  
  // Remove the post
  posts.splice(postIndex, 1);
  
  res.json({ message: 'Post deleted successfully' });
});

// Delete a comment
app.delete('/api/posts/:postId/comments/:commentId', (req, res) => {
  const { postId, commentId } = req.params;
  const { userId } = req.body;
  
  const post = posts.find(p => p.id === postId);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  
  const commentIndex = post.replies.findIndex(r => r.id === commentId);
  if (commentIndex === -1) {
    return res.status(404).json({ error: 'Comment not found' });
  }
  
  const comment = post.replies[commentIndex];
  
  // Check if user owns the comment (for non-anonymous comments)
  if (!comment.isAnonymous && comment.authorId !== userId) {
    return res.status(403).json({ error: 'You can only delete your own comments' });
  }
  
  // Remove the comment
  post.replies.splice(commentIndex, 1);
  
  res.json({ message: 'Comment deleted successfully' });
});

// Users endpoints
app.get('/api/users', (req, res) => {
  res.json(users);
});

app.get('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const user = users.find(u => u.id === id);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json(user);
});

// Social endpoints
app.get('/api/social/friends/:userId', (req, res) => {
  const { userId } = req.params;
  const userFriendships = friendships.filter(f => f.followerId === userId || f.followingId === userId);
  const friendIds = userFriendships.map(f => f.followerId === userId ? f.followingId : f.followerId);
  const friendUsers = users.filter(u => friendIds.includes(u.id));
  
  res.json(friendUsers);
});

app.post('/api/social/friend-request', (req, res) => {
  const { fromUserId, toUserId, message } = req.body;
  
  const newRequest = {
    id: Date.now().toString(),
    fromUserId,
    toUserId,
    message,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  // In a real app, this would be stored in a separate collection
  notifications.push({
    id: Date.now().toString(),
    userId: toUserId,
    type: 'friend_request',
    title: 'Friend Request',
    message: `You received a friend request`,
    isRead: false,
    timestamp: new Date().toISOString(),
    fromUserId
  });
  
  res.status(201).json(newRequest);
});

// Notifications endpoint
app.get('/api/notifications/:userId', (req, res) => {
  const { userId } = req.params;
  const userNotifications = notifications.filter(n => n.userId === userId);
  
  res.json(userNotifications);
});

app.put('/api/notifications/:id/read', (req, res) => {
  const { id } = req.params;
  const notification = notifications.find(n => n.id === id);
  
  if (!notification) {
    return res.status(404).json({ error: 'Notification not found' });
  }
  
  notification.isRead = true;
  
  res.json(notification);
});

// Categories and moods endpoints
app.get('/api/categories', (req, res) => {
  const categories = [
    { id: 'family', name: 'Family', icon: '👨‍👩‍👧‍👦', color: 'bg-pink-100 text-pink-800' },
    { id: 'health', name: 'Health', icon: '💪', color: 'bg-green-100 text-green-800' },
    { id: 'career', name: 'Career', icon: '💼', color: 'bg-blue-100 text-blue-800' },
    { id: 'nature', name: 'Nature', icon: '🌿', color: 'bg-emerald-100 text-emerald-800' },
    { id: 'friendship', name: 'Friendship', icon: '🤝', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'achievement', name: 'Achievement', icon: '🏆', color: 'bg-purple-100 text-purple-800' },
    { id: 'mindfulness', name: 'Mindfulness', icon: '🧘', color: 'bg-indigo-100 text-indigo-800' },
    { id: 'love', name: 'Love', icon: '💕', color: 'bg-red-100 text-red-800' },
    { id: 'food', name: 'Food', icon: '🍽️', color: 'bg-orange-100 text-orange-800' },
    { id: 'relationships', name: 'Relationships', icon: '❤️', color: 'bg-rose-100 text-rose-800' },
    { id: 'general', name: 'General', icon: '✨', color: 'bg-gray-100 text-gray-800' }
  ];
  
  res.json(categories);
});

app.get('/api/moods', (req, res) => {
  const moods = [
    { id: 'hopeful', name: 'Hopeful', icon: '🌟', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'thankful', name: 'Thankful', icon: '🙏', color: 'bg-green-100 text-green-800' },
    { id: 'overcoming', name: 'Overcoming', icon: '💪', color: 'bg-red-100 text-red-800' },
    { id: 'peaceful', name: 'Peaceful', icon: '☮️', color: 'bg-blue-100 text-blue-800' },
    { id: 'excited', name: 'Excited', icon: '🎉', color: 'bg-purple-100 text-purple-800' },
    { id: 'content', name: 'Content', icon: '😌', color: 'bg-emerald-100 text-emerald-800' },
    { id: 'inspired', name: 'Inspired', icon: '💡', color: 'bg-indigo-100 text-indigo-800' },
    { id: 'blessed', name: 'Blessed', icon: '✨', color: 'bg-pink-100 text-pink-800' }
  ];
  
  res.json(moods);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5001;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running in ${NODE_ENV} mode on port ${PORT}`);
  console.log(`📱 API available at: http://localhost:${PORT}/api`);
  console.log(`🌐 Network access: http://192.168.131.37:${PORT}/api`);
});

export default app;
