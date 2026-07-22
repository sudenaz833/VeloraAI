import axios from 'axios';
import axiosRetry from 'axios-retry';
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5131/api/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosRetry(axiosInstance, {
  retries: 3,
  retryDelay: (retryCount) =>{
    return retryCount * 3000;
  },
  retryCondition: (error) => {
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.response?.status >= 500;
  }
});
// otomatik olarak  tokenı  http başlığında backende iletme 
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {

    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized request. Clearing session storage token.');
      sessionStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
