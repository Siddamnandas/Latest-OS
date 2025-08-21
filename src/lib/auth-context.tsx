'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  partner_role: string;
  couple_id: string;
  last_login?: Date;
}

interface Couple {
  id: string;
  partner_a_name: string;
  partner_b_name: string;
  anniversary_date?: Date;
  city: string;
  region: string;
  language: string;
  cultural_preferences?: any;
  rasa_balance?: any;
}

interface AuthContextType {
  user: User | null;
  couple: Couple | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [couple, setCouple] = useState<Couple | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const savedUser = localStorage.getItem('leela-user');
    const savedCouple = localStorage.getItem('leela-couple');
    
    if (savedUser && savedCouple) {
      try {
        setUser(JSON.parse(savedUser));
        setCouple(JSON.parse(savedCouple));
      } catch (error) {
        console.error('Error parsing saved auth data:', error);
        localStorage.removeItem('leela-user');
        localStorage.removeItem('leela-couple');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setCouple(data.user.couple);
        localStorage.setItem('leela-user', JSON.stringify(data.user));
        localStorage.setItem('leela-couple', JSON.stringify(data.user.couple));
        return true;
      } else {
        console.error('Login failed:', data.error);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setCouple(data.couple);
        localStorage.setItem('leela-user', JSON.stringify(data.user));
        localStorage.setItem('leela-couple', JSON.stringify(data.couple));
        return true;
      } else {
        console.error('Registration failed:', data.error);
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setCouple(null);
    localStorage.removeItem('leela-user');
    localStorage.removeItem('leela-couple');
  };

  const value = {
    user,
    couple,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}