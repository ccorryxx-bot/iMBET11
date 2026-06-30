import { motion } from 'framer-motion';

interface GameCardProps {
  title: string;
  provider: string;
  imageId: number;
}

const providerColors: Record<string, string> = {
  PP: 'bg-provider-pp',
  JILI: 'bg-provider-jili',
  PG: 'bg-provider-pg',
  JDB: 'bg-provider-jdb',
};

export default function GameCard({ title, provider, imageId }: GameCardProps) {
  const providerColor = providerColors[provider] || 'bg-accent-gold';

  return (
    <motion.div
      className="group relative cursor-pointer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-surface">
        <img
          src={`https://picsum.photos/seed/game${imageId}/300/400`}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <span
          className={`absolute top-2 left-2 px-1.5 py-0.5 rounded text-2xs font-bold text-white ${providerColor}`}
        >
          {provider}
        </span>
      </div>

      <p className="mt-1.5 px-0.5 text-text-secondary text-xs font-medium truncate">
        {title}
      </p>
    </motion.div>
  );
}
