// server/routes/transactions.js
const express = require('express');
const router = express.Router();
const { 
  getTransactions, 
  addTransaction, 
  deleteTransaction, 
  updateTransaction,
  getTransactionStats 
} = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getTransactions)
  .post(protect, addTransaction);

router.route('/:id')
  .delete(protect, deleteTransaction)
  .put(protect, updateTransaction);

router.get('/stats', protect, getTransactionStats);

module.exports = router;