import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [filterCategory, setFilterCategory] = useState('All');

  // Load saved expenses when the app first opens
  useEffect(() => {
    const saved = localStorage.getItem('expenses');
    if (saved) {
      setExpenses(JSON.parse(saved));
    }
  }, []);

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  function handleAddExpense() {
    if (description === '' || amount === '' || date === '') {
      return;
    }

    if (editingId === null) {
      const newExpense = {
        id: Date.now(),
        description: description,
        amount: amount,
        category: category,
        date: date
      };
      setExpenses([...expenses, newExpense]);
    } else {
      const updatedExpenses = expenses.map((expense) => {
        if (expense.id === editingId) {
          return { id: editingId, description, amount, category, date };
        }
        return expense;
      });
      setExpenses(updatedExpenses);
      setEditingId(null);
    }

    setDescription('');
    setAmount('');
    setDate('');
  }

  function handleDeleteExpense(id) {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  }

  function handleEditExpense(expense) {
    setDescription(expense.description);
    setAmount(expense.amount);
    setCategory(expense.category);
    setDate(expense.date);
    setEditingId(expense.id);
  }

  const expensesToShow =
    filterCategory === 'All'
      ? expenses
      : expenses.filter((expense) => expense.category === filterCategory);

  const total = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);

  const buttonLabel = editingId === null ? 'Add Expense' : 'Update Expense';

  return (
    <div className="app">
      <h1>Track My Pocket</h1>

      <h2>Total: ₹{total}</h2>

      <div className="form">
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Shopping">Shopping</option>
          <option value="Bills">Bills</option>
          <option value="Other">Other</option>
        </select>
        <button onClick={handleAddExpense}>{buttonLabel}</button>
      </div>

      <div className="filter">
        <label>Filter by category: </label>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="All">All</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Shopping">Shopping</option>
          <option value="Bills">Bills</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <ul className="expense-list">
        {expensesToShow.map((expense) => (
          <li key={expense.id}>
            <span>
              [{expense.category}] {expense.description} — ₹{expense.amount} ({expense.date})
            </span>
            <button onClick={() => handleEditExpense(expense)}>Edit</button>
            <button onClick={() => handleDeleteExpense(expense.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;