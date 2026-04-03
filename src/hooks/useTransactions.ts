import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { CATEGORIES } from '../constant';
import type { Transaction, NewTransactionData } from '../types';

export function useTransactions(userId: string) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (!error && data) {
        setTransactions(data as Transaction[]);
      }
      setLoading(false);
    }

    load();
  }, [userId]);

  const addTransaction = useCallback(async (data: NewTransactionData) => {
    const { data: inserted, error } = await supabase
      .from('transactions')
      .insert({ ...data, user_id: userId })
      .select()
      .single();

    if (!error && inserted) {
      setTransactions((prev) => [inserted as Transaction, ...prev]);
    }
  }, [userId]);

  const deleteTransaction = useCallback(async (id: number) => {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (!error) {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    }
  }, [userId]);

  const exportCSV = useCallback(
    (onEmpty: () => void, onSuccess: () => void) => {
      if (transactions.length === 0) { onEmpty(); return; }

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

      const csv  = [header, ...rows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href = url;
      a.download = `gastos-export-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      onSuccess();
    },
    [transactions],
  );

  return { transactions, loading, addTransaction, deleteTransaction, exportCSV };
}