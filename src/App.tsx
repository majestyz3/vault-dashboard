import React, { useEffect, useState } from 'react';
import RadialMeter from './components/RadialMeter';
import UseCaseChecklist from './components/UseCaseChecklist';
import ProgressBar from './components/charts/ProgressBar';
import LineChart from './components/charts/LineChart';
import DonutChart from './components/charts/DonutChart';
import useCases from './data/useCases.json';
import adoptionHistory from './data/adoptionHistory.json';
import {
  fetchAuthMethods,
  fetchMounts,
  fetchAuditDevices,
  fetchReplicationStatus,
  fetchSealStatus,
  fetchPolicies
} from './api/vaultClient';
import { fetchLeader } from './api/vaultMetricsClient';

interface UseCaseItem {
  name: string;
  dataset: string;
  check?: string;
  points: number;
  completed?: boolean;
}

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<Record<string, any>>({});
  const [leader, setLeader] = useState<any>(null);
  const [tab, setTab] = useState<'adoption' | 'operations'>('adoption');

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
    const load = async () => {
      try {
        const [auth, mounts, audit, replication, seal, policies, leaderResp] = await Promise.all([
          fetchAuthMethods(),
          fetchMounts(),
          fetchAuditDevices(),
          fetchReplicationStatus(),
          fetchSealStatus(),
          fetchPolicies(),
          fetchLeader()
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
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 font-mono">
      {loading ? (
        <div className="text-center text-blue-500">Loading...</div>
      ) : (
        <>
          <header className="bg-gray-800 shadow-md mb-6 p-4 flex items-center justify-between">
            <h1 className="text-vaultBlue text-2xl font-semibold">Vault Adoption Dashboard</h1>
          </header>
          <div className="flex space-x-4 mb-6">
            <button onClick={() => setTab('adoption')} className={tab === 'adoption' ? 'text-vaultBlue' : 'text-gray-400'}>
              Adoption Metrics
            </button>
            <button onClick={() => setTab('operations')} className={tab === 'operations' ? 'text-vaultBlue' : 'text-gray-400'}>
              Operations
            </button>
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
              <div>
                <h2 className="text-vaultBlue mb-2">Secrets Engines</h2>
                <DonutChart slices={[{ label: 'engines', value: Object.keys(results.mounts || {}).length }]} />
              </div>
              <div>
                <h2 className="text-vaultBlue mb-2">Auth Methods</h2>
                <DonutChart slices={[{ label: 'auth', value: Object.keys(results.auth || {}).length }]} />
              </div>
              {leader && (
                <div className="bg-gray-800 p-4 rounded">
                  <h2 className="text-vaultBlue mb-1">Leader</h2>
                  <p>{leader.leader_address}</p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default App;
