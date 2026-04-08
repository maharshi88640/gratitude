import { User, GratitudePost } from '../types';

interface ProfileWindowData {
  user: User;
  currentUserId: string;
  isFollowing: boolean;
  userPosts: GratitudePost[];
  onFollow: (userId: string) => void;
  onUnfollow: (userId: string) => void;
  onSendMessage: (userId: string) => void;
}

export const openProfileWindow = (data: ProfileWindowData) => {
  // Create a new window
  const profileWindow = window.open(
    '',
    `profile-${data.user.id}`,
    'width=1200,height=800,scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=no,status=no'
  );

  if (!profileWindow) {
    alert('Please allow popups to view profiles in a separate window');
    return;
  }

  // Set up the window content
  profileWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${data.user.displayName} - Gratitude Wall Profile</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          
          .gradient-bg {
            background: linear-gradient(135deg, #fef7ff 0%, #fdf2f8 25%, #fef3e2 50%, #fff7ed 75%, #fefce8 100%);
          }
          
          .card-shadow {
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          }
          
          .hover-lift:hover {
            transform: translateY(-4px);
          }
          
          .gradient-purple {
            background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
          }
          
          .gradient-pink {
            background: linear-gradient(135deg, #ec4899 0%, #f97316 100%);
          }
          
          .gradient-blue {
            background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          }
          
          .gradient-orange {
            background: linear-gradient(135deg, #f97316 0%, #eab308 100%);
          }
          
          .gradient-yellow {
            background: linear-gradient(135deg, #eab308 0%, #84cc16 100%);
          }
        </style>
      </head>
      <body class="gradient-bg">
        <div id="profile-root"></div>
        
        <script>
          // Profile data
          window.profileData = ${JSON.stringify(data)};
          
          // Close window function
          window.closeProfile = function() {
            window.close();
          };
          
          // Handle keyboard shortcuts
          document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
              window.close();
            }
          });
          
          // Render profile content
          function renderProfile() {
            const { user, currentUserId, isFollowing, userPosts } = window.profileData;
            const isOwnProfile = user.id === currentUserId;
            
            const root = document.getElementById('profile-root');
            root.innerHTML = \`
              <!-- Header Bar -->
              <div class="bg-white bg-opacity-90 backdrop-blur-sm border-b border-gray-200 border-opacity-50 sticky top-0 z-10">
                <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 gradient-purple rounded-full flex items-center justify-center">
                      <span class="text-white font-bold">\${user.displayName[0]}</span>
                    </div>
                    <div>
                      <h1 class="text-xl font-bold text-gray-900">
                        \${user.displayName}'s Profile
                      </h1>
                      <p class="text-sm text-gray-600">@\${user.username}</p>
                    </div>
                  </div>
                  <button
                    onclick="window.close()"
                    class="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                    title="Close window (Esc)"
                  >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              </div>

              <div class="max-w-6xl mx-auto px-6 py-8">
                <!-- Profile Header -->
                <div class="bg-white bg-opacity-80 backdrop-blur-sm rounded-3xl p-8 mb-8 card-shadow border border-white border-opacity-20">
                  <div class="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
                    <!-- Avatar -->
                    <div class="w-32 h-32 gradient-purple rounded-full flex items-center justify-center text-white text-5xl font-bold shadow-xl">
                      \${user.displayName[0]}
                    </div>

                    <!-- User Info -->
                    <div class="flex-1 text-center lg:text-left">
                      <div class="flex items-center justify-center lg:justify-start space-x-3 mb-3">
                        <h2 class="text-4xl font-bold text-gray-900">\${user.displayName}</h2>
                        \${user.isVerified ? '<span class="text-blue-500 text-2xl">✓</span>' : ''}
                      </div>
                      <p class="text-xl text-gray-600 mb-4">@\${user.username}</p>
                      
                      \${user.bio ? \`<p class="text-lg text-gray-700 mb-6 max-w-2xl leading-relaxed">\${user.bio}</p>\` : ''}

                      <div class="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-gray-600 mb-8">
                        \${user.location ? \`
                          <div class="flex items-center space-x-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            <span class="text-lg">\${user.location}</span>
                          </div>
                        \` : ''}
                        <div class="flex items-center space-x-2">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          <span class="text-lg">Joined \${new Date(user.joinDate).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <!-- Stats Grid -->
                      <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div class="text-center bg-gradient-to-r from-purple-100 to-purple-200 rounded-2xl p-6">
                          <div class="flex items-center justify-center w-16 h-16 bg-purple-500 rounded-full mb-4 mx-auto">
                            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                            </svg>
                          </div>
                          <p class="text-3xl font-bold text-purple-700">\${user.stats.followersCount}</p>
                          <p class="text-purple-600 font-medium">Followers</p>
                        </div>
                        <div class="text-center bg-gradient-to-r from-pink-100 to-pink-200 rounded-2xl p-6">
                          <div class="flex items-center justify-center w-16 h-16 bg-pink-500 rounded-full mb-4 mx-auto">
                            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                            </svg>
                          </div>
                          <p class="text-3xl font-bold text-pink-700">\${user.stats.totalLikes}</p>
                          <p class="text-pink-600 font-medium">Likes</p>
                        </div>
                        <div class="text-center bg-gradient-to-r from-orange-100 to-orange-200 rounded-2xl p-6">
                          <div class="flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full mb-4 mx-auto">
                            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path>
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"></path>
                            </svg>
                          </div>
                          <p class="text-3xl font-bold text-orange-700">\${user.stats.currentStreak}</p>
                          <p class="text-orange-600 font-medium">Day Streak</p>
                        </div>
                        <div class="text-center bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-2xl p-6">
                          <div class="flex items-center justify-center w-16 h-16 bg-yellow-500 rounded-full mb-4 mx-auto">
                            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                            </svg>
                          </div>
                          <p class="text-3xl font-bold text-yellow-700">\${user.stats.gratitudeScore}</p>
                          <p class="text-yellow-600 font-medium">Score</p>
                        </div>
                      </div>

                      <!-- Action Buttons -->
                      <div class="flex flex-wrap justify-center lg:justify-start gap-4">
                        \${isOwnProfile ? \`
                          <button class="flex items-center space-x-3 px-8 py-4 bg-gray-100 text-gray-700 rounded-full font-semibold hover:bg-gray-200 transition-all duration-200 transform hover:scale-105">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            <span>Edit Profile</span>
                          </button>
                        \` : \`
                          <button class="flex items-center space-x-3 px-8 py-4 gradient-purple text-white rounded-full font-semibold hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                            </svg>
                            <span>\${isFollowing ? 'Unfollow' : 'Follow'}</span>
                          </button>
                          
                          <button class="flex items-center space-x-3 px-8 py-4 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 transition-all duration-200 transform hover:scale-105">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                            </svg>
                            <span>Message</span>
                          </button>
                        \`}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Posts Section -->
                <div class="bg-white bg-opacity-80 backdrop-blur-sm rounded-3xl p-8 card-shadow border border-white border-opacity-20">
                  <h3 class="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
                    <svg class="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                    <span>Gratitude Posts (\${userPosts.length})</span>
                  </h3>
                  
                  \${userPosts.length === 0 ? \`
                    <div class="text-center py-16">
                      <svg class="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                      </svg>
                      <h4 class="text-2xl font-semibold text-gray-900 mb-4">No posts yet</h4>
                      <p class="text-lg text-gray-600">
                        \${isOwnProfile ? "Start sharing your gratitude!" : \`\${user.displayName} hasn't shared any gratitude posts yet.\`}
                      </p>
                    </div>
                  \` : \`
                    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                      \${userPosts.map(post => \`
                        <div class="bg-gradient-to-br \${post.color} rounded-2xl p-6 border border-white border-opacity-20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover-lift">
                          <p class="text-gray-800 leading-relaxed mb-4 text-lg">\${post.content}</p>
                          <div class="flex items-center justify-between text-sm text-gray-600">
                            <span>\${new Date(post.timestamp).toLocaleDateString()}</span>
                            <div class="flex items-center space-x-4">
                              <span class="flex items-center space-x-1">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                                </svg>
                                <span>\${post.likes}</span>
                              </span>
                              <span class="flex items-center space-x-1">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                                </svg>
                                <span>\${post.replies.length}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      \`).join('')}
                    </div>
                  \`}
                </div>
              </div>
            \`;
          }
          
          // Render the profile when the page loads
          renderProfile();
        </script>
      </body>
    </html>
  `);

  profileWindow.document.close();
  profileWindow.focus();
};