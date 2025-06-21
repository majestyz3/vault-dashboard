import React from 'react';

interface Point {
  date: string;
  enabled: number;
}

interface Props {
  data: Point[];
}

const LineChart: React.FC<Props> = ({ data }) => {
  if (!data.length) return null;
  const maxY = Math.max(...data.map((d) => d.enabled));

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - (d.enabled / maxY) * 100;
    return `${x},${y}`;
  });

  return (
    <svg viewBox="0 0 100 100" className="w-full h-32">
      <polyline
        fill="none"
        stroke="#3274d9"
        strokeWidth="2"
        points={points.join(' ')}
      />
    </svg>
  );
};

export default LineChart;
