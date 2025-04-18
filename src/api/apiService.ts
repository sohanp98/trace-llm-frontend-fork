import axios from 'axios';
import { QueryRequest, QueryResponse } from '../types';

const API_BASE_URL = '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const submitQuery = async (question: string): Promise<QueryResponse> => {
  const queryRequest: QueryRequest = {
    question,
    similarity_threshold: 0.3, // Hardcoded as per requirements
    top_k: 10 // Hardcoded as per requirements
  };

  try {
    const response = await apiClient.post<QueryResponse>('/query', queryRequest);
    return response.data;
  } catch (error) {
    console.error('Error submitting query:', error);
    throw error;
  }
};