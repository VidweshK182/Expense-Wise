// client/src/pages/Register.js
import React, { useState, useContext, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });

  const { name, email, password, password2 } = formData;

  const navigate = useNavigate();
  const { register, isLoading, user, error } = useContext(AuthContext);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Display error if present
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (password !== password2) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      await register({ name, email, password });
      // Navigation happens in useEffect when user state changes
    } catch (error) {
      // Error is handled in AuthContext and displayed via useEffect
    }
  };

  return (
    <>
      <section className="heading">
        <h1>
          <FaUser /> Register
        </h1>
        <p>Please create an account</p>
      </section>

      <section className="form">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={name}
              placeholder="Enter your name"
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={email}
              placeholder="Enter your email"
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={password}
              placeholder="Enter password"
              onChange={onChange}
              required
              minLength="6"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              id="password2"
              name="password2"
              value={password2}
              placeholder="Confirm password"
              onChange={onChange}
              required
              minLength="6"
            />
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-block" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Register'}
            </button>
          </div>
        </form>
      </section>
    </>
  );
};

export default Register;