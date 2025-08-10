// client/src/components/TransactionItem.js
import React, { useContext, useState } from 'react';
import { FaTrash, FaEdit, FaCalendarAlt, FaInfoCircle } from 'react-icons/fa';
import { format } from 'date-fns';
import TransactionContext from '../context/TransactionContext';
import { toast } from 'react-toastify';

const TransactionItem = ({ transaction, onEdit }) => {
  const { deleteTransaction, isLoading } = useContext(TransactionContext);
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  const handleDelete = async () => {
    if (confirmDelete) {
      try {
        await deleteTransaction(transaction._id);
        toast.success('Transaction deleted');
      } catch (error) {
        toast.error('Error deleting transaction');
      }
      setConfirmDelete(false);
    } else {
      setConfirmDelete(true);
      // Auto reset after 3 seconds
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  return (
    <div className={`transaction ${transaction.type}`}>
      <div className="transaction-content">
        <div className="transaction-info">
          <h4>{transaction.title}</h4>
          <div className="transaction-details">
            <span className="transaction-date">
              <FaCalendarAlt /> {format(new Date(transaction.date), 'MMM d, yyyy')}
            </span>
            {transaction.reference && (
              <span className="transaction-reference">
                <FaInfoCircle /> {transaction.reference}
              </span>
            )}
          </div>
        </div>
        <div className="transaction-amount-container">
          <span className={`transaction-amount ${transaction.type}`}>
            {transaction.type === 'expense' ? '-' : '+'}₹ {Math.abs(transaction.amount).toFixed(2)}
          </span>
          <div className="action-buttons">
            <button 
              className="action-btn edit-btn" 
              onClick={() => onEdit(transaction)}
              disabled={isLoading}
              aria-label="Edit transaction"
            >
              <FaEdit />
            </button>
            <button 
              className={`action-btn delete-btn ${confirmDelete ? 'confirm' : ''}`}
              onClick={handleDelete}
              disabled={isLoading}
              aria-label={confirmDelete ? "Confirm delete" : "Delete transaction"}
            >
              <FaTrash />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;