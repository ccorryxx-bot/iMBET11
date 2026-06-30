import { motion } from 'framer-motion';
import { Crown, Star } from 'lucide-react';

interface TierBadgeProps {
  level: 1 | 2;
  size?: 'sm' | 'md' | 'lg';
}

export default function TierBadge({ level, size = 'md' }: TierBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-3 py-1.5 text-sm gap-1.5',
    lg: 'px-4 py-2 text-base gap-2',
  };

  const iconSize = size === 'sm' ? 12 : size === 'md' ? 14 : 18;

  const levelConfig = {
    1: {
      gradient: 'from-amber-400 to-amber-600',
      glowColor: 'rgba(251, 191, 36, 0.4)',
      text: 'Level 1',
    },
    2: {
      gradient: 'from-emerald-400 to-emerald-600',
      glowColor: 'rgba(52, 211, 153, 0.4)',
      text: 'Level 2',
    },
  };

  const config = levelConfig[level];

  return (
    <motion.div
      className={`inline-flex items-center rounded-full bg-gradient-to-r ${config.gradient} text-white font-bold shadow-lg`}
      style={{ boxShadow: `0 0 20px ${config.glowColor}` }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
    >
      <div className={`flex items-center ${sizeClasses[size]}`}>
        {level === 2 ? (
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <Crown size={iconSize} />
          </motion.div>
        ) : (
          <Star size={iconSize} />
        )}
        <span>{config.text}</span>
      </div>
    </motion.div>
  );
}
