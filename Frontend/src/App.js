// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import { TransactionProvider } from './context/TransactionContext';
import './index.css'; // Make sure this is imported

function App() {
  return (
    <AuthProvider>
      <TransactionProvider>
        <Router>
          <div className="container">
            <Header />
            <Routes>
              <Route path="/" element={<PrivateRoute component={Dashboard} />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<PrivateRoute component={Profile} />} />
            </Routes>
          </div>
          <ToastContainer position="top-right" autoClose={3000} />
        </Router>
      </TransactionProvider>
    </AuthProvider>
  );
}

export default App;