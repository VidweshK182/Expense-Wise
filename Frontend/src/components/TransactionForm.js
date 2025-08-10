// client/src/components/TransactionForm.js
import React, { useState, useContext, useEffect } from 'react';
import { FaSave, FaTimes, FaMoneyBillWave } from 'react-icons/fa';
import TransactionContext from '../context/TransactionContext';
import { toast } from 'react-toastify';

const TransactionForm = ({ editTransaction, setEditTransaction, onComplete }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'expense',
    date: new Date().toISOString().split('T')[0], // Format: YYYY-MM-DD
    reference: ''
  });

  const { addTransaction, updateTransaction, isLoading } = useContext(TransactionContext);

  useEffect(() => {
    if (editTransaction) {
      // Format the date as YYYY-MM-DD for the date input
      const formattedDate = new Date(editTransaction.date).toISOString().split('T')[0];
      
      setFormData({
        title: editTransaction.title,
        amount: Math.abs(editTransaction.amount),
        type: editTransaction.type,
        date: formattedDate,
        reference: editTransaction.reference || ''
      });
    }
  }, [editTransaction]);

  const { title, amount, type, date, reference } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!title || !amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editTransaction) {
        await updateTransaction(editTransaction._id, formData);
        setEditTransaction(null);
        toast.success('Transaction updated successfully');
      } else {
        await addTransaction(formData);
        toast.success('Transaction added successfully');
      }

      setFormData({
        title: '',
        amount: '',
        type: 'expense',
        date: new Date().toISOString().split('T')[0],
        reference: ''
      });
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error processing transaction');
    }
  };

  const cancelEdit = () => {
    setEditTransaction(null);
    setFormData({
      title: '',
      amount: '',
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
      reference: ''
    });
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="transaction-form-card">
      <div className="form-header">
        <h2>
          <FaMoneyBillWave /> {editTransaction ? 'Edit Transaction' : 'Add Transaction'}
        </h2>
      </div>
      
      <form onSubmit={onSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title">Title*</label>
            <input
              type="text"
              name="title"
              id="title"
              value={title}
              onChange={onChange}
              placeholder="e.g. Grocery shopping"
              required
              className="form-control"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="amount">Amount*</label>
            <div className="amount-input">
              <span className="currency-symbol">₹</span>
              <input
                type="number"
                name="amount"
                id="amount"
                value={amount}
                onChange={onChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
                className="form-control"
              />
            </div>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="type">Type*</label>
            <div className="type-selector">
              <label className={`type-option ₹{type === 'expense' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="type"
                  value="expense"
                  checked={type === 'expense'}
                  onChange={onChange}
                />
                <span>Expense</span>
              </label>
              <label className={`type-option ₹{type === 'income' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="type"
                  value="income"
                  checked={type === 'income'}
                  onChange={onChange}
                />
                <span>Income</span>
              </label>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="date">Date*</label>
            <input
              type="date"
              name="date"
              id="date"
              value={date}
              onChange={onChange}
              className="form-control date-input"
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="reference">Reference (Optional)</label>
          <input
            type="text"
            name="reference"
            id="reference"
            value={reference}
            onChange={onChange}
            placeholder="e.g. Invoice #1234"
            className="form-control"
          />
        </div>
        
        <div className="form-buttons">
          <button 
            type="button" 
            className="btn btn-cancel" 
            onClick={cancelEdit}
            disabled={isLoading}
          >
            <FaTimes /> Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-submit"
            disabled={isLoading}
          >
            <FaSave /> {isLoading ? 'Processing...' : (editTransaction ? 'Update' : 'Save')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;