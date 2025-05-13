import axios from 'axios';
import { baseURL } from './url';
import { parseCookies } from 'nookies';

const api = axios.create({
  baseURL: baseURL,
  timeout: 50000,
  withCredentials: false,
});

api.interceptors.request.use(
  (config) => {
    const { accessToken } = parseCookies();
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;







