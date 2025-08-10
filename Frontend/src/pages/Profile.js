// client/src/pages/Profile.js
import React, { useContext } from 'react';
import { FaUser } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import TransactionContext from '../context/TransactionContext';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const { stats } = useContext(TransactionContext);

  return (
    <>
      <section className="heading">
        <h1>
          <FaUser /> Profile
        </h1>
        <p>Your account information</p>
      </section>

      <section className="profile">
        <div className="profile-details">
          <div className="profile-item">
            <h3>Name</h3>
            <p>{user.name}</p>
          </div>
          <div className="profile-item">
            <h3>Email</h3>
            <p>{user.email}</p>
          </div>
          <div className="profile-item">
            <h3>Account Balance</h3>
            <p className={stats.balance >= 0 ? 'positive' : 'negative'}>
              ₹{stats.balance.toFixed(2)}
            </p>
          </div>
          <div className="profile-stats">
            <div className="stat-item">
              <h4>Total Income</h4>
              <p className="income">₹{stats.totalIncome.toFixed(2)}</p>
            </div>
            <div className="stat-item">
              <h4>Total Expenses</h4>
              <p className="expense">₹{stats.totalExpense.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Profile;