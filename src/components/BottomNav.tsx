import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { Home, Users, PlusCircle, Gift, User } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Home', Icon: Home },
  { path: '/agent', label: 'Agent', Icon: Users },
  { path: '/deposit', label: 'Deposit', Icon: PlusCircle },
  { path: '/promotion', label: 'Promo', Icon: Gift },
  { path: '/profile', label: 'Profile', Icon: User },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-text-dark/80 backdrop-blur-md" />
      <div className="relative flex justify-around items-center h-16 px-2 max-w-lg mx-auto">
        {navItems.map(({ path, label, Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `relative flex flex-col items-center justify-center py-2 px-3 transition-colors duration-200 ${
                isActive ? 'text-accent-gold' : 'text-text-secondary hover:text-text-primary'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="navIndicator"
                    className="absolute -top-1 w-12 h-1 bg-accent-gold rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-2xs mt-1 font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
