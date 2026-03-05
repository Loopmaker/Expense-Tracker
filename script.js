// ── Constants ─────────────────────────────────
// These are the fixed values used throughout the app.
// Categories for transactions, plus some handy formatters
// so we can present numbers and dates in a nice way.
const CATEGORIES = [
  { id: 'food',          label: 'Food & Dining',    color: '#f59e0b', type: 'expense' },
  { id: 'transport',     label: 'Transport',         color: '#3b82f6', type: 'expense' },
  { id: 'bills',         label: 'Bills & Utilities', color: '#8b5cf6', type: 'expense' },
  { id: 'shopping',      label: 'Shopping',          color: '#ec4899', type: 'expense' },
  { id: 'health',        label: 'Health',            color: '#10b981', type: 'expense' },
  { id: 'entertainment', label: 'Entertainment',     color: '#f97316', type: 'expense' },
  { id: 'salary',        label: 'Salary',            color: '#4dffa0', type: 'income'  },
  { id: 'freelance',     label: 'Freelance',         color: '#4dffa0', type: 'income'  },
  { id: 'other',         label: 'Other',             color: '#6b7280', type: 'both'    },
];

const fmt = (n) => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(n);
const fmtDate = (d) => new Date(d).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });

/* ── State ─────────────────────────────────────
   application state held in memory, mirrors localStorage,
   and tracks things like current view, filters, etc.
*/
let transactions = JSON.parse(localStorage.getItem('gastos_tx')) || [];
let budgets = {};
let activeType = 'income';
let currentChartType = 'doughnut';
let chartInstance = null;

const viewDate = { year: new Date().getFullYear(), month: new Date().getMonth() };

// ── DOM Refs ──────────────────────────────────
const views       = document.querySelectorAll('.view');
const navItems    = document.querySelectorAll('.nav-item');
const modal       = document.getElementById('modal-backdrop');
const formEl      = document.getElementById('transaction-form');
const descEl      = document.getElementById('description');
const amtEl       = document.getElementById('amount');
const dateEl      = document.getElementById('tx-date');
const catEl       = document.getElementById('category');
const notesEl     = document.getElementById('notes');
const typeBtns    = document.querySelectorAll('.type-btn');
const toggleBtns  = document.querySelectorAll('.toggle-btn');
const searchEl    = document.getElementById('search-input');
const filterCatEl = document.getElementById('filter-category');
const filterTypeEl= document.getElementById('filter-type');
const toastEl     = document.getElementById('toast');

// ── Init ──────────────────────────────────────
function init() {
  populateCategoryDropdowns();
  setDefaultDate();
  renderAll();
  bindEvents();
}

function populateCategoryDropdowns() {
  // Form select
  catEl.innerHTML = '<option value="" disabled selected>Select category</option>';
  CATEGORIES.forEach(c => {
    const o = document.createElement('option');
    o.value = c.id;
    o.textContent = c.label;
    catEl.appendChild(o);
  });

  // Filter select
  filterCatEl.innerHTML = '<option value="all">All Categories</option>';
  CATEGORIES.forEach(c => {
    const o = document.createElement('option');
    o.value = c.id;
    o.textContent = c.label;
    filterCatEl.appendChild(o);
  });
}

function setDefaultDate() {
  const today = new Date().toISOString().split('T')[0];
  dateEl.value = today;
  dateEl.max = today;
}

// ── Event listeners ────────────────────────────
// wire up UI controls so clicks/inputs do something useful
function bindEvents() {
  // Nav
  navItems.forEach(btn => {
    btn.addEventListener('click', () => switchView(btn.dataset.view, btn));
  });

  // See all shortcut
  document.getElementById('see-all-btn').addEventListener('click', () => {
    const txBtn = document.querySelector('.nav-item[data-view="transactions"]');
    switchView('transactions', txBtn);
  });

  // Modal
  document.getElementById('open-modal').addEventListener('click', openModal);
  document.getElementById('close-modal').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  // Type toggle
  typeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      activeType = btn.dataset.type;
      typeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      updateCategoryForType();
    });
  });

  // Form submit
  formEl.addEventListener('submit', addTransaction);

  // Chart toggle
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentChartType = btn.dataset.chart;
      toggleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderChart();
    });
  });

  // Month nav
  document.getElementById('prev-month').addEventListener('click', () => {
    viewDate.month--;
    if (viewDate.month < 0) { viewDate.month = 11; viewDate.year--; }
    renderAll();
  });

  document.getElementById('next-month').addEventListener('click', () => {
    const now = new Date();
    if (viewDate.year === now.getFullYear() && viewDate.month === now.getMonth()) return;
    viewDate.month++;
    if (viewDate.month > 11) { viewDate.month = 0; viewDate.year++; }
    renderAll();
  });

  // Search & filter
  searchEl.addEventListener('input', renderTransactionList);
  filterCatEl.addEventListener('change', renderTransactionList);
  filterTypeEl.addEventListener('change', () => {
    const type = filterTypeEl.value;
    const current = filterCatEl.value;

    filterCatEl.innerHTML = '<option value="all">All Categories</option>';
    CATEGORIES
      .filter(c => type === 'all' || c.type === type || c.type === 'both')
      .forEach(c => {
        const o = document.createElement('option');
        o.value = c.id;
        o.textContent = c.label;
        filterCatEl.appendChild(o);
      });

    // keep selection if still valid, else reset
    const stillValid = Array.from(filterCatEl.options).some(o => o.value === current);
    filterCatEl.value = stillValid ? current : 'all';

    renderTransactionList();
  });

  // Export
  document.getElementById('export-csv').addEventListener('click', exportCSV);
}

