# Gratitude Wall - Mobile & Web App

A beautiful platform to share daily gratitude and spread positivity, compatible with both mobile and web devices.

## Features

- 📱 **Mobile Responsive Design** - Works perfectly on all screen sizes
- 🌐 **Web Compatible** - Full desktop experience with all features
- 💝 **Share Gratitude** - Post daily gratitude moments anonymously or with identity
- 🏷️ **Categories & Moods** - Organize posts by categories and mood tags
- 👥 **Social Features** - Connect with friends, send messages, build community
- 🔔 **Real-time Notifications** - Stay updated with likes, comments, and follows
- 📊 **Analytics** - Track your gratitude journey with insights and reports
- 🎨 **Beautiful UI** - Modern, gradient-based design with smooth animations

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development
- Tailwind CSS for responsive styling
- Lucide React for icons
- Recharts for analytics

### Backend
- Node.js with Express
- In-memory storage (easily upgradeable to MongoDB)
- RESTful API design
- Rate limiting and security middleware
- CORS enabled for cross-origin requests

## Getting Started

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gratitude-wall
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Set up environment variables**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your configuration
   cd ..
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   # or npm start for production
   ```
   The API will be available at `http://localhost:5000`

2. **Start the frontend development server**
   ```bash
   # In a new terminal
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

3. **Open your browser**
   Navigate to `http://localhost:5173` to use the application

## API Endpoints

### Posts
- `GET /api/posts` - Get all posts with filtering and pagination
- `POST /api/posts` - Create a new post
- `PUT /api/posts/:id/like` - Like/unlike a post
- `POST /api/posts/:id/reactions` - Add reaction to post
- `POST /api/posts/:id/comments` - Add comment to post

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get specific user

### Social
- `GET /api/social/friends/:userId` - Get user's friends
- `POST /api/social/friend-request` - Send friend request

### Notifications
- `GET /api/notifications/:userId` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read

### Categories & Moods
- `GET /api/categories` - Get all categories
- `GET /api/moods` - Get all mood tags

### Health
- `GET /api/health` - API health check

## Mobile Optimization

The app includes several mobile optimizations:

- **Responsive Design**: Adapts to all screen sizes from mobile to desktop
- **Touch-Friendly**: Large touch targets and swipe gestures
- **Performance**: Optimized images and lazy loading
- **PWA Ready**: Can be installed as a mobile app (manifest included)

## Deployment

### Frontend (Vercel/Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to your preferred hosting platform
3. Set environment variable `VITE_API_URL` to your backend URL

### Backend (Heroku/Railway/Render)
1. Deploy the backend folder to your preferred platform
2. Set environment variables including `FRONTEND_URL`
3. Ensure the platform supports Node.js and npm

## Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit them
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions, please open an issue on the GitHub repository.

---

Made with ❤️ for spreading gratitude and positivity
