import { useState, useEffect, useRef} from 'react';
import { CATEGORIES, today } from '../../constant';
import type { NewTransactionData, TransactionType } from '../../types';
import './AddTransactionModal.css';

interface AddTransactionModalProps {
  onAdd: (data: NewTransactionData) => void;
  onClose: () => void;
}

const EMPTY_FORM = {
  description: '',
  amount: '',
  date: today(),
  category: '',
  notes: '',
};

export function AddTransactionModal({ onAdd, onClose }: AddTransactionModalProps) {
  const [activeType, setActiveType] = useState<TransactionType>('income');
  const [form, setForm] = useState(EMPTY_FORM);
  const descRef = useRef<HTMLInputElement>(null);

  // Focus description input when modal opens
  useEffect(() => {
    descRef.current?.focus();
  }, []);

  // Reset category when type changes
  useEffect(() => {
    setForm((prev) => ({ ...prev, category: '' }));
  }, [activeType]);

  const filteredCategories = CATEGORIES.filter(
    (c) => c.type === activeType || c.type === 'both',
  );

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const amount = parseFloat(form.amount);
    if (!form.description.trim() || !amount || !form.date || !form.category) return;
    const finalAmount = activeType === 'expense' ? -Math.abs(amount) : Math.abs(amount);
    onAdd({
      description: form.description.trim(),
      amount: finalAmount,
      date: form.date,
      category: form.category,
      notes: form.notes.trim(),
      type: activeType,
    });
  }

  function set(field: keyof typeof EMPTY_FORM) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal">
        <div className="modal-header">
          <h2>Add Transaction</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="type-toggle">
          {(['income', 'expense'] as TransactionType[]).map((t) => (
            <button
              key={t}
              className={`type-btn ${activeType === t ? 'active' : ''}`}
              data-type={t}
              onClick={() => setActiveType(t)}
              type="button"
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input
              id="description"
              ref={descRef}
              type="text"
              placeholder="e.g. Lunch at Jollibee"
              required
              autoComplete="off"
              value={form.description}
              onChange={set('description')}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="amount">Amount (₱)</label>
              <input
                id="amount"
                type="number"
                placeholder="0.00"
                min="0.01"
                step="0.01"
                required
                value={form.amount}
                onChange={set('amount')}
              />
            </div>
            <div className="form-group">
              <label htmlFor="tx-date">Date</label>
              <input
                id="tx-date"
                type="date"
                required
                max={today()}
                value={form.date}
                onChange={set('date')}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              required
              value={form.category}
              onChange={set('category')}
            >
              <option value="" disabled>Select category</option>
              {filteredCategories.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="notes">
              Notes <span className="optional">(optional)</span>
            </label>
            <input
              id="notes"
              type="text"
              placeholder="Any extra details…"
              autoComplete="off"
              value={form.notes}
              onChange={set('notes')}
            />
          </div>

          <button type="submit" className="submit-btn">Add Transaction</button>
        </form>
      </div>
    </div>
  );
}
