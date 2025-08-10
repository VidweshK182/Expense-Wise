// client/src/components/TransactionList.js
import React, { useContext, useState, useMemo } from 'react';
import { FaSort, FaSortUp, FaSortDown, FaSearch, FaFilter } from 'react-icons/fa';
import TransactionItem from './TransactionItem';
import TransactionContext from '../context/TransactionContext';

const TransactionList = ({ setEditTransaction }) => {
  const { transactions, isLoading } = useContext(TransactionContext);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  // Handle filtering and searching
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(transaction => {
        const matchesFilter = filter === 'all' || transaction.type === filter;
        const matchesSearch = searchTerm === '' || 
          transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (transaction.reference && transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesFilter && matchesSearch;
      })
      .sort((a, b) => {
        if (sortConfig.key === 'date') {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
        } else if (sortConfig.key === 'amount') {
          return sortConfig.direction === 'asc' ? a.amount - b.amount : b.amount - a.amount;
        } else if (sortConfig.key === 'title') {
          const titleA = a.title.toLowerCase();
          const titleB = b.title.toLowerCase();
          return sortConfig.direction === 'asc' 
            ? titleA.localeCompare(titleB) 
            : titleB.localeCompare(titleA);
        }
        return 0;
      });
  }, [transactions, filter, searchTerm, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnName) => {
    if (sortConfig.key !== columnName) {
      return <FaSort />;
    }
    return sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />;
  };

  if (isLoading) {
    return (
      <div className="transaction-list-loading">
        <div className="spinner"></div>
        <p>Loading transactions...</p>
      </div>
    );
  }

  return (
    <div className="transaction-list-container">
      <div className="transaction-list-header">
        <h2>Transactions</h2>
        <div className="transaction-search">
          <div className="search-input-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>

      <div className="filter-sort-bar">
        <div className="filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-btn income-filter ${filter === 'income' ? 'active' : ''}`}
            onClick={() => setFilter('income')}
          >
            Income
          </button>
          <button 
            className={`filter-btn expense-filter ${filter === 'expense' ? 'active' : ''}`}
            onClick={() => setFilter('expense')}
          >
            Expenses
          </button>
        </div>
        
        <div className="sort-controls">
          <span className="sort-label"><FaFilter /> Sort by:</span>
          <button 
            className={`sort-btn ${sortConfig.key === 'date' ? 'active' : ''}`}
            onClick={() => requestSort('date')}
          >
            Date {sortConfig.key === 'date' && (
              sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
            )}
          </button>
          <button 
            className={`sort-btn ${sortConfig.key === 'amount' ? 'active' : ''}`}
            onClick={() => requestSort('amount')}
          >
            Amount {sortConfig.key === 'amount' && (
              sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
            )}
          </button>
          <button 
            className={`sort-btn ${sortConfig.key === 'title' ? 'active' : ''}`}
            onClick={() => requestSort('title')}
          >
            Title {sortConfig.key === 'title' && (
              sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
            )}
          </button>
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="no-transactions">
          {searchTerm || filter !== 'all' ? (
            <p>No matching transactions found. Try changing your filters.</p>
          ) : (
            <p>No transactions recorded yet. Add your first transaction!</p>
          )}
        </div>
      ) : (
        <div className="transaction-items">
          {filteredTransactions.map(transaction => (
            <TransactionItem 
              key={transaction._id} 
              transaction={transaction} 
              onEdit={setEditTransaction}
            />
          ))}
        </div>
      )}
      
      {filteredTransactions.length > 0 && (
        <div className="transaction-count">
          Showing {filteredTransactions.length} of {transactions.length} transactions
        </div>
      )}
    </div>
  );
};

export default TransactionList;