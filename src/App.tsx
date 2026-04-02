import { useState, useEffect, useCallback } from 'react';
import { Sidebar }              from './components/Sidebar/Sidebar';
import { MobileNav }            from './components/MobileNav/MobileNav';
import { Dashboard }            from './components/Dashboard/Dashboard';
import { TransactionPage }      from './components/TransactionPage/TransactionPage';
import { AddTransactionModal }  from './components/AddTransactionModal/AddTransactionModal';
import { Toast }                from './components/Toast/Toast';
import { useTransactions }      from './hooks/useTransactions';
import { useToast }             from './hooks/useToast';
import type { ViewDate, ViewType } from './types';

function initialViewDate(): ViewDate {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() };
}

export function App() {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewDate, setViewDate]       = useState<ViewDate>(initialViewDate);

  const { transactions, addTransaction, deleteTransaction, exportCSV } = useTransactions();
  const { toast, showToast } = useToast();

  useEffect(() => {
    if (!window.visualViewport) return;
    const adjust = () => {
      const offset = window.innerHeight - (window.visualViewport?.height ?? window.innerHeight);
      document.body.style.paddingBottom = offset > 0 ? `${offset}px` : '';
    };
    window.visualViewport.addEventListener('resize', adjust);
    window.addEventListener('orientationchange', () => setTimeout(adjust, 300));
    adjust();
    return () => {
      window.visualViewport?.removeEventListener('resize', adjust);
    };
  }, []);

  const navigate = useCallback((view: ViewType) => {
    setActiveView(view);
  }, []);

  function prevMonth() {
    setViewDate((prev) => {
      let { year, month } = prev;
      month--;
      if (month < 0) { month = 11; year--; }
      return { year, month };
    });
  }

  function nextMonth() {
    const now = new Date();
    setViewDate((prev) => {
      if (prev.year === now.getFullYear() && prev.month === now.getMonth()) return prev;
      let { year, month } = prev;
      month++;
      if (month > 11) { month = 0; year++; }
      return { year, month };
    });
  }

  function handleAdd(data: Parameters<typeof addTransaction>[0]) {
    addTransaction(data);
    setIsModalOpen(false);
    showToast('Transaction added ✓');
  }

  function handleDelete(id: number) {
    deleteTransaction(id);
    showToast('Transaction removed');
  }

  function handleExport() {
    exportCSV(
      () => showToast('No transactions to export'),
      () => showToast('CSV exported ✓'),
    );
  }

  return (
    <>
      <Sidebar activeView={activeView} onNavigate={navigate} onExport={handleExport} />

      <main className="main">
        {activeView === 'dashboard' && (
          <Dashboard
            transactions={transactions}
            viewDate={viewDate}
            onPrevMonth={prevMonth}
            onNextMonth={nextMonth}
            onNavigate={navigate}
          />
        )}
        {activeView === 'transactions' && (
          <TransactionPage
            transactions={transactions}
            onDelete={handleDelete}
            onOpenModal={() => setIsModalOpen(true)}
          />
        )}
      </main>

      {isModalOpen && (
        <AddTransactionModal
          onAdd={handleAdd}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      <Toast toast={toast} />

      <MobileNav activeView={activeView} onNavigate={navigate} onExport={handleExport} />
    </>
  );
}
