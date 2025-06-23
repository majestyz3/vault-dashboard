import axios from 'axios';

const VAULT_ADDR = import.meta.env.VITE_VAULT_ADDR || process.env.VAULT_ADDR;
const VAULT_TOKEN = import.meta.env.VITE_VAULT_TOKEN || process.env.VAULT_TOKEN;

const metricsClient = axios.create({
  baseURL: VAULT_ADDR,
});

export const setMetricsToken = (token: string) => {
  metricsClient.defaults.headers.common['X-Vault-Token'] = token;
};

if (VAULT_TOKEN) setMetricsToken(VAULT_TOKEN);

export const fetchLeader = () => metricsClient.get('/v1/sys/leader');
export const fetchMetrics = () => metricsClient.get('/v1/sys/metrics?format=prometheus');
export const fetchReplicationStatus = () => metricsClient.get('/v1/sys/replication/status');
export const fetchHealth = () => metricsClient.get('/v1/sys/health?standbyok=true');

export default metricsClient;
