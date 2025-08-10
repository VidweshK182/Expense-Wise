// client/src/components/Header.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignInAlt, FaSignOutAlt, FaUser, FaMoneyBillWave } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <FaMoneyBillWave /> ExpenseEase
        </Link>
      </div>
      <ul>
        {user ? (
          <>
            <li>
              <Link to="/profile">
                <FaUser /> {user.name}
              </Link>
            </li>
            <li>
              <button className="btn logout-btn" onClick={onLogout}>
                <FaSignOutAlt /> Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login" className="nav-link">
                <FaSignInAlt /> Login
              </Link>
            </li>
            <li>
              <Link to="/register" className="nav-link">
                <FaUser /> Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </header>
  );
};

export default Header;