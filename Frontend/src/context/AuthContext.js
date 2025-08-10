// client/src/context/AuthContext.js
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load user from localStorage on initial load
  useEffect(() => {
    const checkUserLoggedIn = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        // Set auth token for axios
        if (parsedUser && parsedUser.token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
        }
        setUser(parsedUser);
      }
    };
    
    checkUserLoggedIn();
  }, []);

  // Register user
  const register = async (userData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${API_URL}/api/users`, userData);
      
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        // Set auth token for axios
        if (response.data.token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        }
        setUser(response.data);
      }
      
      setIsLoading(false);
      return response.data;
    } catch (error) {
      setIsLoading(false);
      const message = error.response?.data?.message || 'Registration failed';
      setError(message);
      throw new Error(message);
    }
  };

  // Login user
  const login = async (userData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${API_URL}/api/users/login`, userData);
      
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        // Set auth token for axios
        if (response.data.token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        }
        setUser(response.data);
      }
      
      setIsLoading(false);
      return response.data;
    } catch (error) {
      setIsLoading(false);
      const message = error.response?.data?.message || 'Login failed';
      setError(message);
      throw new Error(message);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      error, 
      register, 
      login, 
      logout,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;