import axios from 'axios';
import { baseURL } from './url';
import { parseCookies, destroyCookie } from 'nookies';
import { toast } from 'react-toastify';
import axiosRetry from 'axios-retry';

const api = axios.create({
  baseURL: baseURL,
  timeout: 50000,
  withCredentials: false,
});

axiosRetry(api, {
  retries: 1, 
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error: any) => {
    return (
      axiosRetry.isNetworkError(error) || 
      [500, 502, 503].includes(error?.response?.status)
    );
  },
});

const handleLogout = (message?: string) => {
  destroyCookie(null, 'accessToken');
  toast.error(message);
  window.location.href = '/signin'; 
};


api.interceptors.request.use(
  (config) => {
    const { accessToken } = parseCookies();
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      toast.error('Server is unreachable. Please try again later.');
      return Promise.reject(error);
    }

    const status = error.response.status;
    const url = error.config?.url || '';

    switch (status) {
      case 404:
        if (url.includes('/user')) {
          console.warn('User not found → logging out...');
          handleLogout('Your account no longer exists. Please signin again.');
        }
        break;
    
      case 401:
        console.warn('Unauthorized/Expired token → logging out...');
        handleLogout('Session expired. Please signin again.');
        break;
    
      case 500:
      case 502:
      case 503:
        console.warn('Server/DB error:', error.response.data);
        break;
    
      default:
        break;
    }
    return Promise.reject(error);
  }
);

export default api;











