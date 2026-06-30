import { motion } from 'framer-motion';

interface FloatingTextProps {
  text: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  opacity?: number;
}

export function FloatingText({ text, className = '', size = 'md', opacity = 0.04 }: FloatingTextProps) {
  const sizeClasses = {
    sm: 'text-4xl md:text-6xl',
    md: 'text-6xl md:text-8xl',
    lg: 'text-8xl md:text-[10rem]',
  };

  return (
    <span
      className={`absolute font-display font-bold text-text-primary whitespace-nowrap pointer-events-none select-none ${sizeClasses[size]} ${className}`}
      style={{ opacity }}
    >
      {text}
    </span>
  );
}

export function FloatingDecorSet() {
  return (
    <>
      <motion.div
        className="fixed text-text-primary pointer-events-none select-none"
        style={{ opacity: 0.03 }}
        initial={{ x: -100, y: 200 }}
        animate={{ x: -100, y: 180 }}
        transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse' }}
      >
        <span className="text-[8rem] md:text-[12rem] font-bold">iMBET11</span>
      </motion.div>

      <FloatingText text="WIN" className="top-1/4 right-0 rotate-12" size="lg" opacity={0.02} />
      <FloatingText text="GAME" className="bottom-1/3 -left-10 -rotate-6" size="md" opacity={0.02} />
    </>
  );
}
