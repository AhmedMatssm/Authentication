import axios from 'axios';

export const PARAMS = {
  API_URL: 'http://localhost:8000/api'
};
export const api = axios.create({
  baseURL: PARAMS.API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const setAuthHeader = () => {
    const token = localStorage.getItem(`jwt-${localStorage.getItem('role')}`) || '';
  
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  };