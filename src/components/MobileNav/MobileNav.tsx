import type { ViewType } from '../../types';
import './MobileNav.css';

interface MobileNavProps {
  activeView: ViewType;
  onNavigate: (view: ViewType) => void;
  onExport: () => void;
  onSignOut: () => void;
}

export function MobileNav({ activeView, onNavigate, onExport, onSignOut }: MobileNavProps) {
  return (
    <nav className="mobile-nav">
      <button
        className={`mobile-nav-item ${activeView === 'dashboard' ? 'active' : ''}`}
        onClick={() => onNavigate('dashboard')}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
        <span>Dashboard</span>
      </button>

      <button
        className={`mobile-nav-item ${activeView === 'transactions' ? 'active' : ''}`}
        onClick={() => onNavigate('transactions')}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <span>Transactions</span>
      </button>

      <button className="mobile-nav-item" onClick={onExport}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
        </svg>
        <span>Export</span>
      </button>

      <button className="mobile-nav-item signout" onClick={onSignOut}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span>Sign out</span>
      </button>
    </nav>
  );
}
