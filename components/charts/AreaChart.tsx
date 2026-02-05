'use client';

import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface AreaChartProps {
  data: Record<string, string | number>[];
  xKey: string;
  yKey: string;
  height?: number;
  color?: string;
  showGrid?: boolean;
  gradient?: boolean;
  showValues?: boolean;
  xTickAngle?: number;
  xTickFormatter?: (value: any) => string;
}

export function AreaChart({
  data,
  xKey,
  yKey,
  height = 300,
  color = '#10b981',
  showGrid = true,
  gradient = true,
  showValues = false,
  xTickAngle,
  xTickFormatter,
}: AreaChartProps) {
  const gradientId = `colorGradient-${yKey}`;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsAreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
        {gradient && (
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
        )}
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#374151" />}
        <XAxis
          dataKey={xKey}
          tick={{ fill: '#9ca3af', fontSize: 12 }}
          axisLine={{ stroke: '#374151' }}
          tickLine={{ stroke: '#374151' }}
          angle={xTickAngle}
          textAnchor={xTickAngle ? 'end' : 'middle'}
          tickFormatter={xTickFormatter}
          interval={0}
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
        <Area
          type="monotone"
          dataKey={yKey}
          stroke={color}
          fillOpacity={1}
          fill={gradient ? `url(#${gradientId})` : color}
          dot={showValues ? { r: 3, stroke: color, fill: color } : false}
          label={showValues ? { position: 'top', fill: '#e5e7eb', fontSize: 12 } : undefined}
        />
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
}
