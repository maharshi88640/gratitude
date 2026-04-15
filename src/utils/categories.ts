import { CategoryConfig } from '../types';

export const categoryConfigs: Record<string, CategoryConfig> = {
  family: {
    name: 'Family',
    icon: 'Users',
    color: 'text-pink-600',
    bgColor: 'bg-pink-100'
  },
  health: {
    name: 'Health',
    icon: 'Heart',
    color: 'text-red-600',
    bgColor: 'bg-red-100'
  },
  career: {
    name: 'Career',
    icon: 'Briefcase',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  nature: {
    name: 'Nature',
    icon: 'Leaf',
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  friendship: {
    name: 'Friendship',
    icon: 'Users2',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100'
  },
  achievement: {
    name: 'Achievement',
    icon: 'Trophy',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  mindfulness: {
    name: 'Mindfulness',
    icon: 'Brain',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100'
  },
  love: {
    name: 'Love',
    icon: 'HeartHandshake',
    color: 'text-rose-600',
    bgColor: 'bg-rose-100'
  },
  food: {
    name: 'Food',
    icon: 'Coffee',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  },
  relationships: {
    name: 'Relationships',
    icon: 'Heart',
    color: 'text-red-500',
    bgColor: 'bg-red-50'
  },
  daily: {
    name: 'Daily',
    icon: 'Sun',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50'
  },
  general: {
    name: 'General',
    icon: 'Sparkles',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100'
  }
};

export const moodTagConfigs = {
  hopeful: { name: 'Hopeful', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  thankful: { name: 'Thankful', color: 'text-green-600', bgColor: 'bg-green-100' },
  overcoming: { name: 'Overcoming', color: 'text-purple-600', bgColor: 'bg-purple-100' },
  peaceful: { name: 'Peaceful', color: 'text-teal-600', bgColor: 'bg-teal-100' },
  excited: { name: 'Excited', color: 'text-orange-600', bgColor: 'bg-orange-100' },
  content: { name: 'Content', color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
  inspired: { name: 'Inspired', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  blessed: { name: 'Blessed', color: 'text-pink-600', bgColor: 'bg-pink-100' }
};

export const reactionConfigs = {
  heart: { icon: 'Heart', color: 'text-red-500', bgColor: 'bg-red-100' },
  hug: { icon: 'Users', color: 'text-blue-500', bgColor: 'bg-blue-100' },
  fire: { icon: 'Flame', color: 'text-orange-500', bgColor: 'bg-orange-100' },
  sunshine: { icon: 'Sun', color: 'text-yellow-500', bgColor: 'bg-yellow-100' },
  clap: { icon: 'Zap', color: 'text-purple-500', bgColor: 'bg-purple-100' },
  sparkle: { icon: 'Sparkles', color: 'text-pink-500', bgColor: 'bg-pink-100' }
};