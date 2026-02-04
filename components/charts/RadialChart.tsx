'use client';

import {
  RadialBarChart as RechartsRadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface RadialChartProps {
  data: { name: string; value: number; fill: string }[];
  height?: number;
  showLegend?: boolean;
  innerRadius?: string;
  outerRadius?: string;
}

export function RadialChart({
  data,
  height = 300,
  showLegend = true,
  innerRadius = '30%',
  outerRadius = '80%',
}: RadialChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsRadialBarChart
        cx="50%"
        cy="50%"
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        barSize={10}
        data={data}
      >
        <RadialBar
          background
          dataKey="value"
          cornerRadius={10}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1f2937',
            border: '1px solid #374151',
            borderRadius: '8px',
            color: '#fff',
          }}
        />
        {showLegend && (
          <Legend
            iconSize={10}
            layout="vertical"
            verticalAlign="middle"
            align="right"
            formatter={(value) => <span className="text-gray-300 text-sm">{value}</span>}
          />
        )}
      </RechartsRadialBarChart>
    </ResponsiveContainer>
  );
}
