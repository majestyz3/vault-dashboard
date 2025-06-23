import React from 'react';

interface Props {
  percentage: number;
}

export const RadialMeter: React.FC<Props> = ({ percentage }) => (
  <div className="relative flex items-center justify-center w-40 h-40 shadow-md rounded-full bg-gray-800">
    <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 100 100">
      <circle
        className="text-gray-700"
        strokeWidth="10"
        stroke="currentColor"
        fill="transparent"
        r="45"
        cx="50"
        cy="50"
      />
      <circle
        className="text-vaultBlue"
        strokeWidth="10"
        strokeDasharray={Math.PI * 2 * 45}
        strokeDashoffset={Math.PI * 2 * 45 * (1 - percentage / 100)}
        strokeLinecap="round"
        stroke="currentColor"
        fill="transparent"
        r="45"
        cx="50"
        cy="50"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
    </svg>
    <span className="text-white text-xl font-semibold">{Math.round(percentage)}%</span>
  </div>
);

export default RadialMeter;
