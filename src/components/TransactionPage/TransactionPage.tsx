import { useState, useMemo } from 'react';
import { CATEGORIES } from '../../constant';
import type { Transaction, TransactionType } from '../../types';
import { TransactionItem } from '../TransactionItem/TransactionItem';
import './TransactionPage.css';

interface TransactionPageProps {
  transactions: Transaction[];
  onDelete: (id: number) => void;
  onOpenModal: () => void;
}

type TypeFilter = 'all' | TransactionType;

export function TransactionPage({ transactions, onDelete, onOpenModal }: TransactionPageProps) {
  const [search, setSearch]       = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');

  // Categories available for the current type filter
  const availableCategories = useMemo(
    () =>
      CATEGORIES.filter((c) => typeFilter === 'all' || c.type === typeFilter || c.type === 'both'),
    [typeFilter],
  );

  function handleTypeChange(value: TypeFilter) {
    setTypeFilter(value);
    // If the currently selected category is no longer valid, reset it
    const stillValid = availableCategories.some((c) => c.id === catFilter);
    if (!stillValid) setCatFilter('all');
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return [...transactions].reverse().filter((t) => {
      const matchSearch =
        t.description.toLowerCase().includes(q) ||
        (t.notes && t.notes.toLowerCase().includes(q));
      const matchCat  = catFilter  === 'all' || t.category === catFilter;
      const matchType = typeFilter === 'all' || t.type === typeFilter;
      return matchSearch && matchCat && matchType;
    });
  }, [transactions, search, catFilter, typeFilter]);

  return (
    <section className="view-section">
      <header className="page-header">
        <div>
          <p className="page-label">All Activity</p>
          <h1 className="page-title">Transactions</h1>
        </div>
        <button className="add-btn" onClick={onOpenModal}>+ Add Transaction</button>
      </header>

      <div className="filters-bar">
        {/* Search */}
        <div className="search-wrap">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search transactions…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category filter */}
        <select
          className="filter-select"
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
        >
          <option value="all">All Categories</option>
          {availableCategories.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>

        {/* Type filter */}
        <select
          className="filter-select"
          value={typeFilter}
          onChange={(e) => handleTypeChange(e.target.value as TypeFilter)}
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="empty-state">No transactions found</p>
      ) : (
        <ul className="tx-list full">
          {filtered.map((t) => (
            <TransactionItem
              key={t.id}
              transaction={t}
              showDelete
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
