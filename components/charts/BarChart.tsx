'use client';

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface BarChartProps {
  data: Record<string, string | number>[];
  xKey: string;
  yKey: string;
  yKey2?: string;
  height?: number;
  colors?: string[];
  showGrid?: boolean;
  showLegend?: boolean;
}

export function BarChart({
  data,
  xKey,
  yKey,
  yKey2,
  height = 300,
  colors = ['#10b981', '#3b82f6'],
  showGrid = true,
  showLegend = false,
}: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#374151" />}
        <XAxis
          dataKey={xKey}
          tick={{ fill: '#9ca3af', fontSize: 12 }}
          axisLine={{ stroke: '#374151' }}
          tickLine={{ stroke: '#374151' }}
        />
        <YAxis
          tick={{ fill: '#9ca3af', fontSize: 12 }}
          axisLine={{ stroke: '#374151' }}
          tickLine={{ stroke: '#374151' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1f2937',
            border: '1px solid #374151',
            borderRadius: '8px',
            color: '#fff',
          }}
        />
        {showLegend && <Legend />}
        <Bar dataKey={yKey} fill={colors[0]} radius={[4, 4, 0, 0]} />
        {yKey2 && <Bar dataKey={yKey2} fill={colors[1]} radius={[4, 4, 0, 0]} />}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
