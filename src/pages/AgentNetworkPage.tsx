import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Link2, ChevronUp, ChevronDown, Users } from 'lucide-react';
import AnimatedCounter from '../components/AnimatedCounter';
import CopyButton from '../components/CopyButton';
import TierBadge from '../components/TierBadge';

const teamMembers = [
  { id: 1, name: 'Player***88', level: 1, earnings: 2580, date: '2024-01-15' },
  { id: 2, name: 'Lucky***66', level: 2, earnings: 4250, date: '2024-01-14' },
  { id: 3, name: 'Win***99', level: 1, earnings: 1200, date: '2024-01-13' },
  { id: 4, name: 'Super***77', level: 1, earnings: 890, date: '2024-01-12' },
  { id: 5, name: 'Mega***55', level: 2, earnings: 3200, date: '2024-01-11' },
  { id: 6, name: 'Gold***33', level: 1, earnings: 1580, date: '2024-01-10' },
];

function NetworkGlobe() {
  const nodes = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.cos((i * 2 * Math.PI) / 20) * 100,
    y: Math.sin((i * 2 * Math.PI) / 20) * 40,
    z: Math.sin((i * Math.PI) / 10) * 60,
  }));

  return (
    <div className="relative w-64 h-64 mx-auto perspective-[1000px]">
      <motion.div
        className="absolute inset-0"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        {/* Globe core */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent-teal/20 to-accent-gold/20 blur-xl" />

        {/* Network rings */}
        {[80, 100, 120].map((size, ringIndex) => (
          <motion.div
            key={ringIndex}
            className="absolute left-1/2 top-1/2 rounded-full border border-accent-teal/30"
            style={{
              width: size * 2,
              height: size,
              x: '-50%',
              y: '-50%',
              transform: `rotateX(${60 + ringIndex * 15}deg)`,
              transformStyle: 'preserve-3d',
            }}
            animate={{ rotateZ: ringIndex % 2 === 0 ? 360 : -360 }}
            transition={{ duration: 15 + ringIndex * 5, repeat: Infinity, ease: 'linear' }}
          />
        ))}

        {/* Network nodes */}
        {nodes.map((node, i) => (
          <motion.div
            key={node.id}
            className="absolute w-3 h-3 rounded-full bg-accent-gold shadow-lg"
            style={{
              left: '50%',
              top: '50%',
              x: node.x - 6,
              y: node.y + node.z / 2 - 6,
              opacity: 0.5 + (node.z + 60) / 120 * 0.5,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.4, 0.9, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}

        {/* Connecting lines */}
        {nodes.slice(0, 10).map((node, i) => {
          const nextNode = nodes[(i + 1) % nodes.length];
          return (
            <motion.div
              key={`line-${i}`}
              className="absolute h-px bg-gradient-to-r from-accent-teal/50 to-transparent"
              style={{
                left: '50%',
                top: '50%',
                width: 50,
                x: node.x,
                y: node.y + node.z / 2,
                transform: `rotate(${Math.atan2(nextNode.y - node.y, nextNode.x - node.x) * 180 / Math.PI}deg)`,
              }}
            />
          );
        })}
      </motion.div>

      {/* Floating coins */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={`coin-${i}`}
          className="absolute text-accent-gold"
          initial={{
            x: Math.random() * 200 - 100,
            y: Math.random() * 200 - 100,
          }}
          animate={{
            y: [null, -30, null],
            x: [null, Math.random() * 20 - 10, null],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        >
          <motion.span
            className="text-2xl"
            animate={{ rotateY: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            ¢
          </motion.span>
        </motion.div>
      ))}
    </div>
  );
}

export default function AgentNetworkPage() {
  const [stats, setStats] = useState({
    totalCommission: 0,
    teamMembers: 0,
    todayEarnings: 0,
  });
  const [expandedMember, setExpandedMember] = useState<number | null>(null);
  const inviteLink = 'https://imbet11.com/invite/AGENT2024';

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        totalCommission: 45820,
        teamMembers: 156,
        todayEarnings: 3250,
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen pb-20 relative overflow-hidden">
      {/* Background floating text */}
      <motion.div
        className="absolute top-10 -left-20 text-[10rem] font-bold text-text-primary opacity-[0.02] pointer-events-none select-none"
        animate={{ rotate: [-5, 5, -5] }}
        transition={{ duration: 10, repeat: Infinity }}
      >
        AGENT
      </motion.div>
      <motion.div
        className="absolute bottom-20 -right-10 text-[8rem] font-bold text-text-primary opacity-[0.015] pointer-events-none select-none"
        animate={{ rotate: [5, -5, 5] }}
        transition={{ duration: 12, repeat: Infinity }}
      >
        NETWORK
      </motion.div>

      {/* Header */}
      <header className="pt-8 pb-6 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            Agent Network
          </h1>
          <div className="flex items-center justify-center gap-2">
            <TierBadge level={2} />
          </div>
        </motion.div>
      </header>

      {/* 3D Globe */}
      <div className="py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <NetworkGlobe />
        </motion.div>
      </div>

      {/* Stats Panel */}
      <div className="px-4 py-4">
        <motion.div
          className="grid grid-cols-3 gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-center p-4 rounded-xl bg-surface">
            <motion.div
              className="text-accent-gold text-2xl font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <AnimatedCounter value={stats.totalCommission} prefix="฿" decimals={0} />
            </motion.div>
            <div className="text-text-muted text-xs mt-1">Total Commission</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-surface">
            <motion.div
              className="text-accent-teal text-2xl font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <AnimatedCounter value={stats.teamMembers} suffix="+" />
            </motion.div>
            <div className="text-text-muted text-xs mt-1">Team Members</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-surface">
            <motion.div
              className="text-status-success text-2xl font-bold"
              animate={{
                boxShadow: [
                  '0 0 0px rgba(34, 197, 94, 0)',
                  '0 0 10px rgba(34, 197, 94, 0.5)',
                  '0 0 0px rgba(34, 197, 94, 0)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <AnimatedCounter value={stats.todayEarnings} prefix="฿" decimals={0} />
            </motion.div>
            <div className="text-text-muted text-xs mt-1">Today</div>
          </div>
        </motion.div>
      </div>

      {/* Invite Link */}
      <div className="px-4 py-4">
        <motion.div
          className="p-4 rounded-xl bg-surface"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Link2 size={16} className="text-accent-gold" />
            <span className="text-text-primary font-medium text-sm">Your Invite Link</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 px-3 py-2 bg-text-dark/30 rounded-lg text-text-secondary text-xs truncate">
              {inviteLink}
            </div>
            <CopyButton text={inviteLink} className="!p-2" />
            <motion.button
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent-teal text-text-dark"
              whileTap={{ scale: 0.95 }}
            >
              <Share2 size={18} />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Team Members */}
      <div className="px-4 py-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-accent-teal" />
              <span className="text-text-primary font-medium">Team Members</span>
            </div>
            <span className="text-text-muted text-sm">{teamMembers.length} members</span>
          </div>

          <div className="space-y-2">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                className="overflow-hidden rounded-xl bg-surface"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.05 }}
              >
                <motion.button
                  className="w-full flex items-center justify-between p-3"
                  onClick={() => setExpandedMember(expandedMember === member.id ? null : member.id)}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-gold/30 to-accent-teal/30 flex items-center justify-center">
                      <span className="text-text-primary font-bold text-sm">
                        {member.name.slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <div className="text-text-primary text-sm font-medium">{member.name}</div>
                      <div className="text-text-muted text-xs">{member.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TierBadge level={member.level as 1 | 2} size="sm" />
                    <div className="text-accent-gold font-bold text-sm">
                      ฿{member.earnings.toLocaleString()}
                    </div>
                    {expandedMember === member.id ? (
                      <ChevronUp size={16} className="text-text-muted" />
                    ) : (
                      <ChevronDown size={16} className="text-text-muted" />
                    )}
                  </div>
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
