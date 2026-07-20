import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5131/api/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
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
