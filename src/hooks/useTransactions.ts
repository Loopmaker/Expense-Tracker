import { useState, useCallback } from 'react';
import { CATEGORIES } from '../constant';
import type { Transaction, NewTransactionData } from '../types';

const STORAGE_KEY = 'gastos_tx';

function loadFromStorage(): Transaction[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as Transaction[];
  } catch {
    return [];
  }
}

function persist(txs: Transaction[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(txs));
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(loadFromStorage);

  const addTransaction = useCallback((data: NewTransactionData) => {
    const newTx: Transaction = { ...data, id: Date.now() };
    setTransactions((prev) => {
      const next = [...prev, newTx];
      persist(next);
      return next;
    });
  }, []);

  const deleteTransaction = useCallback((id: number) => {
    setTransactions((prev) => {
      const next = prev.filter((t) => t.id !== id);
      persist(next);
      return next;
    });
  }, []);

  const exportCSV = useCallback(
    (onEmpty: () => void, onSuccess: () => void) => {
      if (transactions.length === 0) {
        onEmpty();
        return;
      }
      const header = 'Date,Description,Category,Type,Amount,Notes';
      const rows = transactions.map((t) => {
        const cat = CATEGORIES.find((c) => c.id === t.category);
        return [
          t.date,
          `"${t.description.replace(/"/g, '""')}"`,
          cat ? cat.label : t.category,
          t.type,
          t.amount.toFixed(2),
          `"${(t.notes || '').replace(/"/g, '""')}"`,
        ].join(',');
      });
      const csv = [header, ...rows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gastos-export-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      onSuccess();
    },
    [transactions],
  );

  return { transactions, addTransaction, deleteTransaction, exportCSV };
}
