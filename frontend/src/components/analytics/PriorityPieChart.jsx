import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import ChartCard from './ChartCard';

const COLORS = { high: '#ef4444', medium: '#f59e0b', low: '#64748b' };

export default function PriorityPieChart({ data }) {
  const chartData = data ? [
    { name: 'High', value: data.high || 0, color: COLORS.high },
    { name: 'Medium', value: data.medium || 0, color: COLORS.medium },
    { name: 'Low', value: data.low || 0, color: COLORS.low },
  ].filter(d => d.value > 0) : [];

  return (
    <ChartCard title="Priority Distribution" subtitle="Lead priority breakdown">
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%" cy="50%"
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
              label={({ name, percent }) => percent > 0.05 ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
              labelLine={false}
            >
              {chartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Pie>
            <Tooltip
              contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#f1f5f9', fontSize: '13px' }}
              formatter={(val) => [val.toLocaleString(), 'Leads']}
            />
            <Legend verticalAlign="bottom" height={30} />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-slate-400 text-sm">No data available</div>
      )}
    </ChartCard>
  );
}
