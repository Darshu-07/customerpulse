import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
});

export const apiClient = {
  getDashboardSummary: async () => {
    const response = await api.get('/dashboard/summary');
    return response.data;
  },
  
  getCustomers: async (params: any = {}) => {
    const response = await api.get('/customers', { params });
    return response.data;
  },
  
  getCustomer: async (customerId: string) => {
    const response = await api.get(`/customers/${customerId}`);
    return response.data;
  },
  
  getSegments: async () => {
    const response = await api.get('/segments');
    return response.data;
  },
  
  getChurnSummary: async () => {
    const response = await api.get('/churn/summary');
    return response.data;
  },
  
  getChurnAnalytics: async (groupBy: string = 'contract_type') => {
    const response = await api.get('/churn/analytics', { params: { group_by: groupBy } });
    return response.data;
  },
  
  getHighRiskCustomers: async (limit: number = 50) => {
    const response = await api.get('/churn/high-risk', { params: { limit } });
    return response.data;
  },
  
  getRevenueAtRisk: async () => {
    const response = await api.get('/revenue-at-risk');
    return response.data;
  },
  
  getCLVSummary: async () => {
    const response = await api.get('/clv/summary');
    return response.data;
  },
  
  getRetentionRecommendations: async (params: any = {}) => {
    const response = await api.get('/retention/recommendations', { params });
    return response.data;
  },
  
  simulateRetention: async (data: { high_risk_count: number, retention_improvement_pct: number }) => {
    const response = await api.post('/retention/simulate', data);
    return response.data;
  },
  
  getModelPerformance: async () => {
    const response = await api.get('/model/performance');
    return response.data;
  },
  
  trainModel: async () => {
    const response = await api.post('/model/train');
    return response.data;
  },
  
  askAI: async (question: string) => {
    const response = await api.post('/ai/query', { question });
    return response.data;
  },
  
  uploadData: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/data/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  
  getQualityReport: async () => {
    const response = await api.get('/data/quality-report');
    return response.data;
  },
  
  getDataStatus: async () => {
    const response = await api.get('/data/status');
    return response.data;
  },
};
