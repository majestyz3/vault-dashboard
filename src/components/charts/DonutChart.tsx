import React from 'react';

interface Slice {
  label: string;
  value: number;
}

interface Props {
  slices: Slice[];
}

const DonutChart: React.FC<Props> = ({ slices }) => {
  const total = slices.reduce((sum, s) => sum + s.value, 0);
  let cumulative = 0;

  const paths = slices.map((slice) => {
    const startAngle = (cumulative / total) * Math.PI * 2;
    cumulative += slice.value;
    const endAngle = (cumulative / total) * Math.PI * 2;

    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
    const x1 = 50 + 40 * Math.cos(startAngle);
    const y1 = 50 + 40 * Math.sin(startAngle);
    const x2 = 50 + 40 * Math.cos(endAngle);
    const y2 = 50 + 40 * Math.sin(endAngle);

    return (
      <path
        key={slice.label}
        d={`M50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
        fill={slice.label === 'unused' ? '#4b5563' : '#3274d9'}
        stroke="#1f2937"
        strokeWidth="1"
      />
    );
  });

  return (
    <svg viewBox="0 0 100 100" className="w-40 h-40">
      {paths}
    </svg>
  );
};

export default DonutChart;
