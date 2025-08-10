// client/src/components/DashboardStats.js
import React, { useContext } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import TransactionContext from '../context/TransactionContext';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DashboardStats = () => {
  const { stats, isLoading } = useContext(TransactionContext);
  
  if (isLoading) {
    return (
      <div className="stats-loading">
        <div className="spinner"></div>
        <p>Loading your financial data...</p>
      </div>
    );
  }

  // Process monthly data for chart
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentYear = new Date().getFullYear();
  
  // Initialize data for all months
  const monthlyIncome = Array(12).fill(0);
  const monthlyExpense = Array(12).fill(0);
  
  // Fill in data from stats
  stats.monthlyData.forEach(item => {
    if (item._id.year === currentYear) {
      const monthIndex = item._id.month - 1;
      if (item._id.type === 'income') {
        monthlyIncome[monthIndex] = item.total;
      } else {
        monthlyExpense[monthIndex] = item.total;
      }
    }
  });

  // Bar chart data
  const barData = {
    labels: months,
    datasets: [
      {
        label: 'Income',
        data: monthlyIncome,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Expenses',
        data: monthlyExpense,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Bar chart options
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 12,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: `Monthly Overview (₹{currentYear})`,
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'IND'
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '₹' + value;
          }
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
  };

  // Check if we have expense data for categories
  const hasExpenseCategories = stats.expensesByTitle && stats.expensesByTitle.length > 0;

  // Doughnut chart data
  const doughnutData = hasExpenseCategories ? {
    labels: stats.expensesByTitle.slice(0, 5).map(item => item._id),
    datasets: [
      {
        data: stats.expensesByTitle.slice(0, 5).map(item => item.total),
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  } : null;

  // Doughnut chart options
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 12,
          font: { size: 11 }
        }
      },
      title: {
        display: true,
        text: 'Top Expense Categories',
        font: { size: 16 }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const percentage = ((value / stats.totalExpense) * 100).toFixed(1);
            return `₹{label}: ₹{value.toFixed(2)} (₹{percentage}%)`;
          }
        }
      }
    },
  };

  return (
    <div className="dashboard-stats-container">
      <div className="charts-container">
        <div className="chart-wrapper bar-chart-wrapper">
          <div className="chart-inner">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
        
        {hasExpenseCategories && (
          <div className="chart-wrapper doughnut-chart-wrapper">
            <div className="chart-inner">
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
          </div>
        )}
      </div>
      
      {!hasExpenseCategories && (
        <div className="no-data-message">
          <p>Add some expense transactions to see category breakdown</p>
        </div>
      )}
    </div>
  );
};

export default DashboardStats;