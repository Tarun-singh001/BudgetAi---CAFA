import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Transaction, Category, Budget, Summary, PaymentDetails, AIBudgetPlan } from '../types';
import { generateId, formatCurrency, getCurrentMonth } from '../lib/utils';

// Default categories
const defaultCategories: Category[] = [
  { id: '1', name: 'Salary', type: 'income', color: '#10b981', icon: '💼', subCategories: [] },
  { id: '2', name: 'Freelance', type: 'income', color: '#3b82f6', icon: '💻', subCategories: [] },
  { id: '3', name: 'Investment', type: 'income', color: '#8b5cf6', icon: '📈', subCategories: [] },
  {
    id: '4', name: 'Food & Dining', type: 'expense', color: '#f59e0b', icon: '🍽️',
    subCategories: ['Restaurants', 'Groceries', 'Takeout', 'Coffee']
  },
  {
    id: '5', name: 'Transportation', type: 'expense', color: '#ef4444', icon: '🚗',
    subCategories: ['Fuel', 'Public Transport', 'Uber/Ola', 'Maintenance']
  },
  {
    id: '6', name: 'Shopping', type: 'expense', color: '#ec4899', icon: '🛍️',
    subCategories: ['Clothing', 'Electronics', 'Home & Garden', 'Books']
  },
  {
    id: '7', name: 'Bills & Utilities', type: 'expense', color: '#6b7280', icon: '📱',
    subCategories: ['Electricity', 'Water', 'Internet', 'Phone']
  },
  {
    id: '8', name: 'Entertainment', type: 'expense', color: '#8b5cf6', icon: '🎬',
    subCategories: ['Movies', 'Games', 'Sports', 'Concerts']
  },
  {
    id: '9', name: 'Health & Fitness', type: 'expense', color: '#06b6d4', icon: '🏥',
    subCategories: ['Gym', 'Medical', 'Supplements', 'Wellness']
  },
  {
    id: '10', name: 'Education', type: 'expense', color: '#84cc16', icon: '📚',
    subCategories: ['Courses', 'Books', 'Workshops', 'Certifications']
  },
  {
    id: '11', name: 'Emergency Fund', type: 'expense', color: '#f97316', icon: '🆘',
    subCategories: ['Savings', 'Insurance', 'Emergency']
  },
  {
    id: '12', name: 'Savings & Investment', type: 'expense', color: '#6366f1', icon: '💰',
    subCategories: ['Mutual Funds', 'Stocks', 'FD', 'PPF']
  },
];

interface AppState {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  aiBudgetPlan: AIBudgetPlan | null;
  currentMonth: string;
  summary: Summary;
}

type AppAction =
  | { type: 'ADD_TRANSACTION'; payload: Omit<Transaction, 'id'> }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'ADD_CATEGORY'; payload: Omit<Category, 'id'> }
  | { type: 'UPDATE_BUDGET'; payload: Budget }
  | { type: 'SET_AI_BUDGET_PLAN'; payload: AIBudgetPlan }
  | { type: 'LOCK_BUDGET'; payload: string }
  | { type: 'LOAD_DATA' };

const initialState: AppState = {
  transactions: [],
  categories: defaultCategories,
  budgets: [],
  aiBudgetPlan: null,
  currentMonth: getCurrentMonth(),
  summary: {
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    monthlyBalance: 0,
    savingsRate: 0,
  },
};

