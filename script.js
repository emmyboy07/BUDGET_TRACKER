// DOM Elements
const totalBalanceEl = document.getElementById('total-balance');
const entryDescription = document.getElementById('entry-description');
const entryAmount = document.getElementById('entry-amount');
const entryType = document.getElementById('entry-type');
const entryCategory = document.getElementById('entry-category');
const addEntryBtn = document.getElementById('add-entry-btn');
const transactionList = document.getElementById('transaction-list');
const expenseChartCanvas = document.getElementById('expense-chart');

// State
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let expenseChart;

// Utility function to format numbers as currency
function formatCurrency(amount) {
  return `₦${parseFloat(amount).toFixed(2)}`;
}

// Calculate and update the total balance
function updateBalance() {
  const total = transactions.reduce((acc, transaction) => {
    return transaction.type === 'income' ? acc + transaction.amount : acc - transaction.amount;
  }, 0);

  totalBalanceEl.textContent = formatCurrency(total);
}

// Render the transaction list
function renderTransactions() {
  transactionList.innerHTML = '';
  transactions.forEach((transaction, index) => {
    const li = document.createElement('li');
    li.className = transaction.type;
    li.innerHTML = `
      ${transaction.description} - ${transaction.category} 
      <span>${formatCurrency(transaction.amount)}</span>
      <button onclick="deleteTransaction(${index})">X</button>
    `;
    transactionList.appendChild(li);
  });
}

// Add a new transaction
function addTransaction() {
  const description = entryDescription.value.trim();
  const amount = parseFloat(entryAmount.value.trim());
  const type = entryType.value;
  const category = entryCategory.value;

  if (description === '' || isNaN(amount) || amount <= 0) {
    alert('Please enter valid details.');
    return;
  }

  transactions.push({ description, amount, type, category });
  localStorage.setItem('transactions', JSON.stringify(transactions));

  entryDescription.value = '';
  entryAmount.value = '';

  renderTransactions();
  updateBalance();
  updateChart();
}

// Delete a transaction
function deleteTransaction(index) {
  transactions.splice(index, 1);
  localStorage.setItem('transactions', JSON.stringify(transactions));

  renderTransactions();
  updateBalance();
  updateChart();
}

// Create or update the expense chart
function updateChart() {
  const expenseData = transactions
    .filter(transaction => transaction.type === 'expense')
    .reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {});

  const labels = Object.keys(expenseData);
  const data = Object.values(expenseData);

  if (expenseChart) {
    expenseChart.destroy();
  }

  expenseChart = new Chart(expenseChartCanvas, {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        label: 'Expenses',
        data,
        backgroundColor: ['#ff6384', '#36a2eb', '#ffcd56', '#4caf50', '#9c27b0'],
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
      },
    },
  });
}

// Event Listeners
addEntryBtn.addEventListener('click', addTransaction);

// Initialize the app
renderTransactions();
updateBalance();
updateChart();
