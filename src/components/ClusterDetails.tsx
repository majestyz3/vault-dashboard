import React from 'react';
import { Cluster } from './GlobalOverview';

interface Props {
  cluster: Cluster;
  onBack: () => void;
}

const formatUptime = (seconds: number) => {
  const hrs = Math.floor(seconds / 3600);
  return `${hrs}h`;
};

const ClusterDetails: React.FC<Props> = ({ cluster, onBack }) => (
  <div className="space-y-4">
    <button onClick={onBack} className="text-sm text-vaultBlue hover:underline">
      &larr; Back
    </button>
    <h1 className="text-2xl text-vaultBlue font-semibold mb-4">{cluster.name}</h1>
    <div className="space-y-2 bg-gray-800 p-4 rounded">
      <p>Region: {cluster.region}</p>
      <p>Status: {cluster.status}</p>
      <p>Seal: {cluster.sealed ? 'sealed' : 'unsealed'}</p>
      <p>Nodes: {cluster.nodes}</p>
      <p>Uptime: {formatUptime(cluster.uptime)}</p>
      <p>Address: {cluster.address}</p>
    </div>
    <div className="text-sm text-gray-400">
      Detailed metrics would appear here.
    </div>
  </div>
);

export default ClusterDetails;
