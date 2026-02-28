import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet, Target, PieChart, BarChart3 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { formatCurrency, calculatePercentage } from '../lib/utils';
import BudgetOverview from '../components/dashboard/BudgetOverview';
import ExpenseChart from '../components/dashboard/ExpenseChart';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import AIBudgetPlanner from '../components/dashboard/AIBudgetPlanner';
import ExpenseTracker from '../components/dashboard/ExpenseTracker';
import Settings from '../components/dashboard/Settings';

export default function DashboardPage() {
  const { state } = useApp();
  const { summary, currentMonth } = state;

  const DashboardHome = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-secondary-800 rounded-2xl p-4 shadow-sm border border-secondary-200 dark:border-secondary-700"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-success-100 dark:bg-success-900/20 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-success-600" />
            </div>
            <span className="text-xs text-success-600 bg-success-100 dark:bg-success-900/20 px-2 py-1 rounded-full">
              +{summary.savingsRate}%
            </span>
          </div>
          <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-1">
            Monthly Income
          </p>
          <p className="text-xl font-bold text-secondary-900 dark:text-white">
            {formatCurrency(summary.monthlyIncome)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-secondary-800 rounded-2xl p-4 shadow-sm border border-secondary-200 dark:border-secondary-700"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-error-100 dark:bg-error-900/20 rounded-full flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-error-600" />
            </div>
            <span className="text-xs text-error-600 bg-error-100 dark:bg-error-900/20 px-2 py-1 rounded-full">
              -{summary.monthlyExpenses > 0 ? calculatePercentage(summary.monthlyExpenses, summary.monthlyIncome) : 0}%
            </span>
          </div>
          <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-1">
            Monthly Expenses
          </p>
          <p className="text-xl font-bold text-secondary-900 dark:text-white">
            {formatCurrency(summary.monthlyExpenses)}
          </p>
        </motion.div>
      </div>

      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-primary-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Wallet className="w-6 h-6" />
          </div>
          <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
            {currentMonth}
          </span>
        </div>
        <p className="text-sm opacity-90 mb-1">Monthly Balance</p>
        <p className="text-3xl font-bold">
          {formatCurrency(summary.monthlyBalance)}
        </p>
        <div className="mt-4 flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success-400 rounded-full"></div>
            <span className="text-sm">Income</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-error-400 rounded-full"></div>
            <span className="text-sm">Expenses</span>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-2 gap-4"
      >
        <div className="bg-white dark:bg-secondary-800 rounded-2xl p-4 shadow-sm border border-secondary-200 dark:border-secondary-700">
          <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mb-3">
            <Target className="w-6 h-6 text-primary-600" />
          </div>
          <h3 className="font-semibold text-secondary-900 dark:text-white mb-1">
            Budget Overview
          </h3>
          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            Track your spending
          </p>
        </div>

        <div className="bg-white dark:bg-secondary-800 rounded-2xl p-4 shadow-sm border border-secondary-200 dark:border-secondary-700">
          <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900/20 rounded-full flex items-center justify-center mb-3">
            <PieChart className="w-6 h-6 text-accent-600" />
          </div>
          <h3 className="font-semibold text-secondary-900 dark:text-white mb-1">
            AI Planner
          </h3>
          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            Smart budgeting
          </p>
        </div>
      </motion.div>

      {/* Charts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
            Spending Overview
          </h2>
          <div className="flex items-center space-x-2 text-sm text-secondary-500 dark:text-secondary-400">
            <BarChart3 className="w-4 h-4" />
            <span>This Month</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <BudgetOverview />
          <ExpenseChart />
        </div>
      </motion.div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <RecentTransactions />
      </motion.div>
    </div>
  );

  return (
    <Routes>
      <Route path="/" element={<DashboardHome />} />
      <Route path="/payment" element={<div>Payment Page</div>} />
      <Route path="/expenses" element={<ExpenseTracker />} />
      <Route path="/ai" element={<AIBudgetPlanner />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}


