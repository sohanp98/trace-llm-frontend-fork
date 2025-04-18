import axios from 'axios';
import { HealthStatus } from '../types';

const API_BASE_URL = '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const checkHealth = async (): Promise<HealthStatus> => {
  try {
    const response = await apiClient.get('/health');
    return {
      status: response.status === 200 ? 'up' : 'down',
      lastChecked: new Date()
    };
  } catch (error) {
    return {
      status: 'down',
      lastChecked: new Date()
    };
  }
};