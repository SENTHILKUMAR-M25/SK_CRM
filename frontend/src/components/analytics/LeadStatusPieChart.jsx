import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import ChartCard from './ChartCard';

const COLORS = { waiting: '#f59e0b', approved: '#10b981', rejected: '#ef4444' };

const renderLabel = ({ name, percent }) => {
  if (percent < 0.05) return null;
  return `${name} ${(percent * 100).toFixed(0)}%`;
};

export default function LeadStatusPieChart({ data }) {
  const chartData = data ? [
    { name: 'Waiting', value: data.waiting || 0, color: COLORS.waiting },
    { name: 'Approved', value: data.approved || 0, color: COLORS.approved },
    { name: 'Rejected', value: data.rejected || 0, color: COLORS.rejected },
  ].filter(d => d.value > 0) : [];

  return (
    <ChartCard title="Lead Status Distribution" subtitle="Current pipeline breakdown">
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%" cy="50%"
              innerRadius={60} outerRadius={90}
              paddingAngle={3}
              dataKey="value"
              label={renderLabel}
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