function switchView(viewId, btn) {
  views.forEach(v => v.classList.remove('active'));
  navItems.forEach(n => n.classList.remove('active'));
  document.getElementById(`view-${viewId}`).classList.add('active');
  if (btn) btn.classList.add('active');
  else {
    const targetBtn = document.querySelector(`.nav-item[data-view="${viewId}"]`);
    if (targetBtn) targetBtn.classList.add('active');
  }
}

function openModal() {
  modal.classList.add('open');
  updateCategoryForType();
  descEl.focus();
}

function closeModal() {
  modal.classList.remove('open');
  formEl.reset();
  setDefaultDate();
}

function updateCategoryForType() {
  catEl.innerHTML = '<option value="" disabled selected>Select category</option>';
  CATEGORIES
    .filter(c => c.type === activeType || c.type === 'both')
    .forEach(c => {
      const o = document.createElement('option');
      o.value = c.id;
      o.textContent = c.label;
      catEl.appendChild(o);
    });
  catEl.value = '';
}

// ── CRUD ──────────────────────────────────────
function addTransaction(e) {
  e.preventDefault();
  // take what the user typed, clean it up a bit
  const desc   = descEl.value.trim();
  const amount = parseFloat(amtEl.value);
  const date   = dateEl.value;
  const cat    = catEl.value;
  const notes  = notesEl.value.trim();

  if (!desc || !amount || !date || !cat) return;

  const finalAmount = activeType === 'expense' ? -Math.abs(amount) : Math.abs(amount);

  transactions.push({ id: Date.now(), description: desc, amount: finalAmount, date, category: cat, notes, type: activeType });
  save();
  renderAll();
  closeModal();
  showToast(`Transaction added ✓`);
}

function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  save();
  renderAll();
  showToast('Transaction removed');
}

function save() {
  localStorage.setItem('gastos_tx', JSON.stringify(transactions));
}

// ── Render All ────────────────────────────────
function renderAll() {
  updateMonthLabel();
  renderSummary();
  renderChart();
  renderRecentList();
  renderTransactionList();
}

// ── Month Label ───────────────────────────────
function updateMonthLabel() {
  const d = new Date(viewDate.year, viewDate.month);
  document.getElementById('month-label').textContent = d.toLocaleDateString('en-PH', { month: 'long', year: 'numeric' });
  const now = new Date();
  const atCurrent = viewDate.year === now.getFullYear() && viewDate.month === now.getMonth();
  const nextBtn = document.getElementById('next-month');
  nextBtn.style.opacity = atCurrent ? '0.25' : '1';
  nextBtn.style.cursor  = atCurrent ? 'default' : 'pointer';
}

// ── Summary ───────────────────────────────────
function renderSummary() {
  const monthly = getMonthlyTransactions();
  const income  = monthly.filter(t => t.amount > 0).reduce((a, t) => a + t.amount, 0);
  const expense = monthly.filter(t => t.amount < 0).reduce((a, t) => a + t.amount, 0);
  const balance = income + expense;

  document.getElementById('balance').textContent = fmt(balance);
  document.getElementById('income-amount').textContent = fmt(income);
  document.getElementById('expense-amount').textContent = fmt(Math.abs(expense));
  document.getElementById('tx-count').textContent = monthly.length;

  const trend = document.getElementById('balance-trend');
  trend.textContent = balance >= 0 ? '▲ Positive month' : '▼ Negative month';
  trend.style.color = balance >= 0 ? 'var(--income)' : 'var(--expense)';
}

