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
  <div className="mb-4">
    <h2 className="text-lg text-blue-400 font-mono mb-2">{title}</h2>
    <ul className="space-y-1">
      {items.map((item) => (
        <li key={item.name} className="flex items-center text-gray-300">
          <input
            type="checkbox"
            checked={item.completed}
            readOnly
            className="form-checkbox h-4 w-4 text-blue-500 mr-2"
          />
          <span className={item.completed ? 'line-through' : ''}>{item.name} ({item.points} pts)</span>
        </li>
      ))}
    </ul>
  </div>
);

export default UseCaseChecklist;
