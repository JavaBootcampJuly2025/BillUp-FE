import axios from 'axios';
import { Bill, CreateBillRequest } from '@/types/bill';
import { API_URL } from '@/utils/apiConstants';

const API_BASE_URL = API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken'); // Using your existing key
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const billApi = {
  createBill: async (billData: CreateBillRequest): Promise<Bill> => {
    const response = await api.post('/bills', billData);
    return response.data;
  },

  getBillsByUserId: async (userId: number): Promise<Bill[]> => {
    const response = await api.get(`/bills/user/${userId}`);
    return response.data;
  },

  getAllBills: async (): Promise<Bill[]> => {
    const response = await api.get('/bills');
    return response.data;
  }
};