import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../hooks/useToast';
import {
  QrCode,
  CreditCard,
  User,
  Building2,
  Smartphone,
  Calculator,
  TrendingUp,
  ArrowRight,
  Wallet,
  AlertCircle
} from 'lucide-react';

interface PaymentIntent {
  type: 'qr' | 'upi' | 'account' | 'upiNumber';
  details: string;
  amount: number;
  budgetCategory: string;
  paymentApp: string;
  recipientName?: string;
  recipientType: 'individual' | 'business';
}

export default function PaymentPage() {
  const { state, addTransaction } = useApp();
  const { showSuccess, showError } = useToast();
  const [paymentStep, setPaymentStep] = useState<'intent' | 'analysis' | 'redirect'>('intent');
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null);
  const [budgetImpact, setBudgetImpact] = useState<{
    category: string;
    currentSpent: number;
    budget: number;
    remaining: number;
    percentageUsed: number;
    willExceed: boolean;
  } | null>(null);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<PaymentIntent>();
  const watchedAmount = watch('amount');
  const watchedCategory = watch('budgetCategory');

  // Add null checks and default values
  const safeCategories = state.categories || [];
  const safeBudgets = state.budgets || [];

  const paymentApps = [
    { id: 'gpay', name: 'Google Pay', icon: '🟢', color: 'bg-green-500' },
    { id: 'phonepe', name: 'PhonePe', icon: '🟣', color: 'bg-purple-500' },
    { id: 'paytm', name: 'Paytm', icon: '🔵', color: 'bg-blue-500' },
    { id: 'bhim', name: 'BHIM', icon: '🟠', color: 'bg-orange-500' },
    { id: 'amazonpay', name: 'Amazon Pay', icon: '🟡', color: 'bg-yellow-500' },
    { id: 'cred', name: 'CRED', icon: '🔴', color: 'bg-red-500' }
  ];

  const recipientTypes = [
    { id: 'individual', name: 'Individual', icon: User },
    { id: 'business', name: 'Business', icon: Building2 }
  ];

  const paymentTypes = [
    { id: 'qr', name: 'QR Code', icon: QrCode, description: 'Scan QR code' },
    { id: 'upi', name: 'UPI ID', icon: Smartphone, description: 'Enter UPI ID' },
    { id: 'account', name: 'Account Details', icon: CreditCard, description: 'Bank account details' },
    { id: 'upiNumber', name: 'UPI Number', icon: Smartphone, description: 'UPI number' }
  ];

  const handlePaymentIntent = (data: PaymentIntent) => {
    // Calculate budget impact
    const category = safeCategories.find((c: any) => c.id === data.budgetCategory);

    if (category) {
      // AI Budget planner sets 'category' directly as the name, not 'categoryId'
      const budget = safeBudgets.find((b: any) => b.category === category.name);

      if (budget) {
        const currentSpent = budget.spent || 0;
        const remaining = budget.amount - currentSpent;
        const percentageUsed = ((currentSpent + data.amount) / budget.amount) * 100;
        const willExceed = (currentSpent + data.amount) > budget.amount;

        setBudgetImpact({
          category: category.name,
          currentSpent,
          budget: budget.amount,
          remaining,
          percentageUsed,
          willExceed
        });
      } else {
        // Fallback if no specific budget found for this category
        setBudgetImpact({
          category: category.name,
          currentSpent: 0,
          budget: 0,
          remaining: 0,
          percentageUsed: 0,
          willExceed: false
        });
      }

      setPaymentIntent(data);
      setPaymentStep('analysis');
    }
  };

  const handleProceedToPayment = () => {
    if (paymentIntent && budgetImpact) {
      // Add transaction to track the payment intent
      addTransaction({
        type: 'expense',
        amount: paymentIntent.amount,
        category: paymentIntent.budgetCategory,
        description: `Payment to ${paymentIntent.recipientName || 'Recipient'} via ${paymentIntent.paymentApp}`,
        date: new Date().toISOString(),
        paymentMethod: paymentIntent.paymentApp,
        recipient: paymentIntent.recipientName || 'Recipient',
        subCategory: 'payment-intent'
      });

      showSuccess('Payment Intent Captured!', 'Redirecting to payment app...');
      setPaymentStep('redirect');

      // Simulate redirect to payment app
      setTimeout(() => {
        showSuccess('Redirecting...', `Opening ${paymentIntent.paymentApp} to complete payment`);
      }, 1000);
    }
  };

  const handleBackToIntent = () => {
    setPaymentStep('intent');
    setBudgetImpact(null);
    setPaymentIntent(null);
  };

  if (paymentStep === 'analysis' && budgetImpact) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Budget Impact
            </h1>
            <p className="text-gray-600 text-sm">
              Review your payment before proceeding
            </p>
          </div>

          {/* Payment Summary */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white/20 backdrop-blur-xl rounded-xl p-4 shadow-lg border border-white/30 mb-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-gray-800">
                Payment Summary
              </h3>
              <div className="text-xl font-bold text-purple-600">
                ₹{paymentIntent?.amount}
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Category:</span>
                <span className="font-medium text-gray-800">{budgetImpact.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment App:</span>
                <span className="font-medium text-gray-800">{paymentIntent?.paymentApp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Recipient:</span>
                <span className="font-medium text-gray-800">{paymentIntent?.recipientName || 'Recipient'}</span>
              </div>
            </div>
          </motion.div>

          {/* Budget Impact */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white/20 backdrop-blur-xl rounded-xl p-4 shadow-lg border border-white/30 mb-4"
          >
            <h3 className="text-base font-semibold text-gray-800 mb-3">
              Budget Analysis
            </h3>

            <div className="space-y-3">
              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Budget Usage</span>
                  <span className="font-medium text-gray-800">{budgetImpact.percentageUsed.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-white/30 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(budgetImpact.percentageUsed, 100)}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`h-2 rounded-full ${budgetImpact.willExceed ? 'bg-red-500' : 'bg-purple-500'
                      }`}
                  />
                </div>
              </div>

              {/* Budget Stats */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="text-center p-2 bg-white/20 rounded-lg border border-white/30">
                  <div className="text-base font-bold text-gray-800">
                    ₹{budgetImpact.currentSpent}
                  </div>
                  <div className="text-gray-600 text-xs">Already Spent</div>
                </div>
                <div className="text-center p-2 bg-white/20 rounded-lg border border-white/30">
                  <div className="text-base font-bold text-gray-800">
                    ₹{budgetImpact.remaining}
                  </div>
                  <div className="text-gray-600 text-xs">Remaining</div>
                </div>
              </div>

              {/* Warning if exceeding budget */}
              {budgetImpact.willExceed && (
                <div className="flex items-center gap-2 p-2 bg-red-50/50 border border-red-200/50 rounded-lg backdrop-blur-sm">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <div className="text-xs text-red-700">
                    This payment will exceed your {budgetImpact.category} budget by ₹{Math.abs(budgetImpact.remaining - paymentIntent!.amount)}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleBackToIntent}
              className="flex-1 px-4 py-2 bg-white/20 backdrop-blur-sm text-gray-700 rounded-lg font-medium hover:bg-white/30 transition-colors text-sm border border-white/30"
            >
              Back
            </button>
            <button
              onClick={handleProceedToPayment}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 text-sm shadow-lg"
            >
              Proceed to Payment
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (paymentStep === 'redirect') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="bg-white/20 backdrop-blur-xl rounded-xl p-6 shadow-lg border border-white/30">
            <div className="w-12 h-12 bg-purple-100/50 rounded-full flex items-center justify-center mx-auto mb-3 border border-purple-200/50">
              <ArrowRight className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">
              Redirecting to {paymentIntent?.paymentApp}
            </h2>
            <p className="text-gray-600 mb-4 text-sm">
              You will be redirected to complete your payment
            </p>
            <button
              onClick={() => setPaymentStep('intent')}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors text-sm shadow-lg"
            >
              Back to App
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Payment Mediator
          </h1>
          <p className="text-gray-600 text-sm">
            Smart payment routing with budget analysis
          </p>
        </div>

        <form onSubmit={handleSubmit(handlePaymentIntent)} className="space-y-4">
          {/* Payment Type Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/20 backdrop-blur-xl rounded-xl p-4 shadow-lg border border-white/30"
          >
            <h3 className="text-base font-semibold text-gray-800 mb-3">
              Payment Method
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {paymentTypes.map((type) => (
                <label
                  key={type.id}
                  className={`relative cursor-pointer rounded-lg p-3 border transition-all hover:border-purple-300 ${watch('type') === type.id
                      ? 'border-purple-500 bg-white/40 shadow-lg'
                      : 'border-white/30 hover:border-purple-300 bg-white/10'
                    }`}
                >
                  <input
                    type="radio"
                    value={type.id}
                    {...register('type', { required: 'Please select a payment type' })}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <type.icon className="w-6 h-6 mx-auto mb-1 text-purple-600" />
                    <div className="text-sm font-medium text-gray-800">
                      {type.name}
                    </div>
                  </div>
                </label>
              ))}
            </div>
            {errors.type && (
              <p className="text-red-500 text-sm mt-2">{errors.type.message}</p>
            )}
          </motion.div>

          {/* Payment Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/20 backdrop-blur-xl rounded-xl p-4 shadow-lg border border-white/30"
          >
            <h3 className="text-base font-semibold text-gray-800 mb-3">
              Payment Details
            </h3>

            <div className="space-y-3">
              {/* Recipient Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {recipientTypes.map((type) => (
                    <label
                      key={type.id}
                      className={`relative cursor-pointer rounded-lg p-2 border transition-all hover:border-purple-300 ${watch('recipientType') === type.id
                          ? 'border-purple-500 bg-white/40 shadow-lg'
                          : 'border-white/30 hover:border-purple-300 bg-white/10'
                        }`}
                    >
                      <input
                        type="radio"
                        value={type.id}
                        {...register('recipientType', { required: 'Please select recipient type' })}
                        className="sr-only"
                      />
                      <div className="flex items-center gap-2">
                        <type.icon className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-gray-800">{type.name}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Recipient Details */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient Details
                </label>
                <input
                  type="text"
                  placeholder={watch('type') === 'qr' ? 'QR Code Data' :
                    watch('type') === 'upi' ? 'UPI ID (e.g., name@bank)' :
                      watch('type') === 'account' ? 'Account Number' : 'UPI Number'}
                  {...register('details', { required: 'Please enter recipient details' })}
                  className="w-full px-3 py-2 border border-white/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/20 backdrop-blur-sm text-gray-800 text-sm placeholder-gray-500"
                />
                {errors.details && (
                  <p className="text-red-500 text-sm mt-1">{errors.details.message}</p>
                )}
              </div>

              {/* Recipient Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Enter recipient name"
                  {...register('recipientName')}
                  className="w-full px-3 py-2 border border-white/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/20 backdrop-blur-sm text-gray-800 text-sm placeholder-gray-500"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    ₹
                  </span>
                  <input
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    min="0.01"
                    {...register('amount', {
                      required: 'Please enter amount',
                      min: { value: 0.01, message: 'Amount must be greater than 0' }
                    })}
                    className="w-full pl-8 pr-3 py-2 border border-white/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/20 backdrop-blur-sm text-gray-800 text-sm placeholder-gray-500"
                  />
                </div>
                {errors.amount && (
                  <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Budget Category */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/20 backdrop-blur-xl rounded-xl p-4 shadow-lg border border-white/30"
          >
            <h3 className="text-base font-semibold text-gray-800 mb-3">
              Budget Category
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {safeCategories.map((category: any) => (
                <label
                  key={category.id}
                  className={`relative cursor-pointer rounded-lg p-2 border transition-all hover:border-purple-300 ${watch('budgetCategory') === category.id
                      ? 'border-purple-500 bg-white/40 shadow-lg'
                      : 'border-white/30 hover:border-purple-300 bg-white/10'
                    }`}
                >
                  <input
                    type="radio"
                    value={category.id}
                    {...register('budgetCategory', { required: 'Please select a budget category' })}
                    className="sr-only"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{category.icon}</span>
                    <span className="text-sm font-medium text-gray-800">{category.name}</span>
                  </div>
                </label>
              ))}
            </div>
            {errors.budgetCategory && (
              <p className="text-red-500 text-sm mt-2">{errors.budgetCategory.message}</p>
            )}
          </motion.div>

          {/* Payment App Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/20 backdrop-blur-xl rounded-xl p-4 shadow-lg border border-white/30"
          >
            <h3 className="text-base font-semibold text-gray-800 mb-3">
              Payment App
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {paymentApps.map((app) => (
                <label
                  key={app.id}
                  className={`relative cursor-pointer rounded-lg p-2 border transition-all hover:border-purple-300 ${watch('paymentApp') === app.id
                      ? 'border-purple-500 bg-white/40 shadow-lg'
                      : 'border-white/30 hover:border-purple-300 bg-white/10'
                    }`}
                >
                  <input
                    type="radio"
                    value={app.id}
                    {...register('paymentApp', { required: 'Please select a payment app' })}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div className="text-xl mb-1">{app.icon}</div>
                    <div className="text-xs font-medium text-gray-800">{app.name}</div>
                  </div>
                </label>
              ))}
            </div>
            {errors.paymentApp && (
              <p className="text-red-500 text-sm mt-2">{errors.paymentApp.message}</p>
            )}
          </motion.div>

          {/* Submit Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            type="submit"
            className="w-full py-3 bg-purple-600 text-white rounded-xl font-semibold text-base hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 shadow-lg"
          >
            <Calculator className="w-4 h-4" />
            Analyze Budget Impact
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}


