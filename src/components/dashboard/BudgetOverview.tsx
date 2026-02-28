import React from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, TrendingDown } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { formatCurrency, calculatePercentage } from '../../lib/utils';

export default function BudgetOverview() {
  const { state } = useApp();
  const { budgets } = state;

  // Calculate total budget and spent
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const remainingBudget = totalBudget - totalSpent;
  const spendingPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  // Get top 3 budget categories
  const topBudgets = budgets
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3);

  return (
    <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 shadow-sm border border-secondary-200 dark:border-secondary-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
          Budget Overview
        </h3>
        <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
          <Target className="w-5 h-5 text-primary-600" />
        </div>
      </div>

      {/* Overall Budget Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-secondary-600 dark:text-secondary-400">
            Monthly Budget
          </span>
          <span className="text-sm font-medium text-secondary-900 dark:text-white">
            {formatCurrency(totalBudget)}
          </span>
        </div>
        
        <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-3 mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(spendingPercentage, 100)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-3 rounded-full ${
              spendingPercentage > 80 ? 'bg-error-500' : 
              spendingPercentage > 60 ? 'bg-warning-500' : 'bg-primary-500'
            }`}
          />
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-secondary-600 dark:text-secondary-400">
            Spent: {formatCurrency(totalSpent)}
          </span>
          <span className="text-secondary-600 dark:text-secondary-400">
            {spendingPercentage.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Remaining Budget */}
      <div className="bg-gradient-to-r from-accent-50 to-accent-100 dark:from-accent-900/20 dark:to-accent-800/20 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-accent-600 dark:text-accent-400 mb-1">
              Remaining Budget
            </p>
            <p className="text-2xl font-bold text-accent-700 dark:text-accent-300">
              {formatCurrency(remainingBudget)}
            </p>
          </div>
          <div className="w-12 h-12 bg-accent-100 dark:bg-accent-800 rounded-full flex items-center justify-center">
            {remainingBudget >= 0 ? (
              <TrendingUp className="w-6 h-6 text-accent-600" />
            ) : (
              <TrendingDown className="w-6 h-6 text-error-600" />
            )}
          </div>
        </div>
      </div>

      {/* Top Budget Categories */}
      <div>
        <h4 className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-3">
          Top Categories
        </h4>
        <div className="space-y-3">
          {topBudgets.map((budget) => {
            const categoryProgress = budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0;
            const isOverBudget = budget.spent > budget.amount;
            
            return (
              <div key={budget.id} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-secondary-700 dark:text-secondary-300">
                    {budget.category}
                  </span>
                  <span className="text-secondary-900 dark:text-white font-medium">
                    {formatCurrency(budget.spent)} / {formatCurrency(budget.amount)}
                  </span>
                </div>
                
                <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(categoryProgress, 100)}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`h-2 rounded-full ${
                      isOverBudget ? 'bg-error-500' : 
                      categoryProgress > 80 ? 'bg-warning-500' : 'bg-primary-500'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


