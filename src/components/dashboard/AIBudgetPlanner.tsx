import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Send, User, Check, Target } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { formatCurrency } from '../../lib/utils';
import { AIBudgetPlan } from '../../types';

type Message = {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  type?: 'text' | 'category-selection' | 'budget-confirmed';
  categories?: string[];
  options?: string[];
};

const SUGGESTED_CATEGORIES = [
  'Food & Dining', 'Transportation', 'Shopping', 'Bills & Utilities',
  'Entertainment', 'Health & Fitness', 'Education', 'Emergency Fund', 'Savings & Investment'
];

export default function AIBudgetPlanner() {
  const { state, setAIBudgetPlan, addTransaction } = useApp();
  const { summary, categories } = state;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [stage, setStage] = useState<'greeting' | 'asking_preferences' | 'suggesting_categories' | 'confirmed'>('greeting');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    // Initial greeting
    if (messages.length === 0) {
      setIsTyping(true);
      setTimeout(() => {
        setMessages([
          {
            id: '1',
            sender: 'ai',
            text: `Hey! You've made ${formatCurrency(summary.monthlyIncome)} and spent ${formatCurrency(summary.monthlyExpenses)} so far this month. Ready to crush it? What are your budget preferences and savings goals?`
          }
        ]);
        setStage('asking_preferences');
        setIsTyping(false);
      }, 1000);
    }
  }, []);

  const handleSendMessage = () => {
    const currentInput = inputValue.trim();
    if (!currentInput) return;

    const newUserMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: currentInput
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setIsTyping(true);

    if (stage === 'asking_preferences') {
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: 'ai',
            text: "Got it! To build your perfect budget, which of these categories do you want to include? Select as many or as few as you need.",
            type: 'category-selection',
            options: SUGGESTED_CATEGORIES
          }
        ]);
        setStage('suggesting_categories');
        setIsTyping(false);
      }, 1500);
    } else {
      setTimeout(() => {
        // AI Parsing Logic
        const expenseRegex = /(?:rs\.?|₹|inr|\$|spent)?\s*(\d+(?:\.\d+)?)\s*(?:for|on)?\s+(.+)/i;
        const match = currentInput.match(expenseRegex);

        if (match) {
          const amount = parseFloat(match[1]);
          const description = match[2].trim();

          let matchedCategory = 'Shopping'; // Default
          const descLower = description.toLowerCase();

          if (categories) {
            for (const cat of categories) {
              if (cat.type === 'expense') {
                if (descLower.includes(cat.name.toLowerCase())) {
                  matchedCategory = cat.name;
                  break;
                }
                if (cat.subCategories && cat.subCategories.some(sub => descLower.includes(sub.toLowerCase()))) {
                  matchedCategory = cat.name;
                  break;
                }
              }
            }
          }

          // Heuristic for EQ and Sentiment based on category
          let eqScore = 50;
          let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
          const highEqCategories = ['Entertainment', 'Shopping', 'Food & Dining'];
          const lowEqCategories = ['Bills & Utilities', 'Emergency Fund', 'Education'];

          if (highEqCategories.includes(matchedCategory)) {
            eqScore = 80; // Typically impulsive or high gratification
            sentiment = 'positive';
          } else if (lowEqCategories.includes(matchedCategory)) {
            eqScore = 20; // Essential/utilitarian
            sentiment = 'neutral';
          }

          addTransaction({
            type: 'expense',
            amount: amount,
            category: matchedCategory,
            description: description.charAt(0).toUpperCase() + description.slice(1),
            date: new Date().toISOString(),
            eqScore,
            sentiment
          });

          setMessages(prev => [
            ...prev,
            {
              id: Date.now().toString(),
              sender: 'ai',
              text: `Got it! I've logged an expense of ${formatCurrency(amount)} for "${description}" under ${matchedCategory} (EQ Score: ${eqScore}/100 🧠).`
            }
          ]);
        } else {
          setMessages(prev => [
            ...prev,
            {
              id: Date.now().toString(),
              sender: 'ai',
              text: "I've noted that! You can review your budget below or tell me about an expense (e.g., 'Rs 50 for coffee')."
            }
          ]);
        }
        setIsTyping(false);
      }, 1000);
    }
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const confirmCategories = () => {
    if (selectedCategories.length === 0) return;

    setIsTyping(true);
    // Remove the category selection type from previous message so it doesn't stay interactive
    setMessages(prev => prev.map(m => m.type === 'category-selection' ? { ...m, type: 'text' } : m));

    // Add user confirmation message
    const confirmMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: `I've selected: ${selectedCategories.join(', ')}`
    };
    setMessages(prev => [...prev, confirmMsg]);

    setTimeout(() => {
      // Generate actual plan based on selection
      const totalSalary = summary.monthlyIncome > 0 ? summary.monthlyIncome : 50000; // Fallback if no income
      const colors = ['#f59e0b', '#ef4444', '#ec4899', '#6b7280', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316', '#6366f1'];

      const budgetAllocation = selectedCategories.map((category, index) => {
        // Even split for simplicity in this demo, with slight variations
        const share = 1 / selectedCategories.length;
        return {
          id: index.toString(),
          category,
          amount: totalSalary * share,
          spent: 0,
          period: 'monthly' as const,
          isLocked: false,
          color: colors[index % colors.length]
        };
      });

      const aiPlan: AIBudgetPlan = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        userProfile: {
          age: 25, dependents: 0, location: '', financialGoals: [], lifestyle: 'moderate', monthlySalary: totalSalary, riskTolerance: 'medium'
        },
        budgetAllocation,
        recommendations: [
          `I've perfectly balanced your budget across your ${selectedCategories.length} selected categories.`,
          `Your customized budget settings have been applied globally!`,
          "We can adjust these allocations anytime."
        ],
        isLocked: false,
        totalBudget: totalSalary
      };

      setAIBudgetPlan(aiPlan);

      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'ai',
          text: "Boom! 🎯 I've smartly customized your tracking settings and allocated your budget based on your goals. Your new budget is live!",
          type: 'budget-confirmed'
        }
      ]);
      setStage('confirmed');
      setIsTyping(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-white dark:bg-secondary-800 rounded-2xl shadow-sm border border-secondary-200 dark:border-secondary-700 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-secondary-200 dark:border-secondary-700 flex items-center space-x-3 bg-white/50 dark:bg-secondary-800/50 backdrop-blur-sm z-10 sticky top-0">
        <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
          <Brain className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h2 className="font-semibold text-secondary-900 dark:text-white">CAFA</h2>
          <p className="text-xs text-primary-600 dark:text-primary-400 flex items-center">
            <span className="w-2 h-2 rounded-full bg-primary-500 mr-2 animate-pulse"></span>
            Online
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.sender === 'user'
                  ? 'bg-secondary-100 dark:bg-secondary-700 ml-2'
                  : 'bg-primary-100 dark:bg-primary-900/20 mr-2'
                  }`}>
                  {msg.sender === 'user' ? (
                    <User className="w-4 h-4 text-secondary-600 dark:text-white" />
                  ) : (
                    <Brain className="w-4 h-4 text-primary-600" />
                  )}
                </div>

                {/* Message Content */}
                <div className={`p-3 rounded-2xl ${msg.sender === 'user'
                  ? 'bg-primary-600 text-white rounded-tr-sm'
                  : 'bg-secondary-100 dark:bg-secondary-700 text-secondary-900 dark:text-white rounded-tl-sm'
                  }`}>
                  <p className="text-sm">{msg.text}</p>

                  {/* Category Selection UI within AI Message */}
                  {msg.type === 'category-selection' && msg.options && (
                    <div className="mt-4 space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {msg.options.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => toggleCategory(cat)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${selectedCategories.includes(cat)
                              ? 'bg-primary-500 border-primary-500 text-white shadow-md scale-105'
                              : 'bg-white dark:bg-secondary-800 border-secondary-300 dark:border-secondary-600 text-secondary-700 dark:text-secondary-300 hover:border-primary-400'
                              }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={confirmCategories}
                        disabled={selectedCategories.length === 0}
                        className={`w-full py-2 rounded-xl text-sm font-semibold transition-all flex items-center justify-center ${selectedCategories.length > 0
                          ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-md'
                          : 'bg-secondary-200 dark:bg-secondary-600 text-secondary-400 cursor-not-allowed'
                          }`}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Confirm Categories ({selectedCategories.length})
                      </button>
                    </div>
                  )}

                  {/* Budget Confirmed UI */}
                  {msg.type === 'budget-confirmed' && (
                    <div className="mt-3 bg-white/50 dark:bg-secondary-800/50 rounded-xl p-3 border border-primary-200 dark:border-primary-800">
                      <div className="flex items-center space-x-2 text-primary-700 dark:text-primary-300 mb-2">
                        <Target className="w-4 h-4" />
                        <span className="text-xs font-semibold">Budget Status: ACTIVE</span>
                      </div>
                      <p className="text-xs text-secondary-600 dark:text-secondary-400 leading-relaxed">
                        Check out your Dashboard to view the newly allocated funds based on our chat!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="flex flex-row max-w-[85%]">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/20 mr-2 flex items-center justify-center">
                <Brain className="w-4 h-4 text-primary-600" />
              </div>
              <div className="bg-secondary-100 dark:bg-secondary-700 p-3 rounded-2xl rounded-tl-sm flex space-x-1 items-center h-10">
                <div className="w-2 h-2 bg-secondary-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-secondary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-secondary-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 z-10">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={stage === 'suggesting_categories' ? "Please select categories above..." : "Type your message..."}
            disabled={stage === 'suggesting_categories' || isTyping}
            className="w-full pl-4 pr-12 py-3 rounded-xl border-2 border-secondary-200 dark:border-secondary-700 focus:outline-none focus:border-primary-500 bg-secondary-50 dark:bg-secondary-900 text-secondary-900 dark:text-white disabled:opacity-50 transition-colors"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || stage === 'suggesting_categories' || isTyping}
            className="absolute right-2 p-2 bg-primary-600 hover:bg-primary-700 disabled:bg-secondary-300 dark:disabled:bg-secondary-700 text-white rounded-lg transition-colors flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
