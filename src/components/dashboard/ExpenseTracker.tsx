import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Filter, Search, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { formatCurrency, getMonthYear } from '../../lib/utils';
import { Transaction } from '../../types';

export default function ExpenseTracker() {
  const { state, deleteTransaction } = useApp();
  const { transactions, categories } = state;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(getMonthYear());

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || transaction.category === selectedCategory;
    const matchesMonth = getMonthYear(new Date(transaction.date)) === selectedMonth;

    return matchesSearch && matchesCategory && matchesMonth;
  });

  // Get unique categories for filter
  const uniqueCategories = Array.from(new Set(transactions.map(t => t.category)));

  // Calculate totals
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

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
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleDeleteTransaction = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 shadow-sm border border-secondary-200 dark:border-secondary-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">
            Expense Tracker
          </h2>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-success-50 dark:bg-success-900/20 rounded-xl p-4 border border-success-200 dark:border-success-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-success-100 dark:bg-success-800 rounded-full flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-success-600" />
              </div>
              <div>
                <p className="text-sm text-success-600 dark:text-success-400">Income</p>
                <p className="text-xl font-bold text-success-700 dark:text-success-300">
                  {formatCurrency(totalIncome)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-error-50 dark:bg-error-900/20 rounded-xl p-4 border border-error-200 dark:border-error-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-error-100 dark:bg-error-800 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-error-600" />
              </div>
              <div>
                <p className="text-sm text-error-600 dark:text-error-400">Expenses</p>
                <p className="text-xl font-bold text-error-700 dark:text-error-300">
                  {formatCurrency(totalExpenses)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-4 border border-primary-200 dark:border-primary-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-primary-600 dark:text-primary-400">Balance</p>
                <p className={`text-xl font-bold ${balance >= 0 ? 'text-success-700 dark:text-success-300' : 'text-error-700 dark:text-error-300'
                  }`}>
                  {formatCurrency(balance)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-secondary-200 dark:border-secondary-700 rounded-xl focus:border-primary-500 focus:outline-none bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border-2 border-secondary-200 dark:border-secondary-700 rounded-xl focus:border-primary-500 focus:outline-none bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
          >
            <option value="">All Categories</option>
            {uniqueCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-3 border-2 border-secondary-200 dark:border-secondary-700 rounded-xl focus:border-primary-500 focus:outline-none bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
          >
            <option value={getMonthYear()}>This Month</option>
            <option value={getMonthYear(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))}>Last Month</option>
            <option value={getMonthYear(new Date(Date.now() - 60 * 24 * 60 * 60 * 1000))}>2 Months Ago</option>
          </select>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 shadow-sm border border-secondary-200 dark:border-secondary-700">
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
          Transactions ({filteredTransactions.length})
        </h3>

        {filteredTransactions.length > 0 ? (
          <div className="space-y-3">
            {filteredTransactions.map((transaction, index) => {
              const categoryInfo = getCategoryInfo(transaction.category);
              const isIncome = transaction.type === 'income';

              return (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 bg-secondary-50 dark:bg-secondary-700/50 rounded-xl hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
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
                        {transaction.paymentMethod && (
                          <>
                            <span>•</span>
                            <span>{transaction.paymentMethod}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className={`font-semibold ${isIncome
                          ? 'text-success-600 dark:text-success-400'
                          : 'text-error-600 dark:text-error-400'
                        }`}>
                        {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-xs text-secondary-500 dark:text-secondary-400">
                        {isIncome ? 'Income' : 'Expense'}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteTransaction(transaction.id)}
                      className="p-2 hover:bg-error-100 dark:hover:bg-error-900/20 rounded-lg transition-colors text-error-500 hover:text-error-600"
                      title="Delete transaction"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-secondary-100 dark:bg-secondary-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-secondary-400" />
            </div>
            <h4 className="text-lg font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              No transactions found
            </h4>
            <p className="text-secondary-500 dark:text-secondary-400 text-sm">
              Try adjusting your filters or add some transactions
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


