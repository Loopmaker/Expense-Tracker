const balanceEl = document.getElementById('balance');
const incomeAmountEl = document.getElementById('income-amount');
const expenseAmountEl = document.getElementById('expense-amount');
const transactionListEl = document.getElementById('transaction-list');
const formEl = document.getElementById('transaction-form');
const amountInputEl = document.getElementById('amount');
const descriptionEl = document.getElementById('description');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

formEl.addEventListener('submit', addTransaction);

function addTransaction(e) {
  e.preventDefault();

  const description = descriptionEl.value.trim();
  const amount = parseFloat(amountInputEl.value.trim());

  transactions.push({
    id: Date.now(),
    description,
    amount
  });
  localStorage.setItem('transactions', JSON.stringify(transactions));

  updateTransactions();
  updateSummary();
  formEl.reset();
}

function updateTransactions() {
  transactionListEl.innerHTML = '';
  const sortedTransactions = [...transactions].reverse();
  sortedTransactions.forEach(transaction => {
    const transactionEl = createdTransactionElement(transaction);
    transactionListEl.appendChild(transactionEl);
  })
}

function createdTransactionElement(transaction) {
  const li = document.createElement('li');
  li.classList.add('transaction');
  li.classList.add(transaction.amount < 0 ? 'expense' : 'income');
  // update amount
  li.innerHTML = `
    <span>${transaction.description}</span>
    <span>${formatAmount(transaction.amount)}</span>
    <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">x</button>
  `;
  return li;
}

function updateSummary() {
  const balance = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
  const income = transactions.filter(t => t.amount > 0).reduce((acc, transaction) => acc + transaction.amount, 0);
  const expense = transactions.filter(t => t.amount < 0).reduce((acc, transaction) => acc + transaction.amount, 0);
  balanceEl.textContent = formatAmount(balance);
  incomeAmountEl.textContent = formatAmount(income);
  expenseAmountEl.textContent = formatAmount(expense);
}

function formatAmount(amount) {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);
}

function deleteTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  localStorage.setItem('transactions', JSON.stringify(transactions));
  updateTransactions();
  updateSummary();
}

updateSummary();
updateTransactions();

(function() {
  const inputs = document.querySelectorAll('input, textarea, select');

  inputs.forEach(inp => {
    inp.addEventListener('focus', () => {
      setTimeout(() => {
        try { inp.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e) {}
      }, 300);
    });
  });

  if (window.visualViewport) {
    const adjustPadding = () => {
      const offset = window.innerHeight - window.visualViewport.height;
      document.body.style.paddingBottom = offset > 0 ? offset + 'px' : '';
    };

    window.visualViewport.addEventListener('resize', adjustPadding);
    window.addEventListener('orientationchange', () => setTimeout(adjustPadding, 300));
    adjustPadding();
  }
})();