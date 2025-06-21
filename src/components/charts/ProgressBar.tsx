import React from 'react';

interface Props {
  percentage: number;
}

const ProgressBar: React.FC<Props> = ({ percentage }) => (
  <div className="w-full bg-gray-700 h-4 rounded">
    <div
      className="h-4 rounded"
      style={{ width: `${percentage}%`, backgroundColor: percentage === 100 ? '#16a34a' : '#3274d9' }}
    />
  </div>
);

export default ProgressBar;
