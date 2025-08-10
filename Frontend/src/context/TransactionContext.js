// client/src/context/TransactionContext.js
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    monthlyData: [],
    expensesByTitle: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user } = useContext(AuthContext);

  // Set auth token for axios
  const setAuthToken = () => {
    if (user && user.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // Memoized version of getTransactions using useCallback
  const getTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setAuthToken();

    try {
      const response = await axios.get(`${API_URL}/api/transactions`);
      setTransactions(response.data);
      setIsLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching transactions');
      setIsLoading(false);
      throw error;
    }
  }, [user]); // Only depends on `user` because of setAuthToken

  // Memoized version of getTransactionStats using useCallback
  const getTransactionStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setAuthToken();

    try {
      const response = await axios.get(`${API_URL}/api/transactions/stats`);
      setStats(response.data);
      setIsLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching stats');
      setIsLoading(false);
      throw error;
    }
  }, [user]); // Only depends on `user` because of setAuthToken

  // Add transaction
  const addTransaction = async (transactionData) => {
    setIsLoading(true);
    setError(null);
    setAuthToken();

    try {
      const response = await axios.post(`${API_URL}/api/transactions`, transactionData);
      setTransactions([response.data, ...transactions]);
      await getTransactionStats(); // Refresh stats
      setIsLoading(false);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Error adding transaction');
      setIsLoading(false);
      throw error;
    }
  };

  // Delete transaction
  const deleteTransaction = async (id) => {
    setIsLoading(true);
    setError(null);
    setAuthToken();

    try {
      await axios.delete(`${API_URL}/api/transactions/${id}`);
      setTransactions(transactions.filter(transaction => transaction._id !== id));
      await getTransactionStats(); // Refresh stats
      setIsLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Error deleting transaction');
      setIsLoading(false);
      throw error;
    }
  };

  // Update transaction
  const updateTransaction = async (id, transactionData) => {
    setIsLoading(true);
    setError(null);
    setAuthToken();

    try {
      const response = await axios.put(`${API_URL}/api/transactions/${id}`, transactionData);
      setTransactions(
        transactions.map(transaction => 
          transaction._id === id ? response.data : transaction
        )
      );
      await getTransactionStats(); // Refresh stats
      setIsLoading(false);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating transaction');
      setIsLoading(false);
      throw error;
    }
  };

  // Load transactions and stats when user changes
  useEffect(() => {
    if (user) {
      getTransactions();
      getTransactionStats();
    } else {
      setTransactions([]);
      setStats({
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
        monthlyData: [],
        expensesByTitle: []
      });
    }
  }, [user, getTransactions, getTransactionStats]); // Added getTransactions and getTransactionStats to dependencies

  return (
    <TransactionContext.Provider 
      value={{ 
        transactions, 
        stats,
        isLoading, 
        error, 
        getTransactions, 
        getTransactionStats,
        addTransaction,
        deleteTransaction,
        updateTransaction
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export default TransactionContext;