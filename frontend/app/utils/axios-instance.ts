import axios from 'axios';
import Cookies from 'js-cookie';

console.log ('process.env.API_BASE_URL => ', process.env.NEXT_PUBLIC_API_BASE_URL,)
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = Cookies.get('access_token');

  if (token && !config.url?.includes('/auth/login')) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;
