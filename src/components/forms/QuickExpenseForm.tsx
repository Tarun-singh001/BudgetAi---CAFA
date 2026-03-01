import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useToast } from '../../hooks/useToast';
import { Transaction } from '../../types';

interface QuickExpenseFormProps {
  onClose: () => void;
}

interface QuickExpenseData {
  amount: string;
  category: string;
  description: string;
}

export default function QuickExpenseForm({ onClose }: QuickExpenseFormProps) {
  const { addTransaction, state } = useApp();
  const { showSuccess } = useToast();
  const [showSubCategory, setShowSubCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<QuickExpenseData>();

  const selectedCategoryData = state.categories.find(c => c.name === watch('category'));

  const handleExpenseSubmit = (data: QuickExpenseData) => {
    const transaction: Omit<Transaction, 'id'> = {
      type: 'expense',
      amount: parseFloat(data.amount),
      category: data.category,
      description: data.description || 'Quick expense',
      date: new Date().toISOString(),
    };

    addTransaction(transaction);
    showSuccess('Expense Added', `₹${data.amount} added to ${data.category}`);

    reset();
    onClose();
  };

  const expenseCategories = state.categories.filter(c => c.type === 'expense');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="space-y-6"
    >
      <form onSubmit={handleSubmit(handleExpenseSubmit)} className="space-y-4">
        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
            Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-500">
              ₹
            </span>
            <input
              type="number"
              {...register('amount', {
                required: 'Amount is required',
                min: { value: 1, message: 'Amount must be at least ₹1' }
              })}
              className="w-full pl-10 pr-4 py-3 border-2 border-secondary-200 dark:border-secondary-700 rounded-xl focus:border-primary-500 focus:outline-none bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
              placeholder="0.00"
              step="0.01"
            />
          </div>
          {errors.amount && (
            <p className="mt-1 text-sm text-error-600">{errors.amount.message}</p>
          )}
        </div>

        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
            Category
          </label>
          <div className="grid grid-cols-3 gap-2">
            {expenseCategories.slice(0, 6).map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(category.name);
                  setShowSubCategory(!!(category.subCategories && category.subCategories.length > 0));
                }}
                className={`p-3 rounded-xl border-2 transition-all duration-200 text-center ${selectedCategory === category.name
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-secondary-200 dark:border-secondary-700 hover:border-primary-300'
                  }`}
              >
                <div className="text-2xl mb-1">{category.icon}</div>
                <div className="text-xs font-medium text-secondary-900 dark:text-white">
                  {category.name}
                </div>
              </button>
            ))}
          </div>
          {errors.category && (
            <p className="mt-1 text-sm text-error-600">Please select a category</p>
          )}
        </div>

        {/* Sub-category Selection */}
        {showSubCategory && selectedCategoryData?.subCategories && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
              Sub-category
            </label>
            <div className="grid grid-cols-2 gap-2">
              {selectedCategoryData.subCategories.map((subCat) => (
                <button
                  key={subCat}
                  type="button"
                  className="p-2 text-sm border border-secondary-200 dark:border-secondary-700 rounded-lg hover:border-primary-300 transition-colors text-secondary-700 dark:text-secondary-300"
                >
                  {subCat}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
            Description (Optional)
          </label>
          <input
            type="text"
            {...register('description')}
            className="w-full px-4 py-3 border-2 border-secondary-200 dark:border-secondary-700 rounded-xl focus:border-primary-500 focus:outline-none bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
            placeholder="What was this expense for?"
          />
        </div>

        {/* Hidden category input for form validation */}
        <input
          type="hidden"
          {...register('category', { required: 'Category is required' })}
          value={selectedCategory}
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!selectedCategory}
          className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-secondary-300 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Expense</span>
        </button>
      </form>

      {/* Quick Amount Buttons */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
          Quick Amounts
        </p>
        <div className="grid grid-cols-3 gap-2">
          {[100, 200, 500, 1000, 2000, 5000].map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => {
                const amountInput = document.querySelector('input[name="amount"]') as HTMLInputElement;
                if (amountInput) {
                  amountInput.value = amount.toString();
                }
              }}
              className="p-3 text-sm border border-secondary-200 dark:border-secondary-700 rounded-lg hover:border-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors text-secondary-700 dark:text-secondary-300"
            >
              ₹{amount}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}


