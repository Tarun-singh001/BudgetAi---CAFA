export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  subCategory?: string;
  description: string;
  date: string;
  paymentMethod?: string;
  recipient?: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon: string;
  subCategories?: string[];
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
  spent: number;
  period: 'monthly' | 'yearly';
  isLocked: boolean;
  color: string;
}

export interface Summary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlyBalance: number;
  savingsRate: number;
}

export interface PaymentDetails {
  amount: number;
  recipientType: 'mobile' | 'upi';
  recipient: string;
  category: string;
  description: string;
  paymentMethod: 'gpay' | 'phonepe' | 'paytm' | 'bhim';
}

export interface UPIApp {
  name: string;
  packageName: string;
  deepLink: string;
  icon: string;
  color: string;
}

export interface UserProfile {
  age: number;
  dependents: number;
  location: string;
  financialGoals: string[];
  lifestyle: 'minimalist' | 'moderate' | 'luxury';
  monthlySalary: number;
  riskTolerance: 'low' | 'medium' | 'high';
}

export interface AIBudgetPlan {
  id: string;
  createdAt: string;
  userProfile: UserProfile;
  budgetAllocation: Budget[];
  recommendations: string[];
  isLocked: boolean;
  totalBudget: number;
}

export interface ExpenseCategory {
  name: string;
  percentage: number;
  color: string;
  icon: string;
  subCategories: string[];
}

export interface ChartData {
  name: string;
  value: number;
  color: string;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
}
