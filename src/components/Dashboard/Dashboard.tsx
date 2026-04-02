import type { Transaction, ViewDate, ViewType } from '../../types';
import { fmt } from '../../constant';
import { ChartCard } from '../ChartCard/ChartCard';
import { TransactionItem } from '../TransactionItem/TransactionItem';
import './Dashboard.css';

interface DashboardProps {
  transactions: Transaction[];
  viewDate: ViewDate;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onNavigate: (view: ViewType) => void;
}

function getMonthlyTransactions(transactions: Transaction[], viewDate: ViewDate): Transaction[] {
  return transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getFullYear() === viewDate.year && d.getMonth() === viewDate.month;
  });
}

export function Dashboard({
  transactions,
  viewDate,
  onPrevMonth,
  onNextMonth,
  onNavigate,
}: DashboardProps) {
  const now = new Date();
  const isCurrentMonth =
    viewDate.year === now.getFullYear() && viewDate.month === now.getMonth();

  const monthLabel = new Date(viewDate.year, viewDate.month).toLocaleDateString('en-PH', {
    month: 'long',
    year: 'numeric',
  });

  const monthly = getMonthlyTransactions(transactions, viewDate);
  const income  = monthly.filter((t) => t.amount > 0).reduce((a, t) => a + t.amount, 0);
  const expense = monthly.filter((t) => t.amount < 0).reduce((a, t) => a + t.amount, 0);
  const balance = income + expense;
  const recent  = [...monthly].reverse().slice(0, 6);

  return (
    <section className="view-section">
      <header className="page-header">
        <div>
          <p className="page-label">Overview</p>
          <h1 className="page-title">Dashboard</h1>
        </div>
        <div className="month-filter">
          <button className="month-btn" onClick={onPrevMonth}>←</button>
          <span>{monthLabel}</span>
          <button
            className="month-btn"
            onClick={onNextMonth}
            disabled={isCurrentMonth}
          >
            →
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card balance-card">
          <p className="stat-label">Net Balance</p>
          <p className="stat-value">{fmt(balance)}</p>
          <div
            className="stat-badge"
            style={{ color: balance >= 0 ? 'var(--income)' : 'var(--expense)' }}
          >
            {balance >= 0 ? '▲ Positive month' : '▼ Negative month'}
          </div>
        </div>
        <div className="stat-card">
          <p className="stat-label">Total Income</p>
          <p className="stat-value income-color">{fmt(income)}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Total Expenses</p>
          <p className="stat-value expense-color">{fmt(Math.abs(expense))}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Transactions</p>
          <p className="stat-value">{monthly.length}</p>
        </div>
      </div>

      {/* Body */}
      <div className="dashboard-body">
        <ChartCard transactions={monthly} />

        <div className="recent-card">
          <div className="card-header">
            <h2>Recent Activity</h2>
            <button className="text-btn" onClick={() => onNavigate('transactions')}>
              See all →
            </button>
          </div>

          {recent.length === 0 ? (
            <p className="empty-state">No transactions this month</p>
          ) : (
            <ul className="tx-list">
              {recent.map((t) => (
                <TransactionItem key={t.id} transaction={t} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
