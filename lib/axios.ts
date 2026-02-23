// lib/axios.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000', // mieux d'utiliser .env
  withCredentials: true, // nécessaire si tu veux envoyer des cookies (Sanctum SPA)
  headers: {
    Accept: 'application/json', // toujours utile pour API Laravel
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
