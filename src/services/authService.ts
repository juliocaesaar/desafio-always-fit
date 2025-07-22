import api from './api';
import type { User } from '../types';

export const login = async (email: string, password: string) => {
  const response = await api.post('/login', { email, password });
  return response.data;
};

export const register = async (userData: User) => {
  const response = await api.post('/register', userData);
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/logout');
  return response.data;
};

export const getUser = async () => {
  const response = await api.get('/me');
  return response.data;
};

export const updateUser = async (userData: User) => {
  const response = await api.put('/user', userData);
  return response.data;
};

export const refreshToken = async () => {
  const response = await api.post('/refresh-token');
  return response.data;
};