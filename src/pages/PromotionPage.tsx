import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, ChevronDown, ChevronUp, Check, Sparkles, Clock, Users } from 'lucide-react';

const promotions = [
  {
    id: 1,
    title: 'Welcome Bonus',
    subtitle: 'New members only',
    description: 'Get 150% up to ฿5,000 on your first deposit',
    multiplier: '150%',
    maxBonus: '฿5,000',
    icon: Gift,
    gradient: 'from-accent-gold to-amber-600',
    badge: 'NEW',
    terms: [
      'Minimum deposit ฿100',
      'Wagering requirement 15x',
      'Valid for 30 days',
      'Cannot combine with other bonuses',
    ],
  },
  {
    id: 2,
    title: 'Daily Reload',
    subtitle: 'Every day',
    description: 'Get 50% up to ฿2,000 every day',
    multiplier: '50%',
    maxBonus: '฿2,000',
    icon: Clock,
    gradient: 'from-purple-500 to-purple-700',
    badge: 'DAILY',
    terms: [
      'Minimum deposit ฿200',
      'Wagering requirement 10x',
      'Claim once per day',
      'All games eligible',
    ],
  },
  {
    id: 3,
    title: 'Referral Bonus',
    subtitle: 'Invite friends',
    description: 'Earn ฿500 for each friend who joins',
    multiplier: '฿500',
    maxBonus: 'Per referral',
    icon: Users,
    gradient: 'from-accent-teal to-teal-600',
    badge: 'ONGOING',
    terms: [
      'Friend must make first deposit',
      'No limit on referrals',
      'Bonus credited instantly',
      'Friend also gets welcome bonus',
    ],
  },
];

export default function PromotionPage() {
  const [expandedPromo, setExpandedPromo] = useState<number | null>(null);
  const [claimed, setClaimed] = useState<number[]>([]);

  const handleClaim = (id: number) => {
    setClaimed([...claimed, id]);
  };

  return (
    <div className="min-h-screen pb-20 relative overflow-hidden">
      {/* Background floating text */}
      <motion.div
        className="absolute top-10 left-10 text-[6rem] font-bold text-text-primary opacity-[0.02] pointer-events-none select-none"
        animate={{ rotate: [-3, 3, -3] }}
        transition={{ duration: 8, repeat: Infinity }}
      >
        BONUS
      </motion.div>
      <motion.div
        className="absolute bottom-32 -right-10 text-[8rem] font-bold text-text-primary opacity-[0.015] pointer-events-none select-none rotate-12"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      >
        REWARDS
      </motion.div>

      {/* Header */}
      <header className="pt-8 pb-6 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="text-accent-gold" size={24} />
            <h1 className="text-2xl font-bold text-text-primary">Promotions</h1>
          </div>
          <p className="text-text-muted text-sm mt-1">Exclusive offers for you</p>
        </motion.div>
      </header>

      {/* Promotions List */}
      <div className="px-4">
        <div className="space-y-4">
          {promotions.map((promo, index) => {
            const isExpanded = expandedPromo === promo.id;
            const isClaimed = claimed.includes(promo.id);

            return (
              <motion.div
                key={promo.id}
                className="overflow-hidden rounded-2xl bg-surface"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
              >
                {/* Badge */}
                <div className="relative">
                  <motion.div
                    className={`absolute -top-1 -right-1 px-3 py-1 rounded-bl-xl text-xs font-bold text-white bg-gradient-to-r ${promo.gradient}`}
                  >
                    {promo.badge}
                  </motion.div>
                </div>

                {/* Main Content */}
                <motion.button
                  className="w-full p-5 text-left"
                  onClick={() => setExpandedPromo(isExpanded ? null : promo.id)}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${promo.gradient} flex items-center justify-center shrink-0`}
                    >
                      <promo.icon size={28} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-text-primary font-bold text-lg">{promo.title}</h3>
                      <p className="text-text-muted text-xs">{promo.subtitle}</p>
                      <p className="text-text-secondary text-sm mt-2">{promo.description}</p>
                    </div>
                    <div className="shrink-0">
                      {isExpanded ? (
                        <ChevronUp size={20} className="text-text-muted" />
                      ) : (
                        <ChevronDown size={20} className="text-text-muted" />
                      )}
                    </div>
                  </div>
                </motion.button>

                {/* Expanded Terms */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5">
                        <div className="border-t border-text-dark/20 pt-4 mt-2">
                          <h4 className="text-text-muted text-xs font-medium mb-3">Terms & Conditions</h4>
                          <ul className="space-y-2">
                            {promo.terms.map((term, i) => (
                              <motion.li
                                key={i}
                                className="flex items-start gap-2 text-text-secondary text-xs"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                              >
                                <div className="w-1 h-1 rounded-full bg-accent-gold shrink-0 mt-1.5" />
                                {term}
                              </motion.li>
                            ))}
                          </ul>

                          {/* Claim Button */}
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleClaim(promo.id);
                            }}
                            className={`w-full mt-4 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                              isClaimed
                                ? 'bg-status-success/20 text-status-success'
                                : `bg-gradient-to-r ${promo.gradient} text-white hover:opacity-90`
                            }`}
                            whileTap={{ scale: 0.98 }}
                            disabled={isClaimed}
                          >
                            {isClaimed ? (
                              <>
                                <Check size={18} />
                                Claimed
                              </>
                            ) : (
                              <>
                                <Gift size={18} />
                                Claim Bonus
                              </>
                            )}
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* More Coming Soon */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface text-text-muted text-sm">
            <Sparkles size={14} />
            More promotions coming soon
          </div>
        </motion.div>
      </div>
    </div>
  );
}
