const form = document.getElementById('expenseForm');
const titleInput = document.getElementById('title');
const amountInput = document.getElementById('amount');
const expenseList = document.getElementById('expenseList');
const totalDisplay = document.getElementById('total');

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let editId = null;

// Focus input
window.onload = () => {
  titleInput.focus();
  renderExpenses();
};

// Mock API fetch
fetch('https://jsonplaceholder.typicode.com/posts?_limit=2')
  .then(res => res.json())
  .then(data => {
    if (expenses.length === 0) {
      expenses = data.map((item, index) => ({
        id: item.id,
        title: `Sample Expense ${index + 1}`,
        amount: Math.floor(Math.random() * 1000)
      }));
      saveAndRender();
    }
  });

form.addEventListener('submit', function(e) {
  e.preventDefault();

  const title = titleInput.value.trim();
  const amount = Number(amountInput.value);

  if (title === '' || amount <= 0) return;

  if (editId) {
    expenses = expenses.map(exp =>
      exp.id === editId ? { ...exp, title, amount } : exp
    );
    editId = null;
  } else {
    expenses.push({
      id: Date.now(),
      title,
      amount
    });
  }

  titleInput.value = '';
  amountInput.value = '';
  titleInput.focus();

  saveAndRender();
});

function renderExpenses() {
  expenseList.innerHTML = '';

  expenses.forEach(exp => {
    const div = document.createElement('div');
    div.className = 'expense-item';

    div.innerHTML = `
      <span>${exp.title} - Rs ${exp.amount}</span>
      <div class="actions">
        <button class="edit" onclick="editExpense(${exp.id})">Edit</button>
        <button class="delete" onclick="deleteExpense(${exp.id})">Delete</button>
      </div>
    `;

    expenseList.appendChild(div);
  });

  calculateTotal();
}

function calculateTotal() {
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  totalDisplay.textContent = `Total: Rs ${total}`;
}

function deleteExpense(id) {
  expenses = expenses.filter(exp => exp.id !== id);
  saveAndRender();
}

function editExpense(id) {
  const exp = expenses.find(e => e.id === id);
  titleInput.value = exp.title;
  amountInput.value = exp.amount;
  editId = id;
  titleInput.focus();
}

function saveAndRender() {
  localStorage.setItem('expenses', JSON.stringify(expenses));
  renderExpenses();
}