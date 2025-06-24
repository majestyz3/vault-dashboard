import React from 'react';
import clusters from '../data/clusters.json';

export interface Cluster {
  id: string;
  name: string;
  region?: string;
  address: string;
  status: string;
  sealed: boolean;
  uptime: number;
  nodes: number;
}

interface Props {
  onSelect: (cluster: Cluster) => void;
}

const formatUptime = (seconds: number) => {
  const hrs = Math.floor(seconds / 3600);
  return `${hrs}h`;
};

const GlobalOverview: React.FC<Props> = ({ onSelect }) => (
  <div className="space-y-4">
    <h1 className="text-2xl text-vaultBlue font-semibold mb-4">Global Overview</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {clusters.map((c) => (
        <div
          key={c.id}
          className="bg-gray-800 p-4 rounded shadow hover:bg-gray-700 transition"
        >
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg">{c.name}</h2>
            <button
              onClick={() => onSelect(c)}
              className="text-sm text-vaultBlue hover:underline"
            >
              View
            </button>
          </div>
          <p className="text-sm text-gray-400">{c.region}</p>
          <p className="text-sm">
            Status:{' '}
            <span className={c.status === 'leader' ? 'text-green-400' : 'text-yellow-400'}>
              {c.status}
            </span>
          </p>
          <p className="text-sm">
            Seal:{' '}
            <span className={c.sealed ? 'text-red-400' : 'text-green-400'}>
              {c.sealed ? 'sealed' : 'unsealed'}
            </span>
          </p>
          <p className="text-sm">Nodes: {c.nodes}</p>
          <p className="text-sm">Uptime: {formatUptime(c.uptime)}</p>
        </div>
      ))}
    </div>
  </div>
);

export default GlobalOverview;
