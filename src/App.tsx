import React, { useEffect, useState } from 'react';
import RadialMeter from './components/RadialMeter';
import UseCaseChecklist from './components/UseCaseChecklist';
import useCases from './data/useCases.json';
import {
  fetchAuthMethods,
  fetchMounts,
  fetchAuditDevices,
  fetchReplicationStatus,
  fetchNamespaces,
  fetchEntities,
  fetchPolicies
} from './api/vaultClient';

interface UseCaseItem {
  name: string;
  api: string;
  check: string;
  points: number;
}

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<Record<string, any>>({});

  useEffect(() => {
    const load = async () => {
      try {
        const [auth, mounts, audit, replication, namespaces, entities, policies] = await Promise.all([
          fetchAuthMethods(),
          fetchMounts(),
          fetchAuditDevices(),
          fetchReplicationStatus(),
          fetchNamespaces(),
          fetchEntities(),
          fetchPolicies()
        ]);
        setResults({
          auth: auth.data,
          mounts: mounts.data,
          audit: audit.data,
          replication: replication.data,
          namespaces: namespaces.data,
          entities: entities.data,
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
        const data = (results as any)[item.api?.includes('auth') ? 'auth' : 'mounts'];
        const enabled = JSON.stringify(data || {}).includes(item.check);
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
          <div className="flex justify-center mb-6">
            <RadialMeter percentage={percentage} />
          </div>
          {Object.entries(useCases).map(([category, list]) => {
            const items = list.map((item: UseCaseItem) => {
              const data = (results as any)[item.api?.includes('auth') ? 'auth' : 'mounts'];
              const completed = JSON.stringify(data || {}).includes(item.check);
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
