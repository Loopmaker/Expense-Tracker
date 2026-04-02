import { CATEGORIES, fmt, fmtDate } from '../../constant';
import type { Transaction } from '../../types';

interface TransactionItemProps {
  transaction: Transaction;
  showDelete?: boolean;
  onDelete?: (id: number) => void;
}

export function TransactionItem({
  transaction: t,
  showDelete = false,
  onDelete,
}: TransactionItemProps) {
  const cat = CATEGORIES.find((c) => c.id === t.category) ?? {
    color: '#6b7280',
    label: 'Other',
  };
  const amountClass = t.amount >= 0 ? 'pos' : 'neg';
  const amountStr = (t.amount >= 0 ? '+' : '') + fmt(t.amount);
  const initials = cat.label.slice(0, 2).toUpperCase();

  return (
    <li className="tx-item">
      <div
        className="tx-icon"
        style={{ background: `${cat.color}22`, color: cat.color }}
      >
        {initials}
      </div>

      <div className="tx-info">
        <div className="tx-desc">{t.description}</div>
        <div className="tx-meta">
          {cat.label} · {fmtDate(t.date)}
          {t.notes ? ` · ${t.notes}` : ''}
        </div>
      </div>

      <div className={`tx-amount ${amountClass}`}>{amountStr}</div>

      {showDelete && onDelete && (
        <button
          className="tx-delete"
          onClick={() => onDelete(t.id)}
          title="Delete"
        >
          ✕
        </button>
      )}
    </li>
  );
}
