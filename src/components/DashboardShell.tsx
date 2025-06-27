import React, { ReactNode } from 'react';

interface Props {
  tab: 'adoption' | 'operations';
  setTab: (tab: 'adoption' | 'operations') => void;
  onSignOut: () => void;
  onBack: () => void;
  children: ReactNode;
}

const DashboardShell: React.FC<Props> = ({ tab, setTab, onSignOut, onBack, children }) => (
  <div className="min-h-screen flex bg-gray-900 text-gray-100 font-sans">
    <aside className="w-56 bg-gray-800 p-4 space-y-4 flex flex-col">
      <h1 className="text-vaultBlue text-xl font-semibold">Vault Manager</h1>
      <nav className="flex-1 space-y-2">
        <button
          onClick={() => setTab('adoption')}
          className={`block w-full text-left hover:underline ${tab === 'adoption' ? 'text-vaultBlue' : 'text-gray-300'}`}
        >
          Adoption
        </button>
        <button
          onClick={() => setTab('operations')}
          className={`block w-full text-left hover:underline ${tab === 'operations' ? 'text-vaultBlue' : 'text-gray-300'}`}
        >
          Operations
        </button>
        <button onClick={onBack} className="block w-full text-left text-gray-300 hover:underline">
          Back to Overview
        </button>
      </nav>
      <button onClick={onSignOut} className="text-sm text-gray-400 hover:text-white">Sign out</button>
    </aside>
    <main className="flex-1 p-6">{children}</main>
  </div>
);

export default DashboardShell;
