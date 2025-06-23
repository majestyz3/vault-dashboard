import axios from 'axios';

const VAULT_ADDR = import.meta.env.VITE_VAULT_ADDR || process.env.VAULT_ADDR;
const VAULT_TOKEN = import.meta.env.VITE_VAULT_TOKEN || process.env.VAULT_TOKEN;

const client = axios.create({
  baseURL: VAULT_ADDR,
});

export const setToken = (token: string) => {
  client.defaults.headers.common['X-Vault-Token'] = token;
};

// init from env if provided
if (VAULT_TOKEN) setToken(VAULT_TOKEN);

export const fetchAuthMethods = () => client.get('/v1/sys/auth');
export const fetchMounts = () => client.get('/v1/sys/mounts');
export const fetchAuditDevices = () => client.get('/v1/sys/audit');
export const fetchReplicationStatus = () => client.get('/v1/sys/replication/status');
export const fetchSealStatus = () => client.get('/v1/sys/seal-status');
export const fetchNamespaces = () => client.get('/v1/identity/namespace');
export const fetchEntities = () => client.get('/v1/identity/entity/name');
export const fetchPolicies = () => client.get('/v1/sys/policies/acl');

export default client;
