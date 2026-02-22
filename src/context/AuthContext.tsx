import React, { createContext, useContext, useEffect, useState } from 'react';
import { API_BASE } from '../lib/config'
import api from '../lib/api'

type User = { id: string; email: string; name?: string; role?: string } | null;

type AuthContextType = {
  user: User;
  accessToken: string | null;
  refreshToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchWithAuth: (input: RequestInfo, init?: RequestInit) => Promise<any>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getStored() {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const userJson = localStorage.getItem('user');
  const user = userJson ? (JSON.parse(userJson) as User) : null;
  return { accessToken, refreshToken, user };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(getStored().user);
  const [accessToken, setAccessToken] = useState<string | null>(getStored().accessToken);
  const [refreshToken, setRefreshToken] = useState<string | null>(getStored().refreshToken);

  useEffect(() => {
    if (accessToken) localStorage.setItem('accessToken', accessToken);
    else localStorage.removeItem('accessToken');
  }, [accessToken]);

  useEffect(() => {
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    else localStorage.removeItem('refreshToken');
  }, [refreshToken]);

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  async function doRefresh(): Promise<boolean> {
    if (!refreshToken) return false;
    try {
      const res = await api.post('/auth/refresh', { refreshToken });
      const data = res.data;
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      return true;
    } catch (err) {
      return false;
    }
  }

  async function fetchWithAuth(input: RequestInfo, init: RequestInit = {}) {
    // convert input like '/api/..' to axios path '/..' because api.baseURL already includes /api
    let url: string
    if (typeof input === 'string') {
      if (input.startsWith('/api')) url = input.replace(/^\/api/, '')
      else url = input
    } else {
      // Request objects are uncommon here; fallback to string coercion
      url = String(input)
    }

    const method = (init.method || 'GET') as any
    const data = init.body ? JSON.parse(String(init.body)) : undefined
    const headers = { ...(init.headers as Record<string, any> || {}) }
    if (accessToken) headers.Authorization = `Bearer ${accessToken}`

    try {
      const res = await api.request({ url, method, data, headers })
      return res
    } catch (err: any) {
      if (err?.response?.status === 401) {
        const ok = await doRefresh()
        if (!ok) throw err
        const newToken = localStorage.getItem('accessToken')
        if (newToken) headers.Authorization = `Bearer ${newToken}`
        const retry = await api.request({ url, method, data, headers })
        return retry
      }
      throw err
    }
  }

  async function login(email: string, password: string) {
    const res = await api.post('/auth/login', { email, password })
    const data = res.data
    setUser(data.user)
    setAccessToken(data.accessToken)
    setRefreshToken(data.refreshToken)
  }

  async function register(email: string, password: string, name?: string) {
    const res = await api.post('/auth/register', { email, password, name })
    const data = res.data
    setUser(data.user)
    setAccessToken(data.accessToken)
    setRefreshToken(data.refreshToken)
  }

  async function logout() {
    try {
      await fetchWithAuth('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });
    } catch (err) {
      // ignore
    }
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
  }

  return (
    <AuthContext.Provider value={{ user, accessToken, refreshToken, login, register, logout, fetchWithAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
