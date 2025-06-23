import React, { useState } from 'react';

interface Props {
  onSubmit: (token: string) => void;
}

const TokenLogin: React.FC<Props> = ({ onSubmit }) => {
  const [token, setToken] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token) {
      onSubmit(token.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded shadow-md w-80">
        <h1 className="text-xl mb-4 text-vaultBlue font-semibold text-center">Vault Login</h1>
        <input
          type="password"
          placeholder="Vault Token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-vaultBlue"
        />
        <button type="submit" className="w-full bg-vaultBlue text-white py-2 rounded hover:bg-blue-600 transition">
          Enter
        </button>
      </form>
    </div>
  );
};

export default TokenLogin;
