import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = { waiting: '#f59e0b', approved: '#10b981', rejected: '#ef4444' };

export default function LeadStatusChart({ data }) {
  if (!data) return null;

  const chartData = [
    { name: 'Waiting', value: data.waiting || 0, color: COLORS.waiting },
    { name: 'Approved', value: data.approved || 0, color: COLORS.approved },
    { name: 'Rejected', value: data.rejected || 0, color: COLORS.rejected },
  ].filter(d => d.value > 0);

  if (chartData.length === 0) return null;

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Lead Status</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: '#1e293b',
                border: 'none',
                borderRadius: '8px',
                color: '#f1f5f9'
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
