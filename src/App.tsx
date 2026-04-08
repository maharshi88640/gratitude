import { useState, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import GratitudePost from './components/GratitudePost';
import EmptyState from './components/EmptyState';
import AddPostModal from './components/AddPostModal';
import ProfileScreen from './components/ProfileScreen';
import PostingScreen from './components/PostingScreen';
import BottomToolbar from './components/BottomToolbar';
import ReflectionMode from './components/ReflectionMode';
import WeeklyReport from './components/WeeklyReport';
import CrisisSupport from './components/CrisisSupport';
import GratitudeJournal from './components/GratitudeJournal';
import { GratitudePost as PostType, User, FriendRequest, PostCategory, MoodTag, ReactionType, Reaction, Reply } from './types';
import api from './services/api';
import { savePostsToStorage, loadPostsFromStorage, generatePostColors, updateUserStats, loadUserStats } from './utils/storage';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PostCategory | 'all'>('all');
  const [selectedMoodTag, setSelectedMoodTag] = useState<MoodTag | 'all'>('all');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'friends'>('recent');
  const [showPrivate, setShowPrivate] = useState(true);
  const [showFriendsOnly, setShowFriendsOnly] = useState(false);
  const [userStats, setUserStats] = useState(loadUserStats());
  const [currentScreen, setCurrentScreen] = useState<'home' | 'social' | 'profile' | 'posting'>('home');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  
  // Social features state
  const [friends, setFriends] = useState<User[]>([sampleUsers[0], sampleUsers[2]]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  
  // Mental health features state
  const [showReflection, setShowReflection] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showCrisisSupport, setShowCrisisSupport] = useState(false);
  const [showGratitudeJournal, setShowGratitudeJournal] = useState(false);

  // Load posts on component mount
  useEffect(() => {
    const storedPosts = loadPostsFromStorage();
    if (storedPosts.length === 0) {
      setPosts(samplePosts);
      savePostsToStorage(samplePosts);
    } else {
      setPosts(storedPosts);
    }
  }, []);

  // Delete post handler
  const handleDeletePost = async (postId: string) => {
    try {
      // Call API to delete post
      await api.deletePost(postId, currentUser.id);
      
      // Update local state and storage
      const updatedPosts = posts.filter(post => post.id !== postId);
      setPosts(updatedPosts);
      savePostsToStorage(updatedPosts);
      
      // Update user stats
      const updatedStats = updateUserStats(updatedPosts);
      setUserStats(updatedStats);
      
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('Failed to delete post. Please try again.');
    }
  };

  
  // Update user stats when posts change
  useEffect(() => {
    if (posts.length > 0) {
      savePostsToStorage(posts);
      const stats = updateUserStats(posts);
      setUserStats(stats);
    }
  }, [posts]);

  const handleAddPost = (content: string, category: PostCategory, options: {
    isPrivate: boolean;
    isAnonymous: boolean;
    moodTags: MoodTag[];
    location?: string;
    imageUrl?: string;
  }) => {
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
      author: options.isAnonymous ? undefined : currentUser.displayName,
      authorId: currentUser.id,
      moodTags: options.moodTags,
      location: options.location,
      imageUrl: options.imageUrl,
      reactions: [],
      replies: []
    };

    setPosts(prevPosts => [newPost, ...prevPosts]);
    setCurrentScreen('home'); // Return to home after posting
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
    const user = [...sampleUsers, currentUser].find(u => u.id === userId);
    if (user) {
      const userPosts = posts.filter(p => p.authorId === userId);
      const isFollowing = friends.some(f => f.id === userId);
      console.log(userPosts, isFollowing);
    }
  };

  const handleSendMessage = (userId: string) => {
    // Placeholder function for messaging - to be implemented later
    console.log('Send message to:', userId);
  };

  const handleFollow = (userId: string) => {
    const userToFollow = sampleUsers.find(user => user.id === userId);
    if (userToFollow && !friends.some(f => f.id === userId)) {
      setFriends(prev => [...prev, userToFollow]);
    }
  };

  const handleUnfollow = (userId: string) => {
    setFriends(prev => prev.filter(f => f.id !== userId));
  };

  // Filter and sort posts
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = posts;

    if (!showPrivate) {
      filtered = filtered.filter(post => !post.isPrivate);
    }

    if (showFriendsOnly) {
      const friendIds = friends.map(f => f.id);
      filtered = filtered.filter(post => 
        post.authorId && (friendIds.includes(post.authorId) || post.authorId === currentUser.id)
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.location && post.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
        post.replies.some(reply => reply.content.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    if (selectedMoodTag !== 'all') {
      filtered = filtered.filter(post => post.moodTags.includes(selectedMoodTag));
    }

    if (selectedLocation) {
      filtered = filtered.filter(post => 
        post.location && post.location.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      if (sortBy === 'popular') {
        const aPopularity = a.likes + a.reactions.length + a.replies.length;
        const bPopularity = b.likes + b.reactions.length + b.replies.length;
        return bPopularity - aPopularity;
      } else if (sortBy === 'friends') {
        const friendIds = friends.map(f => f.id);
        const aIsFriend = a.authorId && friendIds.includes(a.authorId);
        const bIsFriend = b.authorId && friendIds.includes(b.authorId);
        
        if (aIsFriend && !bIsFriend) return -1;
        if (!aIsFriend && bIsFriend) return 1;
        return b.timestamp.getTime() - a.timestamp.getTime();
      }
      return b.timestamp.getTime() - a.timestamp.getTime();
    });

    return filtered;
  }, [posts, searchTerm, selectedCategory, selectedMoodTag, selectedLocation, sortBy, showPrivate, showFriendsOnly, friends, currentUser.id]);

  const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0);

  // Render different screens
  if (currentScreen === 'social') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 p-4">
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
    );
  }

  if (currentScreen === 'profile' && selectedUserId) {
    const user = [...sampleUsers, currentUser].find(u => u.id === selectedUserId);
    if (user) {
      const userPosts = posts.filter(p => p.authorId === selectedUserId);
      const isFollowing = friends.some(f => f.id === selectedUserId);
      
      return (
        <ProfileScreen
          user={user}
          currentUserId={currentUser.id}
          isFollowing={isFollowing}
          userPosts={userPosts}
          onFollow={handleFollow}
          onUnfollow={handleUnfollow}
          onSendMessage={handleSendMessage}
          onBack={() => setCurrentScreen('home')}
        />
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
        onSocialClick={() => setCurrentScreen('social')}
        onProfileClick={() => handleViewProfile(currentUser.id)}
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

      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-2 sm:py-4 lg:py-6">
        {filteredAndSortedPosts.length === 0 ? (
          <EmptyState
            searchTerm={searchTerm}
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
                friends={friends.map(f => f.id)}
              />
            ))}
          </div>
        )}
      </main>

            
      {/* Bottom Toolbar */}
      <BottomToolbar
        onReflectionClick={() => setShowReflection(true)}
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
      <ReflectionMode isOpen={showReflection} onClose={() => setShowReflection(false)} />

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