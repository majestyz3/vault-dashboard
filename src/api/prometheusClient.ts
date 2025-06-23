import axios from 'axios';

const PROMETHEUS_ADDR = import.meta.env.VITE_PROMETHEUS_ADDR || process.env.PROMETHEUS_ADDR;

const promClient = axios.create({
  baseURL: PROMETHEUS_ADDR,
});

export const queryPrometheus = (query: string) =>
  promClient.get('/api/v1/query', { params: { query } });

export default promClient;
