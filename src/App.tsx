import React, { useEffect, useState } from 'react';
import RadialMeter from './components/RadialMeter';
import UseCaseChecklist from './components/UseCaseChecklist';
import useCases from './data/useCases.json';
import {
  fetchAuthMethods,
  fetchMounts,
  fetchAuditDevices,
  fetchReplicationStatus,
  fetchSealStatus,
  fetchPolicies
} from './api/vaultClient';

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
        const [auth, mounts, audit, replication, seal, policies] = await Promise.all([
          fetchAuthMethods(),
          fetchMounts(),
          fetchAuditDevices(),
          fetchReplicationStatus(),
          fetchSealStatus(),
          fetchPolicies()
        ]);
        setResults({
          auth: auth.data,
          mounts: mounts.data,
          audit: audit.data,
          replication: replication.data,
          seal: seal.data,
          policies: policies.data
        });
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
          <div className="flex justify-center mb-6">
            <RadialMeter percentage={percentage} />
          </div>
          {Object.entries(useCases).map(([category, list]) => {
            const items = list.map((item: UseCaseItem) => {
              const data = (results as any)[item.dataset];
              const completed = evaluateCheck(item, data);
              return { ...item, completed };
            });
            return <UseCaseChecklist key={category} title={category} items={items} />;
          })}
        </>
      )}
    </div>
  );
};

export default App;
