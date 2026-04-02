import type { ViewType } from '../../types';
import './Sidebar.css';

interface SidebarProps {
  activeView: ViewType;
  onNavigate: (view: ViewType) => void;
  onExport: () => void;
}

export function Sidebar({ activeView, onNavigate, onExport }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="logo">
        <span className="logo-mark">S</span>
        <span className="logo-text">SpendLog</span>
      </div>

      <nav className="nav">
        <button
          className={`nav-item ${activeView === 'dashboard' ? 'active' : ''}`}
          onClick={() => onNavigate('dashboard')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
          Dashboard
        </button>
        <button
          className={`nav-item ${activeView === 'transactions' ? 'active' : ''}`}
          onClick={() => onNavigate('transactions')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Transactions
        </button>
      </nav>

      <div className="sidebar-footer">
        <button className="export-btn" onClick={onExport}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
          Export CSV
        </button>
      </div>
    </aside>
  );
}
