// client/src/pages/Dashboard.js
import React, { useState, useContext } from 'react';
import { FaPlus, FaChartBar } from 'react-icons/fa';
import DashboardStats from '../components/DashboardStats';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import TransactionContext from '../context/TransactionContext';

const Dashboard = () => {
  const [editTransaction, setEditTransaction] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { stats, isLoading } = useContext(TransactionContext);

  const toggleForm = () => {
    setShowForm(!showForm);
    if (!showForm) {
      setEditTransaction(null);
    }
  };

  return (
    <>
      <div className="dashboard-header">
        <div className="balance-summary">
          <h2>Current Balance</h2>
          <h1 className={stats.balance >= 0 ? 'positive' : 'negative'}>
            ₹{stats.balance.toFixed(2)}
          </h1>
          <div className="balance-details">
            <div className="income-summary">
              <span>Total Income</span>
              <span className="income">₹{stats.totalIncome.toFixed(2)}</span>
            </div>
            <div className="expense-summary">
              <span>Total Expenses</span>
              <span className="expense">₹{stats.totalExpense.toFixed(2)}</span>
            </div>
          </div>
        </div>
        <div className="dashboard-actions">
          <button 
            className="btn" 
            onClick={toggleForm}
          >
            <FaPlus /> {showForm ? 'Hide Form' : 'Add Transaction'}
          </button>
        </div>
      </div>

      {showForm && (
        <TransactionForm 
          editTransaction={editTransaction} 
          setEditTransaction={setEditTransaction} 
          onComplete={() => setShowForm(false)}
        />
      )}

      <div className="dashboard-content">
        <div className="charts-section">
          <h2><FaChartBar /> Financial Overview</h2>
          <DashboardStats />
        </div>
        <div className="transactions-section">
          <TransactionList setEditTransaction={(transaction) => {
            setEditTransaction(transaction);
            setShowForm(true);
          }} />
        </div>
      </div>
    </>
  );
};

export default Dashboard;