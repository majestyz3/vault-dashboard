import axios from 'axios';

const VAULT_ADDR = import.meta.env.VITE_VAULT_ADDR || process.env.VAULT_ADDR;
const VAULT_TOKEN = import.meta.env.VITE_VAULT_TOKEN || process.env.VAULT_TOKEN;

const metricsClient = axios.create({
  baseURL: VAULT_ADDR,
  headers: { 'X-Vault-Token': VAULT_TOKEN }
});

export const fetchLeader = () => metricsClient.get('/v1/sys/leader');
export const fetchMetrics = () => metricsClient.get('/v1/sys/metrics');
export const fetchReplicationStatus = () => metricsClient.get('/v1/sys/replication/status');

export default metricsClient;
