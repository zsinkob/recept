import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

interface AuthContextValue {
  token: string | null;
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue>({
  token: null,
  user: null,
  login: async () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      // optionally fetch user
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await axios.post('/api/auth/login', { email, password });
    if (res.data?.access_token) {
      setToken(res.data.access_token);
      setUser(res.data.user || null);
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return <AuthContext.Provider value={{ token, user, login, logout }}>{children}</AuthContext.Provider>;
};
