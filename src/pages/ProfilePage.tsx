import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, History, LogOut, Bell, Lock, ChevronRight, Crown, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import TierBadge from '../components/TierBadge';
import AnimatedCounter from '../components/AnimatedCounter';

type TabType = 'settings' | 'history';

const transactions = [
  { id: 1, type: 'deposit', amount: 5000, date: '2024-01-15 14:30', status: 'completed' },
  { id: 2, type: 'withdraw', amount: 2000, date: '2024-01-14 10:15', status: 'completed' },
  { id: 3, type: 'deposit', amount: 10000, date: '2024-01-12 18:45', status: 'completed' },
  { id: 4, type: 'deposit', amount: 3500, date: '2024-01-10 09:20', status: 'completed' },
  { id: 5, type: 'withdraw', amount: 8000, date: '2024-01-08 16:55', status: 'completed' },
  { id: 6, type: 'deposit', amount: 1500, date: '2024-01-05 11:30', status: 'completed' },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabType | null>(null);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="min-h-screen pb-20 relative overflow-hidden">
      {/* Background floating text */}
      <motion.div
        className="absolute top-20 -right-20 text-[10rem] font-bold text-text-primary opacity-[0.02] pointer-events-none select-none rotate-12"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
      >
        VIP
      </motion.div>

      {/* Header */}
      <header className="pt-8 pb-6 px-4">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Avatar with VIP badge */}
          <div className="relative inline-block">
            <motion.div
              className="w-24 h-24 rounded-full bg-gradient-to-br from-accent-gold via-amber-500 to-orange-500 p-0.5"
              animate={{
                boxShadow: [
                  '0 0 0px rgba(212, 165, 52, 0)',
                  '0 0 30px rgba(212, 165, 52, 0.5)',
                  '0 0 0px rgba(212, 165, 52, 0)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="w-full h-full rounded-full bg-brand-bg flex items-center justify-center">
                <User size={40} className="text-accent-gold" />
              </div>
            </motion.div>
            <div className="absolute -bottom-1 -right-1">
              <Crown size={28} className="text-accent-gold drop-shadow-lg" />
            </div>
          </div>

          {/* Username and Balance */}
          <h1 className="mt-4 text-xl font-bold text-text-primary">Player***88</h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <TierBadge level={2} />
          </div>

          {/* Balance */}
          <motion.div
            className="mt-6 inline-block px-6 py-3 rounded-xl bg-surface"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-text-muted text-xs mb-1">Total Balance</div>
            <motion.div
              className="text-3xl font-bold text-accent-gold"
              animate={{
                textShadow: [
                  '0 0 0px rgba(212, 165, 52, 0)',
                  '0 0 15px rgba(212, 165, 52, 0.4)',
                  '0 0 0px rgba(212, 165, 52, 0)',
                ],
              }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              <AnimatedCounter value={12580} prefix="฿" decimals={0} />
            </motion.div>
          </motion.div>
        </motion.div>
      </header>

      {/* Tab Selection */}
      <AnimatePresence mode="wait">
        {activeTab === null ? (
          <motion.div
            key="menu"
            className="px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Menu Items */}
            <div className="space-y-3">
              <motion.button
                onClick={() => setActiveTab('settings')}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-surface hover:bg-surface-hover transition-colors"
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-teal/20 flex items-center justify-center">
                    <Settings size={20} className="text-accent-teal" />
                  </div>
                  <span className="text-text-primary font-medium">Settings</span>
                </div>
                <ChevronRight size={20} className="text-text-muted" />
              </motion.button>

              <motion.button
                onClick={() => setActiveTab('history')}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-surface hover:bg-surface-hover transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <History size={20} className="text-purple-400" />
                  </div>
                  <span className="text-text-primary font-medium">Transaction History</span>
                </div>
                <ChevronRight size={20} className="text-text-muted" />
              </motion.button>

              <motion.button
                className="w-full flex items-center justify-between p-4 rounded-xl bg-status-error/10 hover:bg-status-error/20 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-status-error/20 flex items-center justify-center">
                    <LogOut size={20} className="text-status-error" />
                  </div>
                  <span className="text-status-error font-medium">Log Out</span>
                </div>
              </motion.button>
            </div>
          </motion.div>
        ) : activeTab === 'settings' ? (
          <motion.div
            key="settings"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="px-4"
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.button
                onClick={() => setActiveTab(null)}
                className="text-text-muted"
                whileTap={{ scale: 0.95 }}
              >
                ← Back
              </motion.button>
              <h2 className="text-text-primary font-bold text-lg">Settings</h2>
            </div>

            <div className="space-y-4">
              {/* Notifications Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-surface">
                <div className="flex items-center gap-3">
                  <Bell size={20} className="text-accent-teal" />
                  <span className="text-text-primary">Push Notifications</span>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`w-12 h-7 rounded-full transition-colors ${
                    notifications ? 'bg-accent-gold' : 'bg-text-dark/30'
                  }`}
                >
                  <motion.div
                    className="w-5 h-5 rounded-full bg-white"
                    animate={{ x: notifications ? 24 : 4 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-surface">
                <div className="flex items-center gap-3">
                  <Lock size={20} className="text-accent-teal" />
                  <span className="text-text-primary">Change Password</span>
                </div>
                <ChevronRight size={18} className="text-text-muted" />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="history"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="px-4"
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.button
                onClick={() => setActiveTab(null)}
                className="text-text-muted"
                whileTap={{ scale: 0.95 }}
              >
                ← Back
              </motion.button>
              <h2 className="text-text-primary font-bold text-lg">Transaction History</h2>
            </div>

            <div className="space-y-3">
              {transactions.map((tx, index) => (
                <motion.div
                  key={tx.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-surface"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        tx.type === 'deposit'
                          ? 'bg-status-success/20'
                          : 'bg-status-warning/20'
                      }`}
                    >
                      {tx.type === 'deposit' ? (
                        <ArrowDownLeft size={20} className="text-status-success" />
                      ) : (
                        <ArrowUpRight size={20} className="text-status-warning" />
                      )}
                    </div>
                    <div>
                      <div className="text-text-primary font-medium capitalize">
                        {tx.type}
                      </div>
                      <div className="text-text-muted text-xs">{tx.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`font-bold ${
                        tx.type === 'deposit' ? 'text-status-success' : 'text-status-warning'
                      }`}
                    >
                      {tx.type === 'deposit' ? '+' : '-'}฿{tx.amount.toLocaleString()}
                    </div>
                    <div className="text-status-success text-xs capitalize">{tx.status}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
