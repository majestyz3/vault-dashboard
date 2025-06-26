import React, { useEffect, useState } from 'react';
import RadialMeter from './components/RadialMeter';
import UseCaseChecklist from './components/UseCaseChecklist';
import ProgressBar from './components/charts/ProgressBar';
import LineChart from './components/charts/LineChart';
import DonutChart from './components/charts/DonutChart';
import TokenLogin from './components/TokenLogin';
import GlobalOverview, { Cluster } from './components/GlobalOverview';
import ClusterDetails from './components/ClusterDetails';
import useCases from './data/useCases.json';
import adoptionHistory from './data/adoptionHistory.json';
import {
  fetchAuthMethods,
  fetchMounts,
  fetchAuditDevices,
  fetchReplicationStatus,
  fetchSealStatus,
  fetchPolicies,
  setToken as setClientToken
} from './api/vaultClient';
import {
  fetchLeader,
  fetchHealth,
  setMetricsToken
} from './api/vaultMetricsClient';
import { queryPrometheus } from './api/prometheusClient';

interface UseCaseItem {
  name: string;
  dataset: string;
  check?: string;
  points: number;
  completed?: boolean;
}

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('vaultToken'));
  const [results, setResults] = useState<Record<string, any>>({});
  const [leader, setLeader] = useState<any>(null);
  const [health, setHealth] = useState<any>(null);
  const [uptime, setUptime] = useState<number | null>(null);
  const [nodeCount, setNodeCount] = useState<number | null>(null);
  const [leaderStatus, setLeaderStatus] = useState<string | null>(null);
  const [sealStatus, setSealStatus] = useState<string | null>(null);
  const [requestRate, setRequestRate] = useState<number | null>(null);
  const [errorRate, setErrorRate] = useState<number | null>(null);
  const [tokenRate, setTokenRate] = useState<number | null>(null);
  const [storageHealthy, setStorageHealthy] = useState<boolean | null>(null);
  const [tab, setTab] = useState<'adoption' | 'operations'>('adoption');
  const [currentCluster, setCurrentCluster] = useState<Cluster | null>(null);

  const evaluateCheck = (item: UseCaseItem, data: any): boolean => {
    if (item.dataset === 'mock') return false;
    if (item.dataset === 'audit') {
      return data && Object.keys(data).length > 0;
    }
    if (!data) return false;
    if (item.dataset === 'seal') {
      return /awskms|shamir/.test(JSON.stringify(data));
    }
    const pattern = item.check ? new RegExp(item.check) : null;
    return pattern ? pattern.test(JSON.stringify(data)) : false;
  };

  useEffect(() => {
    if (token) {
      setClientToken(token);
      setMetricsToken(token);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    if (!currentCluster) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const load = async () => {
      try {
        const [auth, mounts, audit, replication, seal, policies, leaderResp, healthResp, leaderMetric, sealMetric, reqRate, errRate, tokenMetric, upMetric, peersMetric, storageMetric] = await Promise.all([
          fetchAuthMethods(),
          fetchMounts(),
          fetchAuditDevices(),
          fetchReplicationStatus(),
          fetchSealStatus(),
          fetchPolicies(),
          fetchLeader(),
          fetchHealth(),
          queryPrometheus('vault_raft_leader'),
          queryPrometheus('vault_core_unsealed'),
          queryPrometheus('rate(vault_core_request_count[1m])'),
          queryPrometheus('rate(vault_core_request_errors[1m])'),
          queryPrometheus('rate(vault_token_create_total[1m])'),
          queryPrometheus('vault_uptime_seconds'),
          queryPrometheus('vault_raft_peers'),
          queryPrometheus('vault_storage_backend_healthy')
        ]);
        setResults({
          auth: auth.data,
          mounts: mounts.data,
          audit: audit.data,
          replication: replication.data,
          seal: seal.data,
          policies: policies.data
        });
        setLeader(leaderResp.data);
        setHealth(healthResp.data);
        const getValue = (res: any) => parseFloat(res.data.data.result[0]?.value[1] || '0');
        const getInt = (res: any) => parseInt(res.data.data.result[0]?.value[1] || '0', 10);

        setLeaderStatus(getInt(leaderMetric) === 1 ? 'leader' : 'standby');
        setSealStatus(getInt(sealMetric) === 1 ? 'unsealed' : 'sealed');
        setRequestRate(getValue(reqRate));
        setErrorRate(getValue(errRate));
        setTokenRate(getValue(tokenMetric));
        setUptime(getInt(upMetric));
        setNodeCount(getInt(peersMetric));
        setStorageHealthy(getInt(storageMetric) === 1);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
    const id = setInterval(load, 15000);
    return () => clearInterval(id);
  }, [token, currentCluster]);

  const totalPoints = Object.values(useCases).flat().reduce((sum, uc: UseCaseItem) => sum + uc.points, 0);

  const earnedPoints = Object.entries(useCases).reduce((acc, [category, list]) => {
    return (
      acc +
      list.reduce((sum: number, item: UseCaseItem) => {
        const data = (results as any)[item.dataset];
        const enabled = evaluateCheck(item, data);
        return sum + (enabled ? item.points : 0);
      }, 0)
    );
  }, 0);

  const percentage = totalPoints === 0 ? 0 : (earnedPoints / totalPoints) * 100;

  if (!token) {
    return <TokenLogin onSubmit={(t) => { setToken(t); localStorage.setItem('vaultToken', t); }} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 font-sans max-w-4xl mx-auto">
      {loading ? (
        <div className="text-center text-blue-500">Loading...</div>
      ) : (
        <>
          <header className="bg-gray-800 shadow-md mb-6 p-4 flex items-center justify-between">
            <h1 className="text-vaultBlue text-2xl font-semibold flex items-center">
              <span className="mr-2">🔐</span>
              Vault Global Manager
            </h1>
            <button
              onClick={() => { localStorage.removeItem('vaultToken'); setToken(null); setCurrentCluster(null); }}
              className="text-sm text-gray-300 hover:text-white"
            >
              Sign out
            </button>
          </header>
          {currentCluster ? (
            <>
              <div className="flex space-x-4 mb-6">
                <button onClick={() => setTab('adoption')} className={tab === 'adoption' ? 'text-vaultBlue' : 'text-gray-400'}>
                  Adoption Metrics
                </button>
                <button onClick={() => setTab('operations')} className={tab === 'operations' ? 'text-vaultBlue' : 'text-gray-400'}>
                  Operations
                </button>
                <button onClick={() => setCurrentCluster(null)} className="text-gray-400">Back to Overview</button>
              </div>
              {tab === 'adoption' ? (
                <>
                  <div className="flex justify-center mb-6">
                    <RadialMeter percentage={percentage} />
                  </div>
              {Object.entries(useCases).map(([category, list]) => {
                const items = list.map((item: UseCaseItem) => {
                  const data = (results as any)[item.dataset];
                  const completed = evaluateCheck(item, data);
                  return { ...item, completed };
                });
                const categoryPoints = list.reduce((s: number, i: UseCaseItem) => s + i.points, 0);
                const categoryEarned = items.reduce((s: number, i: UseCaseItem) => s + (i.completed ? i.points : 0), 0);
                const pct = (categoryEarned / categoryPoints) * 100;
                return (
                  <div key={category} className="mb-4">
                    <h2 className="text-vaultBlue mb-1">{category}</h2>
                    <ProgressBar percentage={pct} />
                    <UseCaseChecklist title="" items={items} />
                  </div>
                );
              })}
              <div className="mt-8">
                <h2 className="text-vaultBlue mb-2">Adoption Over Time</h2>
                <LineChart data={adoptionHistory as any} />
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 p-4 rounded">
                  <h2 className="text-vaultBlue mb-1">Leader Status</h2>
                  <p className={leaderStatus === 'leader' ? 'text-green-400' : 'text-yellow-400'}>{leaderStatus}</p>
                </div>
                <div className="bg-gray-800 p-4 rounded">
                  <h2 className="text-vaultBlue mb-1">Seal Status</h2>
                  <p className={sealStatus === 'unsealed' ? 'text-green-400' : 'text-red-400'}>{sealStatus}</p>
                </div>
                <div className="bg-gray-800 p-4 rounded">
                  <h2 className="text-vaultBlue mb-1">Request Rate</h2>
                  <p>{requestRate?.toFixed(2)} /s</p>
                </div>
                <div className="bg-gray-800 p-4 rounded">
                  <h2 className="text-vaultBlue mb-1">Error Rate</h2>
                  <p className={errorRate && errorRate > 1 ? 'text-red-400' : 'text-green-400'}>{errorRate?.toFixed(2)} /s</p>
                </div>
                <div className="bg-gray-800 p-4 rounded">
                  <h2 className="text-vaultBlue mb-1">Token Creation Rate</h2>
                  <p>{tokenRate?.toFixed(2)} /s</p>
                </div>
                <div className="bg-gray-800 p-4 rounded">
                  <h2 className="text-vaultBlue mb-1">Storage Healthy</h2>
                  <p className={storageHealthy ? 'text-green-400' : 'text-red-400'}>{storageHealthy ? 'healthy' : 'unhealthy'}</p>
                </div>
              </div>
              <div>
                <h2 className="text-vaultBlue mb-2">Secrets Engines</h2>
                <DonutChart slices={[{ label: 'engines', value: Object.keys(results.mounts || {}).length }]} />
              </div>
              <div>
                <h2 className="text-vaultBlue mb-2">Auth Methods</h2>
                <DonutChart slices={[{ label: 'auth', value: Object.keys(results.auth || {}).length }]} />
              </div>
              {leader && (
                <div className="bg-gray-800 p-4 rounded space-y-1">
                  <h2 className="text-vaultBlue mb-1">Cluster Status</h2>
                  {health && <p>Cluster: {health.cluster_name}</p>}
                  <p>Leader: {leader.leader_address}</p>
                  {uptime && <p>Uptime: {Math.floor(uptime / 3600)}h</p>}
                  {nodeCount && <p>Nodes: {nodeCount}</p>}
                </div>
              )}
              {results.audit && (
                <div className="bg-gray-800 p-4 rounded">
                  <h2 className="text-vaultBlue mb-1">Audit Devices</h2>
                  <p>{Object.keys(results.audit).join(', ')}</p>
                </div>
              )}
            </div>
          )}
            </>
          ) : (
            <GlobalOverview onSelect={(c) => setCurrentCluster(c)} />
          )}
        </>
      )}
      <footer className="mt-10 text-center text-xs text-gray-500">
        Powered by Vault Enterprise
      </footer>
    </div>
  );
};

export default App;