function recalculateBudgets(transactions: Transaction[], currentBudgets: Budget[]): Budget[] {
  return currentBudgets.map(budget => {
    // A budget's 'spent' is the sum of all transaction amounts where type == 'expense' AND category matches
    const spentAmount = transactions
      .filter(t => t.type === 'expense' && t.category === budget.category)
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      ...budget,
      spent: spentAmount
    };
  });
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_TRANSACTION': {
      const newTransaction: Transaction = {
        ...action.payload,
        id: generateId(),
      };
      const newTransactions = [newTransaction, ...state.transactions];
      const newBudgets = recalculateBudgets(newTransactions, state.budgets);

      return {
        ...state,
        transactions: newTransactions,
        budgets: newBudgets,
        // Also update AI budget plan copy if it exists 
        aiBudgetPlan: state.aiBudgetPlan ? { ...state.aiBudgetPlan, budgetAllocation: newBudgets } : null,
        summary: calculateSummary(newTransactions, newBudgets),
      };
    }
    case 'DELETE_TRANSACTION': {
      const newTransactions = state.transactions.filter(t => t.id !== action.payload);
      const newBudgets = recalculateBudgets(newTransactions, state.budgets);

      return {
        ...state,
        transactions: newTransactions,
        budgets: newBudgets,
        aiBudgetPlan: state.aiBudgetPlan ? { ...state.aiBudgetPlan, budgetAllocation: newBudgets } : null,
        summary: calculateSummary(newTransactions, newBudgets),
      };
    }
    case 'ADD_CATEGORY': {
      const newCategory: Category = {
        ...action.payload,
        id: generateId(),
      };
      return {
        ...state,
        categories: [...state.categories, newCategory],
      };
    }
    case 'UPDATE_BUDGET': {
      const updatedBudgets = state.budgets.map(b =>
        b.id === action.payload.id ? action.payload : b
      );
      return {
        ...state,
        budgets: updatedBudgets,
        aiBudgetPlan: state.aiBudgetPlan ? { ...state.aiBudgetPlan, budgetAllocation: updatedBudgets } : null,
        summary: calculateSummary(state.transactions, updatedBudgets),
      };
    }
    case 'SET_AI_BUDGET_PLAN': {
      return {
        ...state,
        aiBudgetPlan: action.payload,
        budgets: action.payload.budgetAllocation,
        summary: calculateSummary(state.transactions, action.payload.budgetAllocation),
      };
    }
    case 'LOCK_BUDGET': {
      const updatedBudgets = state.budgets.map(b =>
        b.id === action.payload ? { ...b, isLocked: true } : b
      );
      return {
        ...state,
        budgets: updatedBudgets,
        aiBudgetPlan: state.aiBudgetPlan ? { ...state.aiBudgetPlan, budgetAllocation: updatedBudgets } : null,
      };
    }
    case 'LOAD_DATA': {
      return state;
    }
    default:
      return state;
  }
}

function calculateSummary(transactions: Transaction[], budgets: Budget[]): Summary {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyIncome = transactions
    .filter(t => {
      const date = new Date(t.date);
      return t.type === 'income' &&
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpenses = transactions
    .filter(t => {
      const date = new Date(t.date);
      return t.type === 'expense' &&
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyBalance = monthlyIncome - monthlyExpenses;
  const savingsRate = monthlyIncome > 0 ? (monthlyBalance / monthlyIncome) * 100 : 0;

  return {
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
    monthlyIncome,
    monthlyExpenses,
    monthlyBalance,
    savingsRate: Math.round(savingsRate),
  };
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateBudget: (budget: Budget) => void;
  setAIBudgetPlan: (plan: AIBudgetPlan) => void;
  lockBudget: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem('budget-buddy-transactions');
    const savedCategories = localStorage.getItem('budget-buddy-categories');
    const savedBudgets = localStorage.getItem('budget-buddy-budgets');
    const savedAIPlan = localStorage.getItem('budget-buddy-ai-plan');

    if (savedTransactions) {
      const transactions = JSON.parse(savedTransactions);
      dispatch({ type: 'LOAD_DATA' });
      // Update state directly for initial load
      state.transactions = transactions;
    }
    if (savedCategories) {
      state.categories = JSON.parse(savedCategories);
    }
    if (savedBudgets) {
      state.budgets = JSON.parse(savedBudgets);
    }
    if (savedAIPlan) {
      state.aiBudgetPlan = JSON.parse(savedAIPlan);
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('budget-buddy-transactions', JSON.stringify(state.transactions));
  }, [state.transactions]);

  useEffect(() => {
    localStorage.setItem('budget-buddy-categories', JSON.stringify(state.categories));
  }, [state.categories]);

  useEffect(() => {
    localStorage.setItem('budget-buddy-budgets', JSON.stringify(state.budgets));
  }, [state.budgets]);

  useEffect(() => {
    if (state.aiBudgetPlan) {
      localStorage.setItem('budget-buddy-ai-plan', JSON.stringify(state.aiBudgetPlan));
    }
  }, [state.aiBudgetPlan]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
  };

  const deleteTransaction = (id: string) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    dispatch({ type: 'ADD_CATEGORY', payload: category });
  };

  const updateBudget = (budget: Budget) => {
    dispatch({ type: 'UPDATE_BUDGET', payload: budget });
  };

  const setAIBudgetPlan = (plan: AIBudgetPlan) => {
    dispatch({ type: 'SET_AI_BUDGET_PLAN', payload: plan });
  };

  const lockBudget = (id: string) => {
    dispatch({ type: 'LOCK_BUDGET', payload: id });
  };

  const value: AppContextType = {
    state,
    dispatch,
    addTransaction,
    deleteTransaction,
    addCategory,
    updateBudget,
    setAIBudgetPlan,
    lockBudget,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}


