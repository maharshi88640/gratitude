import { useState, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import GratitudePost from './components/GratitudePost';
import EmptyState from './components/EmptyState';
import AddPostModal from './components/AddPostModal';
import ProfileScreen from './components/ProfileScreen';
import EditProfile from './components/EditProfile';
import PostingScreen from './components/PostingScreen';
import BottomToolbar from './components/BottomToolbar';
import WeeklyReport from './components/WeeklyReport';
import CrisisSupport from './components/CrisisSupport';
import GratitudeJournal from './components/GratitudeJournal';
import FollowersPage from './components/FollowersPage';
import { GratitudePost as PostType, User, FriendRequest, PostCategory, MoodTag, ReactionType, Reaction, Reply } from './types';
import api from './services/api';
import { savePostsToStorage, loadPostsFromStorage, generatePostColors, updateUserStats } from './utils/storage';

// Mock current user with anonymous nickname
const currentUser: User = {
  id: 'current-user',
  username: 'grateful_soul_42',
  displayName: 'GratefulSoul42',
  email: 'hidden@private.com',
  bio: 'Spreading gratitude and positivity ✨ | Anonymous but authentic',
  location: 'Somewhere Beautiful',
  joinDate: new Date('2024-01-01'),
  isVerified: false,
  stats: {
    totalPosts: 45,
    totalLikes: 234,
    currentStreak: 12,
    longestStreak: 28,
    followersCount: 89,
    followingCount: 156,
    gratitudeScore: 92
  },
  preferences: {
    allowFollowers: true,
    showEmail: false,
    showLocation: false,
    allowDirectMessages: true,
    notifyOnFollow: true,
    notifyOnLike: true,
    notifyOnComment: true
  }
};

// Sample anonymous users
const sampleUsers: User[] = [
  {
    id: 'user1',
    username: 'mindful_wanderer',
    displayName: 'MindfulWanderer',
    email: 'hidden@private.com',
    bio: 'Finding joy in everyday moments ✨ | Digital nomad of gratitude',
    location: 'Hidden',
    joinDate: new Date('2024-01-15'),
    isVerified: false,
    stats: {
      totalPosts: 156,
      totalLikes: 892,
      currentStreak: 23,
      longestStreak: 45,
      followersCount: 234,
      followingCount: 189,
      gratitudeScore: 95
    },
    preferences: {
      allowFollowers: true,
      showEmail: false,
      showLocation: false,
      allowDirectMessages: true,
      notifyOnFollow: true,
      notifyOnLike: true,
      notifyOnComment: true
    }
  },
  {
    id: 'user2',
    username: 'zen_seeker_99',
    displayName: 'ZenSeeker99',
    email: 'hidden@private.com',
    bio: 'Spreading positivity one post at a time 🌟 | Anonymous but connected',
    location: 'Hidden',
    joinDate: new Date('2024-02-20'),
    isVerified: false,
    stats: {
      totalPosts: 89,
      totalLikes: 445,
      currentStreak: 12,
      longestStreak: 28,
      followersCount: 156,
      followingCount: 203,
      gratitudeScore: 87
    },
    preferences: {
      allowFollowers: true,
      showEmail: false,
      showLocation: false,
      allowDirectMessages: true,
      notifyOnFollow: true,
      notifyOnLike: false,
      notifyOnComment: true
    }
  },
  {
    id: 'user3',
    username: 'thankful_heart',
    displayName: 'ThankfulHeart',
    email: 'hidden@private.com',
    bio: 'Grateful for family, friends, and new adventures 🌈 | Authentic gratitude',
    location: 'Hidden',
    joinDate: new Date('2024-03-10'),
    isVerified: false,
    stats: {
      totalPosts: 203,
      totalLikes: 1156,
      currentStreak: 31,
      longestStreak: 52,
      followersCount: 445,
      followingCount: 298,
      gratitudeScore: 98
    },
    preferences: {
      allowFollowers: true,
      showEmail: false,
      showLocation: false,
      allowDirectMessages: true,
      notifyOnFollow: true,
      notifyOnLike: true,
      notifyOnComment: true
    }
  }
];

// Sample posts with anonymous authors
const samplePosts: PostType[] = [
  {
    id: uuidv4(),
    content: "I'm grateful for the warm morning coffee and the peaceful sunrise that greeted me today. These small moments of tranquility set the tone for a beautiful day ahead.",
    category: 'mindfulness',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likes: 12,
    isLiked: false,
    color: 'from-orange-200 to-yellow-200',
    isAnonymous: false,
    isPrivate: false,
    author: 'MindfulWanderer',
    authorId: 'user1',
    moodTags: ['peaceful', 'thankful'],
    reactions: [],
    replies: [
      {
        id: uuidv4(),
        content: "This is so beautiful! Morning coffee hits different when you're mindful about it. ☕✨",
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        isAnonymous: true,
        author: 'Anonymous',
        authorId: 'user2'
      }
    ],
    location: undefined
  },
  {
    id: uuidv4(),
    content: "Grateful for my family's unwavering support during challenging times. Their love and encouragement remind me that I'm never alone in this journey.",
    category: 'family',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    likes: 24,
    isLiked: false,
    color: 'from-pink-200 to-rose-200',
    isAnonymous: false,
    isPrivate: false,
    author: 'ZenSeeker99',
    authorId: 'user2',
    moodTags: ['blessed', 'hopeful'],
    reactions: [],
    replies: [],
    location: undefined
  },
  {
    id: uuidv4(),
    content: "Today I'm grateful for the opportunity to learn something new. Started a pottery class and it's amazing how working with clay can be so meditative and grounding.",
    category: 'achievement',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    likes: 18,
    isLiked: false,
    color: 'from-purple-200 to-indigo-200',
    isAnonymous: false,
    isPrivate: false,
    author: 'ThankfulHeart',
    authorId: 'user3',
    moodTags: ['inspired', 'excited'],
    reactions: [],
    replies: [],
    location: undefined
  }
];

function App() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<'home' | 'social' | 'posting' | 'profile' | 'post-detail' | 'edit-profile' | 'followers'>('home');
  const [showMyPostsOnly, setShowMyPostsOnly] = useState(false);
  const userStats = useMemo(() => updateUserStats(posts, currentUser.id), [posts, currentUser.id]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  
  // Filter and search state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PostCategory | 'all'>('all');
  const [selectedMoodTag, setSelectedMoodTag] = useState<MoodTag | 'all'>('all');
  const [selectedLocation, setSelectedLocation] = useState<string | 'all'>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'friends' | 'recent'>('recent');
  const [showPrivate, setShowPrivate] = useState(false);
  const [showFriendsOnly, setShowFriendsOnly] = useState(false);

  // Social features state
  const [friends, setFriends] = useState<User[]>([sampleUsers[0], sampleUsers[1], sampleUsers[2], sampleUsers[3]]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [following, setFollowing] = useState<Set<string>>(new Set(['user1', 'user2'])); // Current user follows user1 and user2
  
  // Following state for demo users - simulate who they follow
  const [demoUserFollowing, setDemoUserFollowing] = useState<{ [key: string]: Set<string> }>({
    'user1': new Set(['current-user', 'user2', 'user3']), // Rahul follows current-user, user2, user3
    'user2': new Set(['current-user', 'user1', 'user4']), // Priya follows current-user, user1, user4
    'user3': new Set(['current-user', 'user1']), // Amit follows current-user, user1
    'user4': new Set(['current-user', 'user2', 'user3']) // Sneha follows current-user, user2, user3
  });
  
  // Followers state - simulate followers for demo users
  const [followers, setFollowers] = useState<{ [key: string]: User[] }>({
    'user1': [sampleUsers[0], sampleUsers[1], sampleUsers[2], sampleUsers[3]], // Rahul has 4 followers
    'user2': [sampleUsers[0], sampleUsers[1], sampleUsers[2], sampleUsers[3]], // Priya has 4 followers  
    'user3': [sampleUsers[0], sampleUsers[1], sampleUsers[2], sampleUsers[3]], // Amit has 4 followers
    'user4': [sampleUsers[0], sampleUsers[1], sampleUsers[2], sampleUsers[3]], // Sneha has 4 followers
    'current-user': [sampleUsers[0], sampleUsers[1], sampleUsers[2], sampleUsers[3]] // Current user has 4 followers
  });
  
  // Mental health features state
  const [showReport, setShowReport] = useState(false);
  const [showCrisisSupport, setShowCrisisSupport] = useState(false);
  const [showGratitudeJournal, setShowGratitudeJournal] = useState(false);

  // Load posts on component mount, prefer backend when available
  useEffect(() => {
    const loadPosts = async () => {
      try {
        console.log('Loading posts from backend...');
        const response = await api.getPosts();
        console.log('Backend response:', response);
        
        if (response?.posts && Array.isArray(response.posts)) {
          console.log(`Found ${response.posts.length} posts from backend`);
          const backendPosts = response.posts.map((post: any) => ({
            ...post,
            timestamp: new Date(post.timestamp),
            reactions: Array.isArray(post.reactions)
              ? post.reactions.map((reaction: any) => ({
                  ...reaction,
                  timestamp: new Date(reaction.timestamp)
                }))
              : [],
            replies: Array.isArray(post.replies)
              ? post.replies.map((reply: any) => ({
                  ...reply,
                  timestamp: new Date(reply.timestamp)
                }))
              : [],
            moodTags: post.moodTags || [],
            isAnonymous: post.isAnonymous ?? true,
            isPrivate: post.isPrivate ?? false
          }));

          // If backend has posts, use them
          if (backendPosts.length > 0) {
            setPosts(backendPosts);
            savePostsToStorage(backendPosts);
            console.log('Backend posts loaded and saved to localStorage');
            return;
          } else {
            console.log('Backend has no posts, checking localStorage...');
          }
        } else {
          console.log('No posts found in backend response');
        }
      } catch (error) {
        console.warn('Backend load failed, falling back to local storage:', error);
      }

      // Fallback to localStorage
      console.log('Loading posts from localStorage...');
      const storedPosts = loadPostsFromStorage();
      console.log(`Found ${storedPosts.length} posts in localStorage`);
      
      if (storedPosts.length === 0) {
        console.log('No posts in localStorage, loading sample posts');
        setPosts(samplePosts);
        savePostsToStorage(samplePosts);
        console.log('Sample posts loaded and saved');
      } else {
        setPosts(storedPosts);
        console.log('Loaded posts from localStorage');
      }
    };

    loadPosts();
  }, []);

  // Delete post handler
  const handleDeletePost = async (postId: string) => {
    try {
      console.log('Attempting to delete post:', postId);
      
      // Try to delete from backend first
      try {
        await api.deletePost(postId, currentUser.id);
        console.log('Post deleted successfully from backend');
      } catch (backendError) {
        console.warn('Backend deletion failed, proceeding with local deletion only:', backendError);
        // Continue with local deletion even if backend fails
      }
      
      // Always update local state and storage
      const updatedPosts = posts.filter(post => post.id !== postId);
      setPosts(updatedPosts);
      savePostsToStorage(updatedPosts);
      console.log('Local state updated');
      
      alert('Post deleted successfully!');
      
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('Failed to delete post. Please try again.');
    }
  };

  
  // Keep post cache in sync with local storage
  useEffect(() => {
    if (posts.length > 0) {
      savePostsToStorage(posts);
    }
  }, [posts]);

  const handleAddPost = async (content: string, category: PostCategory, options: {
    isPrivate: boolean;
    isAnonymous: boolean;
    moodTags: MoodTag[];
    location?: string;
    imageUrl?: string;
  }) => {
    console.log('Creating new post:', { content, category, options });
    
    // Create post locally first to show it immediately
    const colors = generatePostColors();
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const newPost: PostType = {
      id: uuidv4(),
      content,
      category,
      timestamp: new Date(),
      likes: 0,
      isLiked: false,
      color: randomColor,
      isAnonymous: options.isAnonymous,
      isPrivate: options.isPrivate,
      author: options.isAnonymous ? 'Anonymous' : currentUser.displayName,
      authorId: currentUser.id, // Always include authorId for tracking
      moodTags: options.moodTags,
      reactions: [],
      replies: [],
      location: options.location
    };

    console.log('New post created locally:', newPost);

    // Update posts state immediately
    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    console.log('Posts state updated, now have', updatedPosts.length, 'posts');
    
    // Save to storage immediately
    savePostsToStorage(updatedPosts);
    console.log('Posts saved to localStorage');
    
    // Then try to sync with backend in background (don't wait for it)
    try {
      console.log('Syncing post to backend...');
      await api.createPost({
        content,
        category,
        isAnonymous: options.isAnonymous,
        isPrivate: options.isPrivate,
        moodTags: options.moodTags,
        location: options.location,
        imageUrl: options.imageUrl
      });
      console.log('Post synced to backend successfully');
    } catch (backendError) {
      console.warn('Backend sync failed, post saved locally:', backendError);
    }
    
    setCurrentScreen('home'); // Return to home after posting
  };

  // Handler to highlight user's posts (not filter out others)
  const handleShowMyPosts = () => {
    setShowMyPostsOnly(!showMyPostsOnly);
    // Reset to home screen when switching views
    setCurrentScreen('home');
  };

  const handleLikePost = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
              isLiked: !post.isLiked
            }
          : post
      )
    );
  };

  const handleReact = (postId: string, reactionType: ReactionType) => {
    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId) {
          const existingReaction = post.reactions.find(r => r.userId === currentUser.id && r.type === reactionType);
          
          if (existingReaction) {
            return {
              ...post,
              reactions: post.reactions.filter(r => r.id !== existingReaction.id)
            };
          } else {
            const newReaction: Reaction = {
              id: uuidv4(),
              type: reactionType,
              userId: currentUser.id,
              timestamp: new Date()
            };
            return {
              ...post,
              reactions: [...post.reactions, newReaction]
            };
          }
        }
        return post;
      })
    );
  };

  const handleAddReply = (postId: string, content: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId) {
          const newReply: Reply = {
            id: uuidv4(),
            content,
            timestamp: new Date(),
            isAnonymous: true,
            author: 'Anonymous',
            authorId: currentUser.id
          };
          return {
            ...post,
            replies: [...post.replies, newReply]
          };
        }
        return post;
      })
    );
  };

  // Social features handlers
  const handleSendFriendRequest = (userId: string) => {
    const newRequest: FriendRequest = {
      id: uuidv4(),
      fromUserId: currentUser.id,
      toUserId: userId,
      message: "I'd love to connect and share our gratitude journeys!",
      status: 'pending',
      createdAt: new Date()
    };
    setFriendRequests(prev => [...prev, newRequest]);
  };

  const handleViewProfile = (userId: string) => {
    setSelectedUserId(userId);
    setCurrentScreen('profile');
  };

  const handleViewFollowers = (userId: string) => {
    setSelectedUserId(userId);
    setCurrentScreen('followers');
  };

  const handleFollow = (userId: string) => {
    const userToFollow = [...sampleUsers, currentUser].find(u => u.id === userId);
    if (userToFollow && !following.has(userId)) {
      // Update following state
      setFollowing(prev => new Set([...prev, userId]));
      
      // Update friends list (mutual follow logic like Instagram)
      setFriends(prev => {
        if (!prev.some(f => f.id === userId)) {
          return [...prev, userToFollow];
        }
        return prev;
      });
      
      // Update followers state - add current user to the followed user's followers
      setFollowers(prev => ({
        ...prev,
        [userId]: [...(prev[userId] || []), currentUser].filter(f => f && f.id)
      }));
      
      // Update demo user following state - add current user to their followers
      if (userId !== 'current-user') {
        setDemoUserFollowing(prev => ({
          ...prev,
          [userId]: new Set([...(prev[userId] || []), 'current-user'])
        }));
      }
    }
  };

  const handleUnfollow = (userId: string) => {
    // Update following state
    setFollowing(prev => {
      const newFollowing = new Set(prev);
      newFollowing.delete(userId);
      return newFollowing;
    });
    
    // Update friends list
    setFriends(prev => prev.filter(f => f.id !== userId));
    
    // Update followers state - remove current user from the unfollowed user's followers
    setFollowers(prev => ({
      ...prev,
      [userId]: (prev[userId] || []).filter(f => f.id !== currentUser.id)
    }));
    
    // Update demo user following state - remove current user from their followers
    if (userId !== 'current-user') {
      setDemoUserFollowing(prev => {
        const newFollowing = new Set(prev[userId] || []);
        newFollowing.delete('current-user');
        return {
          ...prev,
          [userId]: newFollowing
        };
      });
    }
  };

  const handleViewPost = (postId: string) => {
    setSelectedPostId(postId);
    setCurrentScreen('post-detail');
  };

  const handleSendMessage = (userId: string) => {
    // Placeholder function for messaging - to be implemented later
    console.log('Send message to:', userId);
  };

  const handleEditProfile = () => setCurrentScreen('edit-profile');

  const handleSaveProfile = (_updatedUser: Partial<User>) => {
    // Update currentUser (in a real app, this would save to backend)
    alert('Profile updated successfully!');
    setCurrentScreen('profile');
  };

  // Filter and sort posts - apply filters and limit to 4 total
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = [...posts];
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(post => 
        post.content.toLowerCase().includes(searchLower) ||
        post.author?.toLowerCase().includes(searchLower)
      );
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }
    
    // Filter by mood tag
    if (selectedMoodTag !== 'all') {
      filtered = filtered.filter(post => post.moodTags.includes(selectedMoodTag));
    }
    
    // Filter by location
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(post => post.location === selectedLocation);
    }
    
    // Filter private posts
    if (!showPrivate) {
      filtered = filtered.filter(post => !post.isPrivate);
    }
    
    // Filter friends only posts (only filter if property exists and is true)
    if (!showFriendsOnly) {
      filtered = filtered.filter(post => (post as any).isFriendsOnly !== true);
    }
    
    // Sort posts
    if (sortBy === 'popular') {
      filtered.sort((a, b) => (b.likes + b.reactions.length) - (a.likes + a.reactions.length));
    } else if (sortBy === 'friends') {
      // Filter to show only posts from friends
      const friendIds = friends.filter(f => f && f.id).map(f => f.id);
      filtered = filtered.filter(post => post.authorId && friendIds.includes(post.authorId));
      // Then sort by timestamp (most recent first)
      filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    } else {
      filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }
    
    return filtered.slice(0, 4); // Limit to 4 posts total
  }, [posts, searchTerm, selectedCategory, selectedMoodTag, selectedLocation, sortBy, showPrivate, showFriendsOnly]);

  const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0);

  // Render different screens
  if (currentScreen === 'social') {
    // ... (rest of the code remains the same)
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 p-4" style={{ paddingBottom: '180px' }}>
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setCurrentScreen('home')}
            className="mb-4 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            ← Back to Home
          </button>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Social Hub</h2>
            <p className="text-gray-600">Social features coming soon!</p>
            <div className="mt-4">
              <p className="text-sm text-gray-500">Friends: {friends.length}</p>
              <p className="text-sm text-gray-500">Friend Requests: {friendRequests.length}</p>
            </div>
          </div>
        </div>
      </div>
    
  }

  if (currentScreen === 'profile' && selectedUserId) {
    const user = [...sampleUsers, currentUser].find(u => u.id === selectedUserId);
    if (user) {
      const userPosts = posts.filter(p => p.authorId === selectedUserId);
      const isFollowing = selectedUserId === 'current-user' 
        ? false 
        : following.has(selectedUserId);
      
      // Calculate actual followers count from followers state
      const actualFollowersCount = (followers[selectedUserId] || []).filter(f => f && f.id).length;
      
      // Calculate actual following count for the selected user
      const actualFollowingCount = selectedUserId === 'current-user' 
        ? following.size 
        : demoUserFollowing[selectedUserId]?.size || 0;
      
      // Update user stats with actual counts
      const updatedUser = {
        ...user,
        stats: {
          ...user.stats,
          followersCount: actualFollowersCount,
          followingCount: actualFollowingCount
        }
      };
      
      return (
        <ProfileScreen
          user={updatedUser}
          currentUserId={currentUser.id}
          isFollowing={isFollowing}
          userPosts={userPosts}
          onFollow={handleFollow}
          onUnfollow={handleUnfollow}
          onSendMessage={handleSendMessage}
          onViewPost={handleViewPost}
          onBack={() => setCurrentScreen('home')}
          onEditProfile={handleEditProfile}
          onViewFollowers={handleViewFollowers}
          onDelete={handleDeletePost}
        />
      );
    }
  }

  if (currentScreen === 'edit-profile') {
    return (
      <EditProfile
        user={currentUser}
        onSave={handleSaveProfile}
        onBack={() => setCurrentScreen('profile')}
      />
    );
  }

  if (currentScreen === 'followers' && selectedUserId) {
    const user = [...sampleUsers, currentUser].find(u => u.id === selectedUserId);
    if (user) {
      const userFollowers = (followers[selectedUserId] || []).filter(f => f && f.id);
      
      // Calculate actual followers count from followers state
      const actualFollowersCount = userFollowers.length;
      
      // Calculate actual following count for the selected user
      const actualFollowingCount = selectedUserId === 'current-user' 
        ? following.size 
        : demoUserFollowing[selectedUserId]?.size || 0;
      
      // Update user stats with actual counts
      const updatedUser = {
        ...user,
        stats: {
          ...user.stats,
          followersCount: actualFollowersCount,
          followingCount: actualFollowingCount
        }
      };
      
      return (
        <FollowersPage
          user={updatedUser}
          followers={userFollowers.map(follower => ({
            ...follower,
            isFollowing: following.has(follower.id)
          }))}
          currentUserId={currentUser.id}
          onBack={() => setCurrentScreen('profile')}
          onViewProfile={handleViewProfile}
          onFollow={handleFollow}
          onUnfollow={handleUnfollow}
        />
      );
    }
  }

  if (currentScreen === 'post-detail' && selectedPostId) {
    const post = posts.find(p => p.id === selectedPostId);
    if (post) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 p-4" style={{ paddingBottom: '180px' }}>
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => setCurrentScreen('home')}
              className="mb-4 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              ← Back to Home
            </button>
            <GratitudePost
              post={post}
              onLike={handleLikePost}
              onReact={handleReact}
              onAddReply={handleAddReply}
              onViewProfile={handleViewProfile}
              onSendFriendRequest={handleSendFriendRequest}
              onFollow={handleFollow}
              onUnfollow={handleUnfollow}
              onDelete={handleDeletePost}
              currentUserId={currentUser.id}
              friends={friends.filter(f => f && f.id).map(f => f.id)}
            />
          </div>
        </div>
      );
    }
  }

  if (currentScreen === 'posting') {
    return (
      <PostingScreen
        onSubmit={handleAddPost}
        onBack={() => setCurrentScreen('home')}
      />
    );
  }

  // Main home screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <Header 
        totalPosts={posts.length} 
        totalLikes={totalLikes} 
        userStats={userStats}
        onProfileClick={() => handleViewProfile(currentUser.id)}
        onShowMyPosts={handleShowMyPosts}
        showMyPostsOnly={showMyPostsOnly}
      />
      
      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedMoodTag={selectedMoodTag}
        onMoodTagChange={setSelectedMoodTag}
        selectedLocation={selectedLocation}
        onLocationChange={setSelectedLocation}
        sortBy={sortBy}
        onSortChange={setSortBy}
        showPrivate={showPrivate}
        onShowPrivateChange={setShowPrivate}
        showFriendsOnly={showFriendsOnly}
        onShowFriendsOnlyChange={setShowFriendsOnly}
      />
      
      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-2 sm:py-4 lg:py-6" style={{ paddingBottom: '180px' }}>
        {filteredAndSortedPosts.length === 0 ? (
          <EmptyState
            onAddPost={() => setCurrentScreen('posting')}
          />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:gap-4 md:gap-6">
            {filteredAndSortedPosts.map((post) => (
              <GratitudePost
                key={post.id}
                post={post}
                onLike={handleLikePost}
                onReact={handleReact}
                onAddReply={handleAddReply}
                onViewProfile={handleViewProfile}
                onSendFriendRequest={handleSendFriendRequest}
                onDelete={handleDeletePost}
                currentUserId={currentUser.id}
                friends={friends.filter(f => f && f.id).map(f => f.id)}
              />
            ))}
          </div>
        )}
      </main>

            
      {/* Bottom Toolbar */}
      <BottomToolbar
        onReportClick={() => setShowReport(true)}
        onJournalClick={() => setShowGratitudeJournal(true)}
        onCrisisClick={() => setShowCrisisSupport(true)}
        onNewPostClick={() => setCurrentScreen('posting')}
      />
      
      <AddPostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddPost}
      />

      {/* Mental Health Modals */}
      <WeeklyReport isOpen={showReport} stats={userStats} onClose={() => setShowReport(false)} />

      {showCrisisSupport && (
        <CrisisSupport onClose={() => setShowCrisisSupport(false)} />
      )}

      {showGratitudeJournal && (
        <GratitudeJournal onClose={() => setShowGratitudeJournal(false)} />
      )}

          </div>
  );
}

export default App;