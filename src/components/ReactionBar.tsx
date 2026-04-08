import React from 'react';
import * as LucideIcons from 'lucide-react';
import { ReactionType, Reaction } from '../types';
import { reactionConfigs } from '../utils/categories';

interface ReactionBarProps {
  reactions: Reaction[];
  onReact: (type: ReactionType) => void;
  currentUserId: string;
}

const ReactionBar: React.FC<ReactionBarProps> = ({ reactions, onReact, currentUserId }) => {
  const reactionCounts = reactions.reduce((acc, reaction) => {
    acc[reaction.type] = (acc[reaction.type] || 0) + 1;
    return acc;
  }, {} as Record<ReactionType, number>);

  const userReactions = reactions
    .filter(r => r.userId === currentUserId)
    .map(r => r.type);

  return (
    <div className="flex items-center space-x-2 mt-3">
      {Object.entries(reactionConfigs).map(([type, config]) => {
        const IconComponent = (LucideIcons as any)[config.icon] || LucideIcons.Heart;
        const count = reactionCounts[type as ReactionType] || 0;
        const isActive = userReactions.includes(type as ReactionType);
        
        return (
          <button
            key={type}
            onClick={() => onReact(type as ReactionType)}
            className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
              isActive
                ? `${config.bgColor} ${config.color} shadow-sm`
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <IconComponent className="w-3 h-3" />
            {count > 0 && <span>{count}</span>}
          </button>
        );
      })}
    </div>
  );
};

export default ReactionBar;