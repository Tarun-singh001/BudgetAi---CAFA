import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, PieChart, TrendingUp } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { formatCurrency } from '../../lib/utils';

export default function ExpenseChart() {
  const { state } = useApp();
  const { transactions, categories } = state;

  // Get current month expenses by category
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyExpenses = transactions.filter(t => {
    const date = new Date(t.date);
    return t.type === 'expense' && 
           date.getMonth() === currentMonth && 
           date.getFullYear() === currentYear;
  });

  // Group expenses by category
  const expensesByCategory = monthlyExpenses.reduce((acc, transaction) => {
    const category = transaction.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += transaction.amount;
    return acc;
  }, {} as Record<string, number>);

  // Get top 5 expense categories
  const topExpenses = Object.entries(expensesByCategory)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  // Calculate total monthly expenses
  const totalMonthlyExpenses = monthlyExpenses.reduce((sum, t) => sum + t.amount, 0);

  // Get category colors and icons
  const getCategoryInfo = (categoryName: string) => {
    const category = categories.find(c => c.name === categoryName);
    return {
      color: category?.color || '#6b7280',
      icon: category?.icon || '💰'
    };
  };

  return (
    <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 shadow-sm border border-secondary-200 dark:border-secondary-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
          Expense Breakdown
        </h3>
        <div className="w-10 h-10 bg-accent-100 dark:bg-accent-900/20 rounded-full flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-accent-600" />
        </div>
      </div>

      {/* Total Monthly Expenses */}
      <div className="bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-primary-600 dark:text-primary-400 mb-1">
              Total This Month
            </p>
            <p className="text-2xl font-bold text-primary-700 dark:text-primary-300">
              {formatCurrency(totalMonthlyExpenses)}
            </p>
          </div>
          <div className="w-12 h-12 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-primary-600" />
          </div>
        </div>
      </div>

      {/* Expense Categories Chart */}
      <div>
        <h4 className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-4">
          Top Categories
        </h4>
        
        {topExpenses.length > 0 ? (
          <div className="space-y-4">
            {topExpenses.map(([category, amount], index) => {
              const percentage = totalMonthlyExpenses > 0 ? (amount / totalMonthlyExpenses) * 100 : 0;
              const categoryInfo = getCategoryInfo(category);
              
              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{categoryInfo.icon}</span>
                      <span className="text-sm font-medium text-secondary-900 dark:text-white">
                        {category}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-secondary-900 dark:text-white">
                        {formatCurrency(amount)}
                      </p>
                      <p className="text-xs text-secondary-500 dark:text-secondary-400">
                        {percentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  
                  <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="h-2 rounded-full"
                      style={{ backgroundColor: categoryInfo.color }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-secondary-100 dark:bg-secondary-700 rounded-full flex items-center justify-center mx-auto mb-3">
              <PieChart className="w-8 h-8 text-secondary-400" />
            </div>
            <p className="text-secondary-500 dark:text-secondary-400 text-sm">
              No expenses this month yet
            </p>
            <p className="text-secondary-400 dark:text-secondary-500 text-xs mt-1">
              Start tracking your spending!
            </p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      {topExpenses.length > 0 && (
        <div className="mt-6 pt-6 border-t border-secondary-200 dark:border-secondary-700">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {topExpenses.length}
              </p>
              <p className="text-xs text-secondary-500 dark:text-secondary-400">
                Categories
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-accent-600 dark:text-accent-400">
                {formatCurrency(topExpenses[0]?.[1] || 0)}
              </p>
              <p className="text-xs text-secondary-500 dark:text-secondary-400">
                Highest
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


