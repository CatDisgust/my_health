'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend,
} from 'recharts';

export interface ChartDay {
  date: string;
  steps: number;
  sleepHours: number;
  energyLevel: number | null;
}

export function StepsBarChart({ data }: { data: ChartDay[] }) {
  return (
    <div className="h-[240px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#a1a1aa', fontSize: 11 }}
            tickFormatter={(v) => v.slice(5)}
          />
          <YAxis tick={{ fill: '#a1a1aa', fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#18181b',
              border: '1px solid #27272a',
              borderRadius: '6px',
            }}
            labelStyle={{ color: '#fff' }}
            formatter={((value: any) => [value, 'Steps']) as any}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Bar dataKey="steps" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SleepEnergyAreaChart({ data }: { data: ChartDay[] }) {
  return (
    <div className="h-[240px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#a1a1aa', fontSize: 11 }}
            tickFormatter={(v) => v.slice(5)}
          />
          <YAxis yAxisId="sleep" tick={{ fill: '#a1a1aa', fontSize: 11 }} />
          <YAxis
            yAxisId="energy"
            orientation="right"
            domain={[0, 10]}
            tick={{ fill: '#a1a1aa', fontSize: 11 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#18181b',
              border: '1px solid #27272a',
              borderRadius: '6px',
            }}
            labelStyle={{ color: '#fff' }}
            formatter={((value: any, name: string) => [
              value,
              name === 'sleepHours' ? 'Sleep (hrs)' : 'Energy',
            ]) as any}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend
            wrapperStyle={{ fontSize: 12 }}
            formatter={(value) => (value === 'sleepHours' ? 'Sleep (hrs)' : 'Energy')}
          />
          <Area
            yAxisId="sleep"
            type="monotone"
            dataKey="sleepHours"
            stroke="#8b5cf6"
            fill="#8b5cf6"
            fillOpacity={0.3}
            name="sleepHours"
          />
          <Area
            yAxisId="energy"
            type="monotone"
            dataKey="energyLevel"
            stroke="#22c55e"
            fill="#22c55e"
            fillOpacity={0.3}
            name="energyLevel"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
