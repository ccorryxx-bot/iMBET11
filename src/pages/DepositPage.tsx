import { useState } from 'react';
import { motion } from 'framer-motion';
import { Landmark, Wallet, Bitcoin, CreditCard, CheckCircle } from 'lucide-react';

const paymentMethods = [
  { id: 'bank', name: 'Bank Transfer', icon: Landmark, color: 'from-blue-500 to-blue-700' },
  { id: 'wallet', name: 'E-Wallet', icon: Wallet, color: 'from-purple-500 to-purple-700' },
  { id: 'crypto', name: 'Crypto', icon: Bitcoin, color: 'from-orange-500 to-orange-700' },
  { id: 'card', name: 'Credit Card', icon: CreditCard, color: 'from-emerald-500 to-emerald-700' },
];

const amountPresets = [100, 500, 1000, 2000, 5000, 10000];

export default function DepositPage() {
  const [selectedMethod, setSelectedMethod] = useState('bank');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');

  return (
    <div className="min-h-screen pb-20 relative overflow-hidden">
      {/* Background floating text */}
      <motion.div
        className="absolute top-20 -right-10 text-[8rem] font-bold text-text-primary opacity-[0.02] pointer-events-none select-none rotate-12"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      >
        DEPOSIT
      </motion.div >

      {/* Header */}
      <header className="pt-8 pb-6 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-text-primary">Deposit</h1>
          <p className="text-text-muted text-sm mt-1">Add funds to your account</p>
        </motion.div>
      </header>

      {/* Current Balance */}
      <div className="px-4 pb-6">
        <motion.div
          className="p-4 rounded-xl bg-surface"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="text-text-muted text-xs mb-1">Current Balance</div>
          <motion.div
            className="text-3xl font-bold text-accent-gold"
            animate={{
              textShadow: [
                '0 0 0px rgba(212, 165, 52, 0)',
                '0 0 20px rgba(212, 165, 52, 0.5)',
                '0 0 0px rgba(212, 165, 52, 0)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            ฿12,580
          </motion.div>
        </motion.div>
      </div>

      {/* Payment Methods */}
      <div className="px-4 pb-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-text-primary font-medium mb-3">Select Payment Method</h2>
          <div className="grid grid-cols-2 gap-3">
            {paymentMethods.map((method, index) => (
              <motion.button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`relative p-4 rounded-xl transition-all duration-200 ${
                  selectedMethod === method.id
                    ? 'bg-surface ring-2 ring-accent-gold'
                    : 'bg-surface/50 hover:bg-surface'
                }`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                whileTap={{ scale: 0.98 }}
              >
                {selectedMethod === method.id && (
                  <motion.div
                    className="absolute top-2 right-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <CheckCircle size={16} className="text-accent-gold" />
                  </motion.div>
                )}
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center mb-3`}
                >
                  <method.icon size={24} className="text-white" />
                </div>
                <div className="text-text-primary text-sm font-medium text-left">{method.name}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Amount Presets */}
      <div className="px-4 pb-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-text-primary font-medium mb-3">Select Amount</h2>
          <div className="grid grid-cols-3 gap-3">
            {amountPresets.map((amount, index) => (
              <motion.button
                key={amount}
                onClick={() => {
                  setSelectedAmount(amount);
                  setCustomAmount('');
                }}
                className={`p-4 rounded-xl text-center transition-all duration-200 ${
                  selectedAmount === amount && customAmount === ''
                    ? 'bg-accent-gold text-text-dark font-bold'
                    : 'bg-surface text-text-primary hover:bg-surface-hover'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 + index * 0.03 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-lg">฿{amount.toLocaleString()}</span>
              </motion.button>
            ))}
          </div>

          {/* Custom Amount */}
          <motion.div
            className="mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <label className="text-text-muted text-xs mb-2 block">Or enter custom amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted font-bold">
                ฿
              </span>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(null);
                }}
                placeholder="Enter amount"
                className="w-full pl-8 pr-4 py-3 rounded-xl bg-surface text-text-primary placeholder-text-muted outline-none focus:ring-2 focus:ring-accent-gold transition-all"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Deposit Button */}
      <div className="px-4">
        <motion.button
          className="w-full py-4 rounded-xl bg-gradient-to-r from-accent-gold to-accent-goldLight text-text-dark font-bold text-lg shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            boxShadow: '0 0 30px rgba(212, 165, 52, 0.4)',
          }}
        >
          Deposit {(selectedAmount || customAmount) ? `฿${(selectedAmount || customAmount).toLocaleString()}` : ''}
        </motion.button>

        <motion.p
          className="text-text-muted text-xs text-center mt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Instant deposit • Secure transactions
        </motion.p>
      </div>
    </div>
  );
}
