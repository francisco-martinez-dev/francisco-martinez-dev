const STORAGE_KEY = 'fintrack_transactions';
const LOW_BALANCE_THRESHOLD = 100;

let transactions = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

const typeLabels = {
  deposit: 'Depósito',
  withdrawal: 'Retiro',
  transfer: 'Transferencia'
};

function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

function getBalance() {
  return transactions.reduce((acc, t) => {
    if (t.type === 'deposit') return acc + t.amount;
    return acc - t.amount;
  }, 0);
}

function getTotals() {
  return transactions.reduce((acc, t) => {
    acc[t.type] = (acc[t.type] || 0) + t.amount;
    return acc;
  }, {});
}

function formatCurrency(amount) {
  return '$' + amount.toFixed(2);
}

function getToday() {
  return new Date().toLocaleDateString('es-SV', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });
}

function updateUI(filter = 'all') {
  const balance = getBalance();
  const totals = getTotals();

  // Saldo
  document.getElementById('balance').textContent = formatCurrency(balance);

  // Alerta de saldo bajo
  const alert = document.getElementById('alert');
  alert.classList.toggle('hidden', balance === 0 || balance >= LOW_BALANCE_THRESHOLD);

  // Tarjetas de totales
  document.getElementById('totalDeposits').textContent = formatCurrency(totals.deposit || 0);
  document.getElementById('totalWithdrawals').textContent = formatCurrency(totals.withdrawal || 0);
  document.getElementById('totalTransfers').textContent = formatCurrency(totals.transfer || 0);

  // Historial filtrado
  const filtered = filter === 'all'
    ? transactions
    : transactions.filter(t => t.type === filter);

  const list = document.getElementById('transactionList');

  if (filtered.length === 0) {
    list.innerHTML = '<div class="empty-state">No hay transacciones para mostrar.</div>';
  } else {
    list.innerHTML = [...filtered].reverse().map(t => `
      <div class="transaction-item ${t.type}">
        <div class="transaction-info">
          <span class="transaction-desc">${t.description || typeLabels[t.type]}</span>
          <span class="transaction-meta">${typeLabels[t.type]} · ${t.date}</span>
        </div>
        <span class="transaction-amount ${t.type}">
          ${t.type === 'deposit' ? '+' : '-'}${formatCurrency(t.amount)}
        </span>
      </div>
    `).join('');
  }

  // Gráfica
  drawChart(transactions);
}

// Registrar transacción
document.getElementById('addBtn').addEventListener('click', () => {
  const type = document.getElementById('type').value;
  const description = document.getElementById('description').value.trim();
  const amount = parseFloat(document.getElementById('amount').value);

  if (!amount || amount <= 0) {
    alert('Por favor ingresá un monto válido.');
    return;
  }

  const transaction = {
    id: Date.now(),
    type,
    description: description || typeLabels[type],
    amount,
    date: getToday()
  };

  transactions.push(transaction);
  saveToStorage();
  updateUI(activeFilter);

  document.getElementById('description').value = '';
  document.getElementById('amount').value = '';
});

// Filtros
let activeFilter = 'all';

document.querySelectorAll('.filter').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    updateUI(activeFilter);
  });
});

// Inicializar
updateUI();