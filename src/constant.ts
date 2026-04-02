import type { Category } from './types';

export const CATEGORIES: Category[] = [
  { id: 'food',          label: 'Food & Dining',    color: '#f59e0b', type: 'expense' },
  { id: 'transport',     label: 'Transport',         color: '#3b82f6', type: 'expense' },
  { id: 'bills',         label: 'Bills & Utilities', color: '#8b5cf6', type: 'expense' },
  { id: 'shopping',      label: 'Shopping',          color: '#ec4899', type: 'expense' },
  { id: 'health',        label: 'Health',            color: '#10b981', type: 'expense' },
  { id: 'entertainment', label: 'Entertainment',     color: '#f97316', type: 'expense' },
  { id: 'salary',        label: 'Salary',            color: '#4dffa0', type: 'income'  },
  { id: 'freelance',     label: 'Freelance',         color: '#4dffa0', type: 'income'  },
  { id: 'other',         label: 'Other',             color: '#6b7280', type: 'both'    },
];

export const fmt = (n: number): string =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(n);

export const fmtDate = (d: string): string =>
  new Date(d).toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

export const today = (): string => new Date().toISOString().split('T')[0];
