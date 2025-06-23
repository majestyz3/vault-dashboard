import React from 'react';

interface Item {
  name: string;
  completed: boolean;
  points: number;
}

interface Props {
  title: string;
  items: Item[];
}

export const UseCaseChecklist: React.FC<Props> = ({ title, items }) => (
  <div className="mb-4 bg-gray-800 p-4 rounded shadow-md">
    <h2 className="text-lg text-vaultBlue font-semibold mb-2">{title}</h2>
    <ul className="space-y-1">
      {items.map((item) => (
        <li
          key={item.name}
          className="flex items-center text-gray-300 hover:bg-gray-700 rounded px-2 transition"
          title={item.completed ? 'Enabled' : 'Missing'}
        >
          <span
            className={`h-2 w-2 rounded-full mr-3 ${item.completed ? 'bg-green-500' : 'bg-red-500'}`}
          />
          <span className={item.completed ? 'line-through' : ''}>
            {item.name} ({item.points} pts)
          </span>
        </li>
      ))}
    </ul>
  </div>
);

export default UseCaseChecklist;
