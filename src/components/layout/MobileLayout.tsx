import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  CreditCard,
  BarChart3,
  Brain,
  Settings,
  Plus,
  X,
  QrCode,
  Receipt
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useToast } from '../../hooks/useToast';
import QuickExpenseForm from '../forms/QuickExpenseForm';

interface MobileLayoutProps {
  children: React.ReactNode;
}

const navigationItems = [
  { path: '/dashboard', icon: Home, label: 'Dashboard' },
  { path: '/dashboard/payment', icon: CreditCard, label: 'Payment' },
  { path: '/dashboard/expenses', icon: BarChart3, label: 'Expenses' },
  { path: '/dashboard/ai', icon: Brain, label: 'AI Planner' },
  { path: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

export default function MobileLayout({ children }: MobileLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { showSuccess } = useToast();
  const [showQuickExpense, setShowQuickExpense] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    const currentPath = location.pathname;
    const tab = navigationItems.find(item => currentPath.startsWith(item.path));
    return tab ? tab.path : '/dashboard';
  });

  const handleTabChange = (path: string) => {
    setActiveTab(path);
    navigate(path);
  };

  const handleQuickExpense = () => {
    setShowQuickExpense(true);
  };

  const closeQuickExpense = () => {
    setShowQuickExpense(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/20 backdrop-blur-xl border-b border-white/30 shadow-lg">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800">
              Budget Buddy AI
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleQuickExpense}
        className="fixed bottom-24 right-4 w-14 h-14 bg-white/20 backdrop-blur-xl text-gray-800 rounded-full shadow-lg border border-white/30 flex items-center justify-center z-50 hover:bg-white/30 transition-all"
      >
        <Plus className="w-6 h-6" />
      </motion.button>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/20 backdrop-blur-xl border-t border-white/30 z-40 shadow-lg">
        <div className="flex justify-around items-center py-2">
          <button
            onClick={() => navigate('/dashboard')}
            className={`flex flex-col items-center p-3 rounded-xl transition-all ${location.pathname === '/dashboard' || location.pathname === '/dashboard/'
                ? 'text-purple-600 bg-white/40 shadow-lg'
                : 'text-gray-700 hover:text-purple-600 hover:bg-white/20'
              }`}
          >
            <BarChart3 className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Dashboard</span>
          </button>

          <button
            onClick={() => navigate('/dashboard/expenses')}
            className={`flex flex-col items-center p-3 rounded-xl transition-all ${location.pathname === '/dashboard/expenses'
                ? 'text-purple-600 bg-white/40 shadow-lg'
                : 'text-gray-700 hover:text-purple-600 hover:bg-white/20'
              }`}
          >
            <Receipt className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Expenses</span>
          </button>

          <button
            onClick={() => navigate('/')}
            className={`flex flex-col items-center p-3 rounded-xl transition-all ${location.pathname === '/'
                ? 'text-purple-600 bg-white/40 shadow-lg'
                : 'text-gray-700 hover:text-purple-600 hover:bg-white/20'
              }`}
          >
            <QrCode className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Mediator</span>
          </button>

          <button
            onClick={() => navigate('/dashboard/ai')}
            className={`flex flex-col items-center p-3 rounded-xl transition-all ${location.pathname === '/dashboard/ai'
                ? 'text-purple-600 bg-white/40 shadow-lg'
                : 'text-gray-700 hover:text-purple-600 hover:bg-white/20'
              }`}
          >
            <Brain className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">AI</span>
          </button>

          <button
            onClick={() => navigate('/dashboard/settings')}
            className={`flex flex-col items-center p-3 rounded-xl transition-all ${location.pathname === '/dashboard/settings'
                ? 'text-purple-600 bg-white/40 shadow-lg'
                : 'text-gray-700 hover:text-purple-600 hover:bg-white/20'
              }`}
          >
            <Settings className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Settings</span>
          </button>
        </div>
      </nav>

      {/* Quick Expense Modal */}
      <AnimatePresence>
        {showQuickExpense && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-end"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white/20 backdrop-blur-xl rounded-t-3xl w-full max-h-[90vh] overflow-hidden border border-white/30 shadow-2xl"
            >
              <div className="flex items-center justify-between p-4 border-b border-white/30">
                <h3 className="text-lg font-semibold text-gray-800">
                  Quick Expense
                </h3>
                <button
                  onClick={closeQuickExpense}
                  className="p-2 hover:bg-white/30 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="p-4">
                <QuickExpenseForm onClose={closeQuickExpense} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


