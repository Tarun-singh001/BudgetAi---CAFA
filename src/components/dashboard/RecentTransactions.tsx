import React from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowUpRight, ArrowDownLeft, Trash2 } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { formatCurrency, getMonthYear } from '../../lib/utils';

export default function RecentTransactions() {
  const { state, deleteTransaction } = useApp();
  const { transactions, categories } = state;

  // Get recent transactions (last 10)
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  // Get category info
  const getCategoryInfo = (categoryName: string) => {
    const category = categories.find(c => c.name === categoryName);
    return {
      color: category?.color || '#6b7280',
      icon: category?.icon || '💰'
    };
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'short' 
      });
    }
  };

  const handleDeleteTransaction = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id);
    }
  };

  return (
    <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 shadow-sm border border-secondary-200 dark:border-secondary-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
          Recent Transactions
        </h3>
        <div className="w-10 h-10 bg-secondary-100 dark:bg-secondary-700 rounded-full flex items-center justify-center">
          <Clock className="w-5 h-5 text-secondary-600" />
        </div>
      </div>

      {recentTransactions.length > 0 ? (
        <div className="space-y-4">
          {recentTransactions.map((transaction, index) => {
            const categoryInfo = getCategoryInfo(transaction.category);
            const isIncome = transaction.type === 'income';
            
            return (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-secondary-50 dark:bg-secondary-700/50 rounded-xl hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                    style={{ backgroundColor: `${categoryInfo.color}20` }}
                  >
                    {categoryInfo.icon}
                  </div>
                  
                  <div>
                    <p className="font-medium text-secondary-900 dark:text-white">
                      {transaction.description || transaction.category}
                    </p>
                    <div className="flex items-center space-x-2 text-sm text-secondary-500 dark:text-secondary-400">
                      <span>{transaction.category}</span>
                      <span>•</span>
                      <span>{formatDate(transaction.date)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className={`font-semibold ${
                      isIncome 
                        ? 'text-success-600 dark:text-success-400' 
                        : 'text-error-600 dark:text-error-400'
                    }`}>
                      {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </p>
                    <div className="flex items-center space-x-1 text-xs text-secondary-500 dark:text-secondary-400">
                      {isIncome ? (
                        <ArrowDownLeft className="w-3 h-3 text-success-500" />
                      ) : (
                        <ArrowUpRight className="w-3 h-3 text-error-500" />
                      )}
                      <span>{isIncome ? 'Income' : 'Expense'}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteTransaction(transaction.id)}
                    className="p-2 hover:bg-error-100 dark:hover:bg-error-900/20 rounded-lg transition-colors text-error-500 hover:text-error-600"
                    title="Delete transaction"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-secondary-100 dark:bg-secondary-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-10 h-10 text-secondary-400" />
          </div>
          <h4 className="text-lg font-medium text-secondary-700 dark:text-secondary-300 mb-2">
            No transactions yet
          </h4>
          <p className="text-secondary-500 dark:text-secondary-400 text-sm mb-4">
            Start tracking your income and expenses to see them here
          </p>
          <div className="flex items-center justify-center space-x-2 text-xs text-secondary-400 dark:text-secondary-500">
            <span>💡</span>
            <span>Add transactions from the payment page or quick expense form</span>
          </div>
        </div>
      )}

      {/* Transaction Summary */}
      {recentTransactions.length > 0 && (
        <div className="mt-6 pt-6 border-t border-secondary-200 dark:border-secondary-700">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-success-600 dark:text-success-400">
                {formatCurrency(
                  recentTransactions
                    .filter(t => t.type === 'income')
                    .reduce((sum, t) => sum + t.amount, 0)
                )}
              </p>
              <p className="text-xs text-secondary-500 dark:text-secondary-400">
                Total Income
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-error-600 dark:text-error-400">
                {formatCurrency(
                  recentTransactions
                    .filter(t => t.type === 'expense')
                    .reduce((sum, t) => sum + t.amount, 0)
                )}
              </p>
              <p className="text-xs text-secondary-500 dark:text-secondary-400">
                Total Expenses
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary-600 dark:text-secondary-400">
                {recentTransactions.length}
              </p>
              <p className="text-xs text-secondary-500 dark:text-secondary-400">
                Transactions
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


