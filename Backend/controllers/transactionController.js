// server/controllers/transactionController.js
const Transaction = require('../models/Transaction');

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({ date: -1 });
    
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add transaction
// @route   POST /api/transactions
// @access  Private
const addTransaction = async (req, res) => {
  try {
    const { title, amount, type, date, reference } = req.body;
    
    const transaction = await Transaction.create({
      user: req.user._id,
      title,
      amount,
      type,
      date,
      reference
    });
    
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    // Check if user owns the transaction
    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    await Transaction.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Transaction removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
const updateTransaction = async (req, res) => {
  try {
    const { title, amount, type, date, reference } = req.body;
    
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    // Check if user owns the transaction
    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    transaction.title = title || transaction.title;
    transaction.amount = amount || transaction.amount;
    transaction.type = type || transaction.type;
    transaction.date = date || transaction.date;
    transaction.reference = reference || transaction.reference;
    
    const updatedTransaction = await transaction.save();
    
    res.json(updatedTransaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get transaction stats
// @route   GET /api/transactions/stats
// @access  Private
const getTransactionStats = async (req, res) => {
  try {
    // Get total income
    const totalIncome = await Transaction.aggregate([
      { $match: { user: req.user._id, type: 'income' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    // Get total expense
    const totalExpense = await Transaction.aggregate([
      { $match: { user: req.user._id, type: 'expense' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    // Get monthly transactions
    const monthlyData = await Transaction.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: { 
            month: { $month: '$date' },
            year: { $year: '$date' },
            type: '$type'
          },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    
    // Get transactions by category
    const expensesByTitle = await Transaction.aggregate([
      { $match: { user: req.user._id, type: 'expense' } },
      { $group: { _id: '$title', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } }
    ]);
    
    res.json({
      totalIncome: totalIncome[0]?.total || 0,
      totalExpense: totalExpense[0]?.total || 0,
      balance: (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
      monthlyData,
      expensesByTitle
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTransactions,
  addTransaction,
  deleteTransaction,
  updateTransaction,
  getTransactionStats
};