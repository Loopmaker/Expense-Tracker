export type TransactionType = 'income' | 'expense';
export type ChartType = 'doughnut' | 'bar';
export type ViewType = 'dashboard' | 'transactions';

export interface Transaction {
  id: number;
  description: string;
  amount: number;
  date: string;
  category: string;
  notes: string;
  type: TransactionType;
}

export interface Category {
  id: string;
  label: string;
  color: string;
  type: 'income' | 'expense' | 'both';
}

export interface ViewDate {
  year: number;
  month: number;
}

export interface NewTransactionData {
  description: string;
  amount: number;
  date: string;
  category: string;
  notes: string;
  type: TransactionType;
}