// ── Chart ─────────────────────────────────────
function renderChart() {
  const monthly = getMonthlyTransactions().filter(t => t.amount < 0);
  const ctx = document.getElementById('category-chart').getContext('2d');
  const emptyEl = document.getElementById('chart-empty');
  const legendEl = document.getElementById('chart-legend');

  if (chartInstance) { chartInstance.destroy(); chartInstance = null; }

  if (monthly.length === 0) {
    emptyEl.classList.add('show');
    legendEl.innerHTML = '';
    return;
  }
  emptyEl.classList.remove('show');

  const byCategory = {};
  monthly.forEach(t => {
    byCategory[t.category] = (byCategory[t.category] || 0) + Math.abs(t.amount);
  });

  const labels = [];
  const data = [];
  const colors = [];

  Object.entries(byCategory).forEach(([catId, total]) => {
    const cat = CATEGORIES.find(c => c.id === catId);
    labels.push(cat ? cat.label : catId);
    data.push(total);
    colors.push(cat ? cat.color : '#6b7280');
  });

  const chartConfig = {
    type: currentChartType,
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colors.map(c => c + 'cc'),
        borderColor: colors,
        borderWidth: 1.5,
        borderRadius: currentChartType === 'bar' ? 6 : 0,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${fmt(ctx.raw)}`
          }
        }
      },
      ...(currentChartType === 'doughnut' ? { cutout: '65%' } : {}),
      ...(currentChartType === 'bar' ? {
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#6b6e80', font: { size: 11 } } },
          y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#6b6e80', font: { size: 11 }, callback: v => '₱' + v.toLocaleString() } }
        }
      } : {})
    }
  };

  chartInstance = new Chart(ctx, chartConfig);

  // Legend
  legendEl.innerHTML = labels.map((label, i) => `
    <div class="legend-item">
      <span class="legend-dot" style="background:${colors[i]}"></span>
      ${label}
    </div>
  `).join('');
}

// ── Recent List (dashboard) ───────────────────
function renderRecentList() {
  const listEl  = document.getElementById('recent-list');
  const emptyEl = document.getElementById('recent-empty');
  const monthly = getMonthlyTransactions().slice().reverse().slice(0, 6);

  listEl.innerHTML = '';
  if (monthly.length === 0) { emptyEl.classList.add('show'); return; }
  emptyEl.classList.remove('show');
  monthly.forEach(t => listEl.appendChild(createTxElement(t)));
}

// ── Full Transaction List ─────────────────────
function renderTransactionList() {
  const listEl  = document.getElementById('transaction-list');
  const emptyEl = document.getElementById('tx-empty');
  const search  = searchEl.value.toLowerCase();
  const catFilter  = filterCatEl.value;
  const typeFilter = filterTypeEl.value;

  let filtered = [...transactions].reverse().filter(t => {
    const matchSearch = t.description.toLowerCase().includes(search) ||
                        (t.notes && t.notes.toLowerCase().includes(search));
    const matchCat  = catFilter === 'all' || t.category === catFilter;
    const matchType = typeFilter === 'all' || t.type === typeFilter;
    return matchSearch && matchCat && matchType;
  });

  listEl.innerHTML = '';
  if (filtered.length === 0) { emptyEl.classList.add('show'); return; }
  emptyEl.classList.remove('show');
  filtered.forEach(t => listEl.appendChild(createTxElement(t, true)));
}

function createTxElement(t, showDelete = false) {
  const cat = CATEGORIES.find(c => c.id === t.category) || { color: '#6b7280', label: 'Other' };
  const li  = document.createElement('li');
  li.className = 'tx-item';

  const amountClass = t.amount >= 0 ? 'pos' : 'neg';
  const amountStr   = (t.amount >= 0 ? '+' : '') + fmt(t.amount);
  const initials    = cat.label.slice(0, 2).toUpperCase();

  li.innerHTML = `
    <div class="tx-icon" style="background:${cat.color}22; color:${cat.color};">${initials}</div>
    <div class="tx-info">
      <div class="tx-desc">${escapeHtml(t.description)}</div>
      <div class="tx-meta">${cat.label} · ${fmtDate(t.date)}${t.notes ? ' · ' + escapeHtml(t.notes) : ''}</div>
    </div>
    <div class="tx-amount ${amountClass}">${amountStr}</div>
    ${showDelete ? `<button class="tx-delete" onclick="deleteTransaction(${t.id})" title="Delete">✕</button>` : ''}
  `;
  return li;
}



// ── Helpers ───────────────────────────────────
function getMonthlyTransactions() {
  return transactions.filter(t => {
    const d = new Date(t.date);
    return d.getFullYear() === viewDate.year && d.getMonth() === viewDate.month;
  });
}

function escapeHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  setTimeout(() => toastEl.classList.remove('show'), 2500);
}

// ── Export CSV ────────────────────────────────
function exportCSV() {
  if (transactions.length === 0) { showToast('No transactions to export'); return; }
  const header = 'Date,Description,Category,Type,Amount,Notes';
  const rows = transactions.map(t => {
    const cat = CATEGORIES.find(c => c.id === t.category);
    return [
      t.date,
      `"${t.description.replace(/"/g,'""')}"`,
      cat ? cat.label : t.category,
      t.type,
      t.amount.toFixed(2),
      `"${(t.notes || '').replace(/"/g,'""')}"`
    ].join(',');
  });
  const csv  = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = `gastos-export-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('CSV exported ✓');
}

// ── Mobile keyboard fix ───────────────────────
(function() {
  if (window.visualViewport) {
    const adjust = () => {
      const offset = window.innerHeight - window.visualViewport.height;
      document.body.style.paddingBottom = offset > 0 ? offset + 'px' : '';
    };
    window.visualViewport.addEventListener('resize', adjust);
    window.addEventListener('orientationchange', () => setTimeout(adjust, 300));
    adjust();
  }
})();

// ── Start ─────────────────────────────────────
init();

// need to add responsiveness in mobile view, especially for the chart and summary sections. maybe stack them vertically and make the chart full width? also need to test the keyboard behavior on mobile when adding transactions, to ensure the form fields are accessible and not hidden behind the keyboard. also the transaction is nowhere to be found in mobile view.
